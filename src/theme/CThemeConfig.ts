import { en } from "../locales/en";

import type { TThemeConfig, TThemeStylePreset } from "./TThemeTokens";

/**
 * Dark palette. NOT a JS-inverted `DEFAULT_CONFIG.colors` — surfaces/border/
 * ink are their own values (a dark UI isn't light colors flipped), and tints
 * mix toward black instead of white (see mergeColors in UThemeConfig.ts,
 * which special-cases darkColors for that).
 */
export const DARK_DEFAULT_CONFIG_COLORS: TThemeConfig["colors"] = {
	primary: "#4f8cf7",
	primaryForeground: "#0b1220",
	primaryTint: "#1b2c4d",
	danger: "#f37272",
	dangerForeground: "#1a0a0a",
	dangerTint: "#3a1c1c",
	warning: "#f3a94f",
	warningForeground: "#1a1206",
	warningTint: "#3a2a12",
	success: "#4ade80",
	successForeground: "#07190d",
	successTint: "#173a22",
	info: "#38bdf8",
	infoForeground: "#06171f",
	infoTint: "#123240",
	neutral: "#a1a1aa",
	neutralForeground: "#131316",
	neutralTint: "#3a3a40",
	black: "#e5e5e5",
	blackForeground: "#111111",
	blackTint: "#3a3a3a",
	white: "#18181b",
	whiteForeground: "#f4f4f5",
	whiteTint: "#27272a",
	surface: "#101114",
	card: "#18191d",
	border: "#2c2e33",
	ink: "#f2f3f5",
	sub: "#9a9fa8",
	ghostBg: "#212327",
	backdrop: "rgba(0, 0, 0, 0.5)",
};

/**
 * Default preset shipped with the lib when a consumer renders
 * <AmphoreProvider> with no config (or a partial one).
 * Decision log: neutral radius (rounded-lg / 0.5rem), font-family inherits
 * the host app's own (see typography.fontFamily below).
 */
export const DEFAULT_CONFIG: TThemeConfig = {
	colors: {
		primary: "#0f9be8",
		primaryForeground: "#ffffff",
		primaryTint: "#e4edfd",
		danger: "#dc2626",
		dangerForeground: "#ffffff",
		dangerTint: "#fbe4e4",
		warning: "#d97706",
		warningForeground: "#ffffff",
		warningTint: "#fbead2",
		success: "#16a34a",
		successForeground: "#ffffff",
		successTint: "#dcf5e3",
		info: "#2f6feb",
		infoForeground: "#ffffff",
		infoTint: "#e0f2fe",
		neutral: "#52525b",
		neutralForeground: "#ffffff",
		neutralTint: "#e4e4e7",
		black: "#111111",
		blackForeground: "#ffffff",
		blackTint: "#e5e5e5",
		white: "#ffffff",
		whiteForeground: "#111111",
		whiteTint: "#f0f0f0",
		surface: "#fafafb",
		card: "#ffffff",
		border: "#e5e5e5",
		ink: "#1a1d21",
		sub: "#6b7178",
		ghostBg: "#f6f7f9",
		backdrop: "rgba(0, 0, 0, 0.5)",
	},
	// sm was 0.125rem — identical to the "sharp" preset's own sm, so any
	// component using -radius-sm looked "sharp" even under the plain
	// default theme (only "round" ever visibly differed). 0.25rem keeps
	// sm < md < lg monotonic while actually sitting between sharp (0.125rem)
	// and round (0.5rem).
	radius: {
		sm: "0.25rem",
		md: "0.5rem",
		lg: "0.75rem",
		full: "9999px",
	},
	spacing: {
		base: "0.25rem",
	},
	typography: {
		// "Inherit" the host app's own font by default — this lib never
		// loads a webfont of its own (no @font-face anywhere, not even in
		// Storybook), so naming a specific typeface here (previously "IBM
		// Plex Sans") never actually renders it: it just silently falls
		// through to the generic system-ui/sans-serif fallback, fighting
		// whatever font the consumer's own app already set on its body.
		// Confirmed by both real consumers so far needing this exact
		// override (`typography: { fontFamily: "inherit" }`) to get their
		// own font back.
		fontFamily: "inherit",
		fontFamilyMono:
			"ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace",
	},
	text: {
		xs: "0.75rem",
		sm: "0.875rem",
		base: "1rem",
		lg: "1.125rem",
		xl: "1.25rem",
		"2xl": "1.5rem",
		"3xl": "1.875rem",
		"4xl": "2.25rem",
	},
	// Sizes are Tailwind's. Line heights stay on the 0.25rem grid but not at
	// Tailwind's values: they set the height of the controls and headings.
	leading: {
		xs: "1.25rem",
		sm: "1.5rem",
		base: "1.5rem",
		lg: "1.5rem",
		xl: "1.75rem",
		"2xl": "2rem",
		"3xl": "2.5rem",
		"4xl": "3rem",
		none: "1",
		tight: "1.3",
		snug: "1.4",
		normal: "1.5",
	},
	weights: {
		regular: "400",
		medium: "500",
		semibold: "600",
		bold: "700",
	},
	shadows: {
		sm: "0 4px 12px rgba(0, 0, 0, 0.12)",
		md: "0 4px 12px rgba(0, 0, 0, 0.15)",
		lg: "0 4px 16px rgba(0, 0, 0, 0.12)",
		xl: "0 8px 24px rgba(0, 0, 0, 0.14)",
	},
	shadowColors: {
		1: "rgba(0, 0, 0, 0.06)",
		2: "rgba(0, 0, 0, 0.08)",
		3: "rgba(0, 0, 0, 0.1)",
		4: "rgba(0, 0, 0, 0.12)",
		5: "rgba(0, 0, 0, 0.16)",
	},
	// A var(), not a color: it has to follow the palette in force, dark
	// included.
	focus: {
		color: "var(--amp-color-primary)",
		width: "2px",
		offset: "2px",
	},
	layers: {
		sticky: "20",
		raised: "50",
		overlay: "1000",
		tooltip: "1100",
	},
	durations: {
		instant: "0.1s",
		fast: "0.15s",
		base: "0.2s",
		slow: "0.3s",
	},
	ease: "ease",
	borders: {
		sm: "1px",
		md: "2px",
	},
	icons: {
		xs: "0.75rem",
		sm: "0.875rem",
		md: "1rem",
		lg: "1.125rem",
		xl: "1.25rem",
		"2xl": "2rem",
	},
	darkColors: DARK_DEFAULT_CONFIG_COLORS,
	defaults: {},
	labels: en,
	density: "comfortable",
};

/**
 * `style` shortcut — pre-sets radius only. Resolved BEFORE the deep-merge
 * of any explicit `radius` the consumer passes, so an explicit radius
 * value always wins over the preset.
 */
export const STYLE_PRESETS: Record<TThemeStylePreset, TThemeConfig["radius"]> =
	{
		sharp: { sm: "0.125rem", md: "0.125rem", lg: "0.125rem", full: "0" },
		round: { sm: "0.5rem", md: "1rem", lg: "1.5rem", full: "9999px" },
	};

/**
 * `density` drives layout-level spacing (gaps, Card/Section padding) —
 * distinct from `size`, which scales one component's own internal
 * padding/font. Purely CSS-var driven (see configToCssVars in
 * UThemeConfig.ts): no per-component `data-*` branching needed the way
 * `size` requires, so no Context/hook — components just read the vars.
 */
export const DENSITY_PRESETS = {
	comfortable: {
		gap: "1.5rem",
		cardPadding: "1.5rem",
		sectionPadding: "2rem",
	},
	compact: {
		gap: "0.75rem",
		cardPadding: "1rem",
		sectionPadding: "1.25rem",
	},
} as const;
