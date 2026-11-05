import type { TSize } from "@interfaces/index";

import type { TThemeLabels } from "./TThemeLabels";

/**
 * V2 theming contract. Everything a consumer app can override via
 * <AmphoreProvider config={...}>. All values are plain CSS values
 * (rem/hex/font-stack strings) — no JS units math at runtime.
 */

export type TThemeColors = {
	primary: string;
	primaryForeground: string;
	primaryTint: string;
	danger: string;
	dangerForeground: string;
	dangerTint: string;
	warning: string;
	warningForeground: string;
	warningTint: string;
	success: string;
	successForeground: string;
	successTint: string;
	info: string;
	infoForeground: string;
	infoTint: string;
	neutral: string;
	neutralForeground: string;
	neutralTint: string;
	black: string;
	blackForeground: string;
	blackTint: string;
	white: string;
	whiteForeground: string;
	whiteTint: string;
	surface: string;
	card: string;
	border: string;
	ink: string;
	sub: string;
	ghostBg: string;
};

export type TThemeRadius = {
	sm: string;
	md: string;
	lg: string;
	full: string;
};

export type TThemeSpacing = {
	/**
	 * Unit of the `space($n)` SCSS scale: `space(2)` is `base * 2`. The numbered
	 * keys below are a separate, older scale (`--amp-space-*`, not linear), and
	 * they do not follow `base`.
	 */
	base: string;
	1: string;
	2: string;
	3: string;
	4: string;
	5: string;
	6: string;
};

export type TThemeTypography = {
	fontFamily: string;
	fontFamilyMono: string;
};

/** Steps of the text scale, read through `--amp-text-*` and `--amp-leading-*`. */
export type TThemeTextStep =
	| "2xs"
	| "xs"
	| "sm"
	| "md"
	| "lg"
	| "xl"
	| "2xl"
	| "3xl"
	| "4xl"
	| "5xl"
	| "6xl";

/** Font sizes (`--amp-text-*`). */
export type TThemeText = Record<TThemeTextStep, string>;

/**
 * Line heights (`--amp-leading-*`). Each text step has its own, and the four
 * unitless ratios are for text that scales with its own font size.
 */
export type TThemeLeading = Record<
	TThemeTextStep | "none" | "tight" | "snug" | "normal",
	string
>;

/** Font weights (`--amp-weight-*`). */
export type TThemeWeights = {
	regular: string;
	medium: string;
	semibold: string;
	bold: string;
};

/** Box shadows of floating surfaces (`--amp-shadow-*`). */
export type TThemeShadows = {
	sm: string;
	md: string;
	lg: string;
	xl: string;
};

/** Shadow color of each Card elevation level (`--amp-shadow-color-*`). */
export type TThemeShadowColors = {
	1: string;
	2: string;
	3: string;
	4: string;
	5: string;
};

/** Keyboard focus ring (`--amp-focus-*`), drawn by the `focus-ring` mixin. */
export type TThemeFocus = {
	color: string;
	width: string;
	offset: string;
};

/** Stacking layers (`--amp-z-*`). */
export type TThemeLayers = {
	sticky: string;
	raised: string;
	overlay: string;
};

/** Transition durations (`--amp-duration-*`). */
export type TThemeDurations = {
	instant: string;
	fast: string;
	base: string;
	slow: string;
};

/** Border and line thicknesses (`--amp-border-width-*`). */
export type TThemeBorders = {
	sm: string;
	md: string;
	lg: string;
	xl: string;
};

/** Fixed icon sizes (`--amp-icon-*`). */
export type TThemeIcons = {
	xs: string;
	sm: string;
	md: string;
	lg: string;
	xl: string;
	"2xl": string;
};

/** Named presets that pre-set radius (and nothing else). Explicit `radius.*` still wins. */
export type TThemeStylePreset = "sharp" | "round";

/**
 * "light"/"dark": forces that palette, sets `data-theme` on the root.
 * "system": follows `prefers-color-scheme`, no `data-theme` set — resolved
 * in CSS (media query), not JS, so SSR/hydration never mismatches the OS.
 */
export type TThemeMode = "light" | "dark" | "system";

/**
 * Per-prop defaults applied when a component's own prop is omitted —
 * distinct from `density`, which exists but isn't wired to anything yet.
 * A component still falls back to its own hardcoded default (e.g. "md")
 * when neither this nor an explicit prop is set.
 */
export type TThemeDefaults = {
	size?: TSize;
};

export type TThemeConfig = {
	colors: TThemeColors;
	/**
	 * Dark-palette overrides, merged onto DARK_DEFAULT_CONFIG.colors the same
	 * way `colors` merges onto DEFAULT_CONFIG.colors. Independent of `colors`
	 * — a dark palette isn't "light, inverted" (contrast/surfaces differ), so
	 * overriding `colors.primary` does NOT touch `darkColors.primary`.
	 */
	darkColors: TThemeColors;
	radius: TThemeRadius;
	spacing: TThemeSpacing;
	typography: TThemeTypography;
	text: TThemeText;
	leading: TThemeLeading;
	weights: TThemeWeights;
	shadows: TThemeShadows;
	shadowColors: TThemeShadowColors;
	focus: TThemeFocus;
	layers: TThemeLayers;
	durations: TThemeDurations;
	/** Timing function of every transition (`--amp-ease`). */
	ease: string;
	borders: TThemeBorders;
	icons: TThemeIcons;
	defaults: TThemeDefaults;
	/**
	 * Every component's translatable strings, namespaced by component name
	 * (plus a `common` bucket for shared action verbs) — see TThemeLabels.ts.
	 * Defaults to the full `en` bundle (CThemeConfig.ts), never `{}` — English
	 * text is only ever expressed once, there, not duplicated as an inline
	 * fallback inside each component too.
	 */
	labels: TThemeLabels;
	density: "compact" | "comfortable";
	style?: TThemeStylePreset;
};

/** Everything is optional at the consumer boundary — deep-merged onto defaults. */
export type TThemeConfigInput = {
	[K in keyof TThemeConfig]?: TThemeConfig[K] extends object
		? Partial<TThemeConfig[K]>
		: TThemeConfig[K];
};
