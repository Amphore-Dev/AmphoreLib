import { createElement } from "react";

import { render } from "@testing-library/react";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { AmphoreProvider } from "./AmphoreProvider";
import {
	configToCssVars,
	cssVarsToDeclarations,
	mergeConfig,
} from "./UThemeConfig";

const SRC_DIR = path.resolve(__dirname, "..");

// The no-provider fallback shipped in lib/style.css. Generated from the same
// defaults the provider uses: `yarn tokens` rewrites it, the "is up to date"
// test below fails when it wasn't run.
const TOKENS_FILE = path.join(SRC_DIR, "styles/tokens.css");

/**
 * `--amp-*` vars read somewhere but on purpose absent from the fallback: only
 * for a var a component sets itself, on its own element. There are none today
 * (the local-var convention is `--_x`, which this check ignores). Anything
 * reported as undefined is a bug to fix, not a name to add here by reflex.
 */
const LOCAL_TOKENS: readonly string[] = [];

const generate = () =>
	[
		"/* Generated from src/theme by `yarn tokens`. Do not edit by hand. */",
		"/* The default light theme, for anything rendered without AmphoreProvider. */",
		":root {",
		`\t${cssVarsToDeclarations(configToCssVars(mergeConfig()), { separator: "\n\t" })}`,
		"}",
		"",
	].join("\n");

const stripComments = (source: string) =>
	source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "$1");

/**
 * Every `--amp-*` name read through `var()`. A name built by interpolation is
 * not a whole name and is skipped, in SCSS (`var(--amp-text-#{$step})`, the
 * mixins reject an off-scale step) as in a template string.
 */
const readTokens = (source: string) =>
	[
		...stripComments(source).matchAll(
			/var\(\s*(--amp-[\w-]+)(?![\w-]|#\{|\$\{)/g
		),
	].map((match) => match[1]);

const definedTokens = () =>
	[
		...readFileSync(TOKENS_FILE, "utf8").matchAll(/^\s*(--amp-[\w-]+):/gm),
	].map((match) => match[1]);

/** Hand-written sources that can read a token, keyed by path under src/. */
const sourceFiles = () =>
	(readdirSync(SRC_DIR, { recursive: true, encoding: "utf8" }) as string[])
		.filter(
			(file) => /\.(scss|tsx?)$/.test(file) && !/\.test\.tsx?$/.test(file)
		)
		.map((file) => ({
			file,
			source: readFileSync(path.join(SRC_DIR, file), "utf8"),
		}));

describe("tokens.css", () => {
	it("is up to date with the default theme (run `yarn tokens`)", () => {
		const expected = generate();
		if (process.env.UPDATE_TOKENS) writeFileSync(TOKENS_FILE, expected);
		expect(readFileSync(TOKENS_FILE, "utf8")).toBe(expected);
	});

	it("only defines what the provider sets too, so a provider always wins", () => {
		const { container } = render(
			createElement(AmphoreProvider, { theme: "light" })
		);
		const root = container.querySelector(".amp-root") as HTMLElement;

		const notSetInline = definedTokens().filter(
			(name) => !root.style.getPropertyValue(name)
		);
		expect(notSetInline).toEqual([]);
	});
});

describe("--amp-* reads", () => {
	it("finds reads across lines, nested in a fallback, and skips comments", () => {
		const source = `
			// var(--amp-commented-line)
			/* var(--amp-commented-block) */
			.a {
				color: var(--amp-color-ink);
				border: 1px solid var(
					--amp-color-border
				);
				outline: var(--_local, var(--amp-color-primary));
				background: var(--_local);
				font-size: var(--amp-text-#{$step});
				line-height: var(--amp-leading-\${step});
			}
		`;
		expect(readTokens(source)).toEqual([
			"--amp-color-ink",
			"--amp-color-border",
			"--amp-color-primary",
		]);
	});

	it("are all defined in the fallback, or listed as local", () => {
		const defined = new Set([...definedTokens(), ...LOCAL_TOKENS]);

		const undefinedReads = sourceFiles().flatMap(({ file, source }) =>
			readTokens(source)
				.filter((name) => !defined.has(name))
				.map((name) => `${file}: ${name}`)
		);
		expect(undefinedReads).toEqual([]);
	});

	it("actually covers the scss sources, so the check above can't pass empty", () => {
		const scssReads = sourceFiles()
			.filter(({ file }) => file.endsWith(".scss"))
			.flatMap(({ source }) => readTokens(source));
		expect(scssReads.length).toBeGreaterThan(500);
	});

	it("keeps no stale entry in LOCAL_TOKENS", () => {
		const reads = new Set(
			sourceFiles().flatMap(({ source }) => readTokens(source))
		);
		expect(LOCAL_TOKENS.filter((name) => !reads.has(name))).toEqual([]);
	});
});
