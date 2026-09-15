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
