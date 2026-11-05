#!/usr/bin/env node

/**
 * Moves raw values in SCSS onto the theme tokens and scale functions.
 *
 *   node scripts/migrate-tokens.mjs <file or folder>...
 *
 * Exact matches only, so what renders stays the same; a value with no exact
 * token is left alone, for `yarn lint:css` to list. It never rounds:
 *   - lengths in rem on the 0.125rem grid -> space(n), `#{space(n)}` in a
 *     custom property, a calc() or a min()/max();
 *   - font-size / line-height -> var(--amp-text-*) / var(--amp-leading-*), or
 *     @include text(step) when both are one step of the scale;
 *   - font weights -> weight(name);
 *   - shadows, z-index layers, border widths, durations, `ease` -> their token;
 *   - a focus outline and its offset -> @include focus-ring;
 *   - overflow / text-overflow / white-space in a row -> @include truncate.
 *
 * The px widths of lines are the exception to "rem only": they become
 * --amp-border-width-*, which holds the same px value. Other px lengths are
 * left alone, a px and a rem differ as soon as the root font size does.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import postcss from "postcss";
import scss from "postcss-scss";

const STYLES_DIR = path.resolve("src/styles");

/** [font size, line height] of each step, as in src/theme/CThemeConfig.ts. */
const TEXT = {
	xs: ["0.75rem", "1.25rem"],
	sm: ["0.875rem", "1.5rem"],
	base: ["1rem", "1.5rem"],
	lg: ["1.125rem", "1.5rem"],
	xl: ["1.25rem", "1.75rem"],
	"2xl": ["1.5rem", "2rem"],
	"3xl": ["1.875rem", "2.5rem"],
	"4xl": ["2.25rem", "3rem"],
};
const SIZE_STEP = Object.fromEntries(
	Object.entries(TEXT).map(([step, [size]]) => [size, step])
);
/** A line height alone, its size being inherited or off scale. */
const LEADING_STEP = {
	"1.25rem": "xs",
	"1.5rem": "base",
	"1.75rem": "xl",
	"2rem": "2xl",
	"2.5rem": "3xl",
	"3rem": "4xl",
	1: "none",
	1.3: "tight",
	1.4: "snug",
	1.5: "normal",
};
const WEIGHTS = {
	400: "regular",
	500: "medium",
	600: "semibold",
	700: "bold",
	bold: "bold",
};
const SHADOWS = {
	"0 4px 12px rgba(0, 0, 0, 0.12)": "sm",
	"0 4px 12px rgba(0, 0, 0, 0.15)": "md",
	"0 4px 16px rgba(0, 0, 0, 0.12)": "lg",
	"0 8px 24px rgba(0, 0, 0, 0.14)": "xl",
};
const SHADOW_COLORS = {
	"rgba(0, 0, 0, 0.06)": 1,
	"rgba(0, 0, 0, 0.08)": 2,
	"rgba(0, 0, 0, 0.1)": 3,
	"rgba(0, 0, 0, 0.12)": 4,
	"rgba(0, 0, 0, 0.16)": 5,
};
const LAYERS = { 20: "sticky", 50: "raised", 1000: "overlay" };
const DURATIONS = {
	"0.1s": "instant",
	"0.15s": "fast",
	"0.2s": "base",
	"0.3s": "slow",
};
const BORDER_WIDTHS = {
	"1px": "sm",
	"1.5px": "md",
	"2px": "lg",
	"3px": "xl",
};
const ICONS = {
	"0.75rem": "xs",
	"0.875rem": "sm",
	"1rem": "md",
	"1.125rem": "lg",
	"1.25rem": "xl",
	"2rem": "2xl",
};

const LENGTH_PROP =
	/^(margin|padding)(-|$)|^(row-|column-)?gap$|^(min-|max-)?(width|height)$|^(top|right|bottom|left|inset|transform)$/;
const LINE_PROP = /^border(-(top|right|bottom|left))?$/;
const ICON_SELECTOR = /picto|icon|chevron|svg/i;
const HAIRLINE_PROP = /^(width|height)$/;
/** A rem length that stands on its own, inside a function or not. */
const REM = /(?<![\w.#$-])(-?\d*\.?\d+)rem(?![\w-])/g;

function spaceOf(number) {
	const steps = Number(number) / 0.25;
	return Math.round(steps * 2) === steps * 2 ? `space(${steps})` : null;
}

function selectorOf(node) {
	const parts = [];
	for (let at = node.parent; at && at.type !== "root"; at = at.parent) {
		if (at.selector) parts.push(at.selector);
	}
	return parts.join(" ");
}

/**
 * Sass only evaluates a function where it sees a plain value: interpolate
 * inside a custom property, and inside any CSS function.
 */
function migrateLengths(value, { interpolate }) {
	let depth = 0;
	return value.replace(/[()]|[^()]+/g, (chunk) => {
		if (chunk === "(") depth += 1;
		else if (chunk === ")") depth -= 1;
		else {
			return chunk.replace(REM, (all, number) => {
				const space = spaceOf(number);
				if (!space) return all;
				return interpolate || depth ? `#{${space}}` : space;
			});
		}
		return chunk;
	});
}

function migrateTransition(value) {
	return value
		.replace(/(?<![\w.-])\d*\.?\d+s\b/g, (duration) =>
			DURATIONS[duration]
				? `var(--amp-duration-${DURATIONS[duration]})`
				: duration
		)
		.replace(/(?<![\w-])ease(?![\w-])/g, "var(--amp-ease)");
}

function migrateShadow(value) {
	const compact = value.replace(/\s+/g, " ");
	if (SHADOWS[compact]) return `var(--amp-shadow-${SHADOWS[compact]})`;
	return value.replace(/rgba\(0, 0, 0, [\d.]+\)/g, (color) =>
		SHADOW_COLORS[color]
			? `var(--amp-shadow-color-${SHADOW_COLORS[color]})`
			: color
	);
}

function migrateFocus(rule, used) {
	const decls = rule.nodes.filter((node) => node.type === "decl");
	const outline = decls.find((decl) => decl.prop === "outline");
	const offset = decls.find((decl) => decl.prop === "outline-offset");
	const line = outline?.value.match(/^2px solid (.+)$/s);

	if (line && offset && /^-?2px$/.test(offset.value)) {
		const color = line[1].replace(
			/var\(--amp-color-primary\)/,
			"var(--amp-focus-color)"
		);
		const args = [];
		if (color !== "var(--amp-focus-color)") args.push(color);
		if (offset.value === "-2px") args.push("$inset: true");
		outline.replaceWith(
			postcss.atRule({
				name: "include",
				params: args.length
					? `focus-ring(${args.join(", ")})`
					: "focus-ring",
				raws: { before: outline.raws.before, afterName: " " },
			})
		);
		offset.remove();
		used.mixins = true;
		return;
	}
	if (line) outline.value = `var(--amp-focus-width) solid ${line[1]}`;
	if (offset?.value === "2px") offset.value = "var(--amp-focus-offset)";
}

function migrateTruncate(rule, used) {
	const nodes = rule.nodes;
	for (let i = 0; i + 2 < nodes.length; i += 1) {
		const run = nodes.slice(i, i + 3);
		const text = run.map((n) =>
			n.type === "decl" ? `${n.prop}: ${n.value}` : ""
		);
		if (
			text.includes("overflow: hidden") &&
			text.includes("text-overflow: ellipsis") &&
			text.includes("white-space: nowrap")
		) {
			run[1].remove();
			run[2].remove();
			run[0].replaceWith(
				postcss.atRule({
					name: "include",
					params: "truncate",
					raws: { before: run[0].raws.before, afterName: " " },
				})
			);
			used.mixins = true;
			return;
		}
	}
}

function migrateFontPair(rule, size, leading, used) {
	const [first, second] = [size, leading].sort(
		(a, b) => rule.index(a) - rule.index(b)
	);
	const between = rule.nodes.slice(rule.index(first) + 1, rule.index(second));
	const clash = between.some(
		(node) => node.type !== "decl" || /^(font|line-height)/.test(node.prop)
	);
	if (clash) return false;
	first.replaceWith(
		postcss.atRule({
			name: "include",
			params: `text(${SIZE_STEP[size.value]})`,
			raws: { before: first.raws.before, afterName: " " },
		})
	);
	second.remove();
	used.mixins = true;
	return true;
}

function migrateDecl(decl, used) {
	const { prop, value } = decl;
	const custom = prop.startsWith("--");

	if (custom || LENGTH_PROP.test(prop)) {
		if (HAIRLINE_PROP.test(prop) && !/srOnly/.test(selectorOf(decl))) {
			if (BORDER_WIDTHS[value]) {
				decl.value = `var(--amp-border-width-${BORDER_WIDTHS[value]})`;
				return;
			}
		}
		if (
			HAIRLINE_PROP.test(prop) &&
			ICON_SELECTOR.test(selectorOf(decl)) &&
			ICONS[value]
		) {
			decl.value = `var(--amp-icon-${ICONS[value]})`;
			return;
		}
		if (value === "0px" && !custom) {
			decl.value = "0";
			return;
		}
		const next = migrateLengths(value, { interpolate: custom });
		if (next !== value) {
			decl.value = next;
			used.mixins = true;
		}
	} else if (prop === "font-size" && SIZE_STEP[value]) {
		decl.value = `var(--amp-text-${SIZE_STEP[value]})`;
	} else if (prop === "line-height" && LEADING_STEP[value]) {
		decl.value = `var(--amp-leading-${LEADING_STEP[value]})`;
	} else if (prop === "font-weight" && WEIGHTS[value]) {
		decl.value = `weight(${WEIGHTS[value]})`;
		used.mixins = true;
	} else if (prop === "z-index" && LAYERS[value]) {
		decl.value = `var(--amp-z-${LAYERS[value]})`;
	} else if (prop === "box-shadow") {
		decl.value = migrateShadow(value);
	} else if (prop === "transition") {
		decl.value = migrateTransition(value);
	} else if (LINE_PROP.test(prop)) {
		const [width, ...rest] = value.split(/\s+/);
		if (BORDER_WIDTHS[width]) {
			decl.value = [
				`var(--amp-border-width-${BORDER_WIDTHS[width]})`,
				...rest,
			].join(" ");
		}
	} else if (prop === "border-width" && BORDER_WIDTHS[value]) {
		decl.value = `var(--amp-border-width-${BORDER_WIDTHS[value]})`;
	}
}

function migrateRule(rule, used) {
	migrateFocus(rule, used);
	migrateTruncate(rule, used);

	const decls = rule.nodes.filter((node) => node.type === "decl");
	const size = decls.find((decl) => decl.prop === "font-size");
	const leading = decls.find((decl) => decl.prop === "line-height");
	const step = size && SIZE_STEP[size.value];
	const paired = step && leading?.value === TEXT[step][1];
	if (paired && migrateFontPair(rule, size, leading, used)) {
		for (const decl of decls) {
			if (decl !== size && decl !== leading) migrateDecl(decl, used);
		}
		return;
	}
	for (const decl of decls) migrateDecl(decl, used);
}

function migrateIncludes(root, used) {
	root.walkAtRules("include", (rule) => {
		const next = rule.params.replace(REM, (all, number) => {
			const space = spaceOf(number);
			if (space) used.mixins = true;
			return space ?? all;
		});
		rule.params = next;
	});
}

function ensureMixinsImport(root, file) {
	const already = root.nodes.some(
		(node) =>
			node.type === "atrule" &&
			node.name === "use" &&
			/mixins"/.test(node.params)
	);
	if (already) return;
	const relative = path
		.relative(
			path.dirname(path.resolve(file)),
			path.join(STYLES_DIR, "mixins")
		)
		.split(path.sep)
		.join("/");
	const use = postcss.atRule({
		name: "use",
		params: `"${relative}" as *`,
		raws: { afterName: " ", semicolon: true },
	});
	// Sass wants every @use before any rule: after the last one, or else after
	// the file's opening comments, unless they belong to the first rule.
	const uses = root.nodes.filter(
		(node) => node.type === "atrule" && node.name === "use"
	);
	if (uses.length) {
		use.raws.before = "\n";
		uses.at(-1).after(use);
		return;
	}
	const firstRule = root.nodes.find((node) => node.type !== "comment");
	const anchor = firstRule.raws.before === "\n" ? root.first : firstRule;
	use.raws.before = anchor === root.first ? "" : "\n\n";
	anchor.before(use);
	anchor.raws.before = "\n\n";
}

function migrateFile(file) {
	const source = readFileSync(file, "utf8");
	const root = scss.parse(source, { from: file });
	const used = { mixins: false };
	root.walkRules((rule) => migrateRule(rule, used));
	// A mixin body's own declarations sit in an at-rule, not a rule.
	root.walkAtRules("mixin", (rule) => migrateRule(rule, used));
	migrateIncludes(root, used);
	if (used.mixins) ensureMixinsImport(root, file);
	const output = root.toString(scss);
	if (output === source) return false;
	writeFileSync(file, output);
	return true;
}

function collect(target) {
	if (statSync(target).isFile()) return [target];
	return readdirSync(target, { recursive: true })
		.map((name) => path.join(target, name))
		.filter((file) => file.endsWith(".scss"));
}

const targets = process.argv.slice(2);
if (!targets.length) {
	console.error("Usage: node scripts/migrate-tokens.mjs <file or folder>...");
	process.exit(1);
}
const changed = targets.flatMap(collect).filter(migrateFile);
console.log(`${changed.length} file(s) changed`);
for (const file of changed) console.log(`  ${file}`);
