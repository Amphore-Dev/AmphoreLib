// Shared Storybook argTypes for the props most components repeat verbatim
// (size/color/picto). NOT part of the lib's public exports — src/index.ts
// only re-exports ./components, ./theme, ./contexts, ./hooks, ./types,
// ./utils, ./constants, never this folder — so this never ships in the
// published package. Import directly by path from a *.stories.tsx file
// (`@stories/StoriesArgs`), nowhere else.
import { Pictos } from "@constants/CPictos";

/** Every component's `size?: TSize` prop. */
export const sizeArgType = {
	control: "radio",
	options: ["sm", "md", "lg"],
};

/** Every component's `color?: TColor` prop — the full palette. */
export const colorArgType = {
	control: "select",
	options: [
		"primary",
		"danger",
		"success",
		"warning",
		"info",
		"neutral",
		"black",
		"white",
	],
};

/** Every component's `picto?: TPictoName | IPictoProps` prop — always optional, `undefined` included so the control can clear it. */
export const pictoArgType = {
	control: "select",
	options: [undefined, ...Object.keys(Pictos)],
};
