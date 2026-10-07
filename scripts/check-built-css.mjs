// Fails the build when lib/style.css lost a global rule the components
// rely on. Picto's stylesheet was a `.module.scss` imported only for its
// side effect: Vite tree-shook it out of the published CSS, so every
// consumer got unsized, uncentred pictos (24px SVGs overflowing their
// buttons) while Storybook, which loads the sources, looked fine.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../lib/style.css", import.meta.url), "utf8");

// Global selectors (not scoped under a component class) that must ship.
const REQUIRED = [
	"[data-amphore-svg-wrapper]{",
	"[data-amphore-svg-wrapper]>*{",
	"[data-amphore-svg-wrapper] [data-amphore-svg=current]",
];

// A required selector must start a rule, not be the tail of a scoped one
// (".amp-NumberInput-module__stepper [data-amphore-svg-wrapper]{").
const startsARule = (needle) => {
	for (
		let i = css.indexOf(needle);
		i !== -1;
		i = css.indexOf(needle, i + 1)
	) {
		const before = css[i - 1];
		if (i === 0 || before === "}" || before === "," || before === "{")
			return true;
	}
	return false;
};

const missing = REQUIRED.filter((selector) => !startsARule(selector));
if (missing.length) {
	console.error(
		`lib/style.css is missing global rules:\n${missing.map((s) => `  ${s}`).join("\n")}`
	);
	process.exit(1);
}
console.log(`lib/style.css: ${REQUIRED.length} global rules present.`);
