#!/usr/bin/env node

/**
 * Local screenshot regression over every Storybook story.
 *
 *   yarn visual:ref          build Storybook, capture .visual/reference
 *   yarn visual              build Storybook, compare against the references
 *
 * Options: `--no-build` reuses .visual/storybook as it is (it may be stale, so
 * only use it when src/ did not change since the last build), and
 * `--filter=<text>` compares only the story ids containing <text>.
 *
 * References stay out of git: text rendering differs from one OS to another,
 * so an image is only meaningful on the machine that took it. Take them on the
 * starting commit, change the code, compare. Exit code 1 on any difference.
 *
 * Any differing pixel fails: a flaky story has to be made deterministic here
 * or tagged `no-visual`, never hidden behind a tolerance.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pixelmatch from "pixelmatch";
import { chromium } from "playwright";
import { PNG } from "pngjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VISUAL_DIR = path.join(ROOT, ".visual");
const STORYBOOK_DIR = path.join(VISUAL_DIR, "storybook");
const REFERENCE_DIR = path.join(VISUAL_DIR, "reference");
const REFERENCE_TMP_DIR = path.join(VISUAL_DIR, "reference.tmp");
const DIFF_DIR = path.join(VISUAL_DIR, "diff");

const EXCLUDE_TAG = "no-visual";
const VIEWPORT = { width: 1280, height: 800 };
const WORKERS = Math.max(2, Math.floor(os.availableParallelism() / 2));
const STORY_TIMEOUT_MS = 60_000;

// A story counts as settled once this many consecutive captures, this far
// apart, are byte-identical with no request in flight.
const SETTLE_SHOTS = 3;
const SETTLE_INTERVAL_MS = 150;
const SETTLE_TIMEOUT_MS = 15_000;

// A pending timeout up to this long means the story is still about to change
// (a list "loading" for a second, a debounce). A chain of timers is waited for
// until it ends, and one that outlasts SETTLE_TIMEOUT_MS fails the story instead
// of comparing by luck.
// Has to stay under 5s: Storybook arms a timeout that long on every render, as
// a safety race around waitForAnimations, and never clears it.
const TRACKED_TIMEOUT_MS = 4_000;

// Overlays stay closed until someone opens them, and no story does it on its
// own: without this, Modal, Select, Dropdown, Popover, Tooltip and ContextMenu
// panels are never rendered, so their CSS could break unnoticed. The first
// matching title wins, and the opened state is a second image, <id>--open.png.
const OPEN_SUFFIX = "--open";
const OPEN_TIMEOUT_MS = 5_000;
const OPENERS = [
	{
		title: /\/(Modal|ConfirmModal|FiltersModal)$/,
		target: "#storybook-root button:not(:disabled)",
		action: "click",
	},
	{
		title: /\/Tooltip$/,
		target: "#storybook-root :is(button, a, [tabindex]):not(:disabled)",
		action: "hover",
	},
	{
		title: /\/ContextMenu$/,
		target: "text=/right-click/i",
		action: "click",
		options: { button: "right" },
	},
	{
		title: /./,
		target: '#storybook-root :is([aria-haspopup], [aria-expanded="false"]):not(:disabled)',
		action: "click",
	},
];

// Stories render "today" (calendars, relative dates) from this instant.
const FIXED_NOW = new Date("2026-01-15T12:00:00.000Z");

// Served inside iframe.html, so it is active from the very first paint: a rule
// added after load would let a transition start first. Canvases are hidden
// because pdf.js paints them progressively, with no event marking the end.
const FREEZE_CSS = `
*, *::before, *::after {
	animation: none !important;
	transition: none !important;
	scroll-behavior: auto !important;
	caret-color: transparent !important;
}
canvas {
	visibility: hidden !important;
}`;

// Runs before any story code. Random ids end up in the DOM and some stories
// derive their content from them, so one seed per page keeps them identical.
// Also counts the short timeouts still pending, for the settle check.
function prepareWindow(trackedTimeoutMs) {
	let state = 0x2f6e2b1;
	Math.random = () => {
		state = (state + 0x6d2b79f5) | 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
	if (globalThis.crypto?.randomUUID) {
		let count = 0;
		crypto.randomUUID = () =>
			`00000000-0000-4000-8000-${String(++count).padStart(12, "0")}`;
	}

	const pending = new Set();
	const { setTimeout: nativeSet, clearTimeout: nativeClear } = window;
	window.setTimeout = (callback, delay = 0, ...args) => {
		const id = nativeSet(
			(...callbackArgs) => {
				pending.delete(id);
				callback(...callbackArgs);
			},
			delay,
			...args
		);
		if (delay <= trackedTimeoutMs) pending.add(id);
		return id;
	};
	window.clearTimeout = (id) => {
		pending.delete(id);
		nativeClear(id);
	};
	window.__visualPendingTimeouts = () => pending.size;
}

// Partial raster reuses the pixels of an already painted tile, so anti-aliased
// corners end up 1/255 off depending on how a page happened to repaint: the
// same story gave 2 or 3 distinct images over 24 loads. Without it, every load
// rasters from scratch and 216 loads of the worst stories gave one image each.
const CHROMIUM_ARGS = ["--disable-partial-raster"];

const MIME_TYPES = {
	".css": "text/css",
	".html": "text/html",
	".ico": "image/x-icon",
	".js": "text/javascript",
	".json": "application/json",
	".map": "application/json",
	".mjs": "text/javascript",
	".pdf": "application/pdf",
	".png": "image/png",
	".svg": "image/svg+xml",
	".woff": "font/woff",
	".woff2": "font/woff2",
};

/** Same-origin server for the built Storybook, with FREEZE_CSS in iframe.html. */
function serveStorybook() {
	const server = http.createServer((request, response) => {
		const { pathname } = new URL(request.url, "http://localhost");
		const relative = path.normalize(decodeURIComponent(pathname));
		const file = path.join(STORYBOOK_DIR, relative);
		if (
			!file.startsWith(STORYBOOK_DIR + path.sep) ||
			!fs.existsSync(file) ||
			!fs.statSync(file).isFile()
		) {
			response.writeHead(404).end();
			return;
		}
		const type = MIME_TYPES[path.extname(file)];
		const headers = type ? { "Content-Type": type } : {};
		if (pathname === "/iframe.html") {
			const html = fs
				.readFileSync(file, "utf8")
				.replace("<head>", `<head><style>${FREEZE_CSS}</style>`);
			response.writeHead(200, headers).end(html);
			return;
		}
		response.writeHead(200, headers);
		fs.createReadStream(file).pipe(response);
	});
	return new Promise((resolve) => {
		server.listen(0, "127.0.0.1", () => {
			resolve({
				server,
				baseUrl: `http://127.0.0.1:${server.address().port}`,
			});
		});
	});
}

function buildStorybook() {
	console.log("Building Storybook into .visual/storybook...");
	const result = spawnSync(
		path.join(ROOT, "node_modules/.bin/storybook"),
		["build", "--quiet", "--output-dir", STORYBOOK_DIR],
		{ cwd: ROOT, stdio: ["ignore", "ignore", "inherit"] }
	);
	if (result.status !== 0) throw new Error("Storybook build failed");
}

function readStories() {
	const indexFile = path.join(STORYBOOK_DIR, "index.json");
	if (!fs.existsSync(indexFile)) {
		throw new Error("No build in .visual/storybook: drop --no-build");
	}
	const { entries } = JSON.parse(fs.readFileSync(indexFile, "utf8"));
	const stories = Object.values(entries).filter(
		(entry) => entry.type === "story"
	);
	const included = stories.filter(
		(story) => !story.tags?.includes(EXCLUDE_TAG)
	);
	return { included, excluded: stories.length - included.length };
}

/** Network stays out of the picture: remote images become a fixed placeholder. */
function stubRemoteRequests(baseUrl) {
	const placeholder = new PNG({ width: 240, height: 120 });
	placeholder.data.fill(200);
	const body = PNG.sync.write(placeholder);
	return (route) => {
		if (route.request().resourceType() === "image") {
			return route.fulfill({ contentType: "image/png", body });
		}
		return route.abort();
	};
}

function trackRequests(page) {
	const tracker = { inFlight: 0 };
	page.on("request", () => tracker.inFlight++);
	page.on("requestfinished", () => tracker.inFlight--);
	page.on("requestfailed", () => tracker.inFlight--);
	return tracker;
}

async function waitForStory(page, id) {
	await page.waitForFunction(
		() => window.__STORYBOOK_PREVIEW__?.currentRender?.phase === "finished",
		null,
		{ timeout: STORY_TIMEOUT_MS }
	);
	const failed = await page.evaluate(() =>
		document.body.classList.contains("sb-show-errordisplay")
	);
	// A crashed story would otherwise compare equal to its own crash screen.
	if (failed) throw new Error(`story ${id} failed to render`);
}

async function waitForAssets(page) {
	await page.evaluate(async () => {
		await document.fonts.ready;
		await Promise.all(
			[...document.images]
				.filter((image) => !image.complete)
				.map(
					(image) =>
						new Promise((resolve) => {
							image.addEventListener("load", resolve);
							image.addEventListener("error", resolve);
						})
				)
		);
	});
}

async function captureSettled(page, tracker, id) {
	const deadline = Date.now() + SETTLE_TIMEOUT_MS;
	let previous = null;
	let identical = 0;
	while (Date.now() < deadline) {
		await waitForAssets(page);
		const shot = await page.screenshot({
			fullPage: true,
			animations: "disabled",
			caret: "hide",
		});
		const timeouts = await page.evaluate(() =>
			window.__visualPendingTimeouts()
		);
		const idle = tracker.inFlight === 0 && timeouts === 0;
		identical = idle && previous?.equals(shot) ? identical + 1 : 0;
		if (identical === SETTLE_SHOTS - 1) return shot;
		previous = shot;
		await new Promise((resolve) => {
			setTimeout(resolve, SETTLE_INTERVAL_MS);
		});
	}
	throw new Error(
		`story ${id} never settled: make it deterministic or tag it ${EXCLUDE_TAG}`
	);
}

/** Opens the story's overlay, when it has one. Returns whether it acted. */
async function openOverlay(page, title) {
	const { target, action, options } = OPENERS.find((opener) =>
		opener.title.test(title)
	);
	const trigger = page.locator(target).first();
	if ((await trigger.count()) === 0) return false;
	await trigger[action]({ timeout: OPEN_TIMEOUT_MS, ...options });
	return true;
}

/** Returns the story's images: as rendered, then with its overlay open. */
async function captureStory(browser, baseUrl, stubRemote, { id, title }) {
	// A context per story: nothing (storage, focus, URL) leaks into the next
	// one, whatever order the workers happen to pick them in.
	const context = await browser.newContext({
		viewport: VIEWPORT,
		deviceScaleFactor: 1,
		colorScheme: "light",
		locale: "en-US",
		timezoneId: "UTC",
	});
	try {
		await context.clock.setFixedTime(FIXED_NOW);
		await context.addInitScript(prepareWindow, TRACKED_TIMEOUT_MS);
		await context.route(
			(url) => url.origin !== baseUrl && url.protocol.startsWith("http"),
			stubRemote
		);
		const page = await context.newPage();
		const tracker = trackRequests(page);
		await page.goto(`${baseUrl}/iframe.html?id=${id}&viewMode=story`, {
			timeout: STORY_TIMEOUT_MS,
		});
		await waitForStory(page, id);
		const images = [
			{ name: id, shot: await captureSettled(page, tracker, id) },
		];
		if (await openOverlay(page, title)) {
			images.push({
				name: `${id}${OPEN_SUFFIX}`,
				shot: await captureSettled(page, tracker, id),
			});
		}
		return images;
	} finally {
		await context.close();
	}
}

/** Pads an image with transparent pixels, for a size change to be a diff too. */
function padTo(image, width, height) {
	if (image.width === width && image.height === height) return image;
	const padded = new PNG({ width, height });
	PNG.bitblt(image, padded, 0, 0, image.width, image.height, 0, 0);
	return padded;
}

/** Returns 0 when both PNG are identical, or the differing pixel count. */
function compare(id, referenceBytes, actualBytes) {
	if (referenceBytes.equals(actualBytes)) return 0;
	const rawReference = PNG.sync.read(referenceBytes);
	const rawActual = PNG.sync.read(actualBytes);
	const width = Math.max(rawReference.width, rawActual.width);
	const height = Math.max(rawReference.height, rawActual.height);
	const reference = padTo(rawReference, width, height);
	const actual = padTo(rawActual, width, height);
	if (reference.data.equals(actual.data)) return 0;

	const diff = new PNG({ width, height });
	const pixels = pixelmatch(
		reference.data,
		actual.data,
		diff.data,
		width,
		height,
		{ threshold: 0, includeAA: true }
	);
	const directory = path.join(DIFF_DIR, id);
	fs.mkdirSync(directory, { recursive: true });
	fs.writeFileSync(path.join(directory, "reference.png"), referenceBytes);
	fs.writeFileSync(path.join(directory, "actual.png"), actualBytes);
	fs.writeFileSync(path.join(directory, "diff.png"), PNG.sync.write(diff));
	return Math.max(pixels, 1);
}

function parseArguments() {
	const known = new Set(["--update", "--no-build"]);
	const filterArg = process.argv.find((arg) => arg.startsWith("--filter="));
	for (const arg of process.argv.slice(2)) {
		if (!known.has(arg) && arg !== filterArg) {
			throw new Error(`Unknown option ${arg}`);
		}
	}
	const update = process.argv.includes("--update");
	const filter = filterArg?.slice("--filter=".length);
	if (update && filter) {
		throw new Error("--filter only applies to a comparison");
	}
	return { update, filter, build: !process.argv.includes("--no-build") };
}

async function main() {
	const { update, filter, build } = parseArguments();
	if (build) buildStorybook();

	const { included, excluded } = readStories();
	const stories = filter
		? included.filter(({ id }) => id.includes(filter))
		: included;

	fs.rmSync(REFERENCE_TMP_DIR, { recursive: true, force: true });
	fs.rmSync(DIFF_DIR, { recursive: true, force: true });
	if (update) fs.mkdirSync(REFERENCE_TMP_DIR, { recursive: true });

	const { server, baseUrl } = await serveStorybook();
	const browser = await chromium.launch({ args: CHROMIUM_ARGS });
	const stubRemote = stubRemoteRequests(baseUrl);
	const startedAt = Date.now();
	const errors = [];
	const diffs = [];
	const missing = [];
	const captured = new Set();

	const saveOrCompare = ({ name, shot }) => {
		captured.add(name);
		if (update) {
			fs.writeFileSync(path.join(REFERENCE_TMP_DIR, `${name}.png`), shot);
			return;
		}
		const referenceFile = path.join(REFERENCE_DIR, `${name}.png`);
		if (!fs.existsSync(referenceFile)) {
			missing.push(name);
			return;
		}
		const reference = fs.readFileSync(referenceFile);
		const pixels = compare(name, reference, shot);
		if (pixels > 0) diffs.push({ id: name, pixels });
	};

	const queue = [...stories];
	const worker = async () => {
		for (let story = queue.shift(); story; story = queue.shift()) {
			try {
				const images = await captureStory(
					browser,
					baseUrl,
					stubRemote,
					story
				);
				images.forEach(saveOrCompare);
			} catch (error) {
				errors.push(`${story.id}: ${error.message.split("\n")[0]}`);
			}
		}
	};
	await Promise.all(Array.from({ length: WORKERS }, worker));

	await browser.close();
	server.close();
	const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);

	// A story that vanished, or an overlay that no longer opens, proves nothing
	// anymore: it is a failure, not a silent loss of coverage.
	const orphans =
		update || filter || !fs.existsSync(REFERENCE_DIR)
			? []
			: fs
					.readdirSync(REFERENCE_DIR)
					.map((file) => path.basename(file, ".png"))
					.filter((name) => !captured.has(name));

	for (const error of errors) console.error(`ERROR    ${error}`);
	for (const id of missing) console.error(`MISSING  ${id}: no reference`);
	for (const id of orphans) console.error(`ORPHAN   ${id}: not captured`);
	for (const { id, pixels } of diffs.sort((a, b) => b.pixels - a.pixels)) {
		console.error(`DIFF     ${id}: ${pixels} px`);
	}
	console.log(
		`${stories.length} stories, ${captured.size} images (${excluded} excluded by ${EXCLUDE_TAG}), ${seconds}s, ${WORKERS} workers`
	);

	if (update) {
		if (errors.length > 0) {
			fs.rmSync(REFERENCE_TMP_DIR, { recursive: true, force: true });
			throw new Error(
				`${errors.length} stories failed, references left untouched`
			);
		}
		fs.rmSync(REFERENCE_DIR, { recursive: true, force: true });
		fs.renameSync(REFERENCE_TMP_DIR, REFERENCE_DIR);
		console.log(`References saved to .visual/reference`);
		return;
	}

	const failures =
		errors.length + missing.length + orphans.length + diffs.length;
	if (failures > 0) {
		if (diffs.length > 0) console.error("Diffs in .visual/diff");
		throw new Error(
			`${diffs.length} diffs, ${errors.length} errors, ${missing.length} missing, ${orphans.length} orphans`
		);
	}
	console.log("No visual difference");
}

main().catch((error) => {
	console.error(error.message);
	process.exitCode = 1;
});
