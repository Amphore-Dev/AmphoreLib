import type { CSSProperties } from "react";

import {
	DARK_DEFAULT_CONFIG_COLORS,
	DENSITY_PRESETS,
	DEFAULT_CONFIG,
	STYLE_PRESETS,
} from "./CThemeConfig";
import type { TThemeLabels } from "./TThemeLabels";
import type {
	TThemeColors,
	TThemeConfig,
	TThemeConfigInput,
} from "./TThemeTokens";

/**
 * Each base color's tint has no relationship to it in code — they're just
 * two independent hex strings in CThemeConfig.ts. A consumer overriding only
 * `colors.primary` (the common case: `<AmphoreProvider config={{ colors:
 * { primary: '#e2673f' } }}>`) got the new primary everywhere it's used
 * directly, but every tint-based visual (hover backgrounds, a Select's
 * selected-option highlight, an outline button's hover fill) kept showing
 * the *default* tint — visibly mismatched, unrelated hue. Listed here so
 * mergeConfig can auto-derive a matching tint via color-mix() whenever the
 * base is overridden without an explicit tint of its own.
 */
const BASE_COLOR_KEYS = [
	"primary",
	"danger",
	"success",
	"warning",
	"info",
	"neutral",
	"black",
	"white",
] as const;

function mergeColors(
	defaults: TThemeColors,
	input?: Partial<TThemeColors>,
	/** Tints mix toward white for a light palette, black for a dark one. */
	tintMixTarget: "white" | "black" = "white"
): TThemeColors {
	const colors: TThemeColors = { ...defaults, ...input };

	for (const key of BASE_COLOR_KEYS) {
		const tintKey = `${key}Tint` as const;
		const baseOverridden = input?.[key] !== undefined;
		const tintOverridden = input?.[tintKey] !== undefined;

		if (baseOverridden && !tintOverridden) {
			colors[tintKey] =
				`color-mix(in srgb, ${colors[key]} 15%, ${tintMixTarget})`;
		}
	}

	return colors;
}

/**
 * `labels` is two levels deep (`labels.Badge.removeLabel`) — a flat
 * `{ ...defaults, ...input }` at the top level would *replace* a whole
 * component's group instead of merging into it: overriding only
 * `FileViewer.zoomOutLabel` would silently drop `FileViewer`'s other nine
 * labels back to `undefined` instead of leaving them at their `en` value.
 * Each component group gets its own shallow merge instead — every group
 * is flat (component -> label key -> string), so one level is enough.
 */
function mergeLabels(
	defaults: TThemeLabels,
	input?: TThemeLabels
): TThemeLabels {
	if (!input) return defaults;

	const merged: TThemeLabels = { ...defaults };
	for (const key of Object.keys(input) as (keyof TThemeLabels)[]) {
		merged[key] = { ...defaults[key], ...input[key] } as never;
	}
	return merged;
}

/**
 * Merge a consumer's partial config onto the defaults.
 * Every top-level section (colors/radius/spacing/typography) is a flat
 * object, so a per-key merge is enough — no generic deep-merge dependency.
 *
 * Order: defaults → style preset (if any) → explicit fields.
 * An explicit `radius.*` always wins over the `style` preset.
 */
export function mergeConfig(rawInput?: TThemeConfigInput): TThemeConfig {
	const input = rawInput ?? {};
	const presetRadius = input.style ? STYLE_PRESETS[input.style] : undefined;

	return {
		colors: mergeColors(DEFAULT_CONFIG.colors, input.colors, "white"),
		darkColors: mergeColors(
			DARK_DEFAULT_CONFIG_COLORS,
			input.darkColors,
			"black"
		),
		radius: { ...DEFAULT_CONFIG.radius, ...presetRadius, ...input.radius },
		spacing: { ...DEFAULT_CONFIG.spacing, ...input.spacing },
		typography: { ...DEFAULT_CONFIG.typography, ...input.typography },
		defaults: { ...DEFAULT_CONFIG.defaults, ...input.defaults },
		labels: mergeLabels(DEFAULT_CONFIG.labels, input.labels),
		density: input.density ?? DEFAULT_CONFIG.density,
		style: input.style,
	};
}

const toKebabCase = (key: string) =>
	key.replace(/([A-Z])/g, "-$1").toLowerCase();

/**
 * Maps TThemeColors keys to --amp-color-* var names.
 * "primaryForeground" -> "--amp-color-primary-fg", "primaryTint" -> "--amp-color-primary-tint",
 * everything else -> "--amp-color-<kebab-key>". Derived from the object so adding a
 * color to the palette (TThemeTokens.ts + CThemeConfig.ts) needs no change here.
 */
export function colorsToCssVars(colors: TThemeColors): CSSProperties {
	const vars: Record<string, string> = {};

	for (const [key, value] of Object.entries(colors)) {
		const varName = toKebabCase(key).replace(/-foreground$/, "-fg");
		vars[`--amp-color-${varName}`] = value;
	}

	return vars as CSSProperties;
}

/**
 * Renders a CSSProperties object (only --amp-* custom props, in practice) as
 * `--x: y; --z: w;` for use inside a hand-written <style> rule body — needed
 * for the dark-mode block AmphoreProvider injects (see cssVarsToDeclarations
 * callers), since inline `style` can't hold a `@media` query.
 */
export function cssVarsToDeclarations(vars: CSSProperties): string {
	return Object.entries(vars)
		.map(([key, value]) => `${key}: ${value};`)
		.join(" ");
}

/** Turns a resolved TThemeConfig into the --amp-* custom properties every component reads. */
export function configToCssVars(config: TThemeConfig): CSSProperties {
	const density = DENSITY_PRESETS[config.density];

	return {
		...colorsToCssVars(config.colors),

		"--amp-gap": density.gap,
		"--amp-card-padding": density.cardPadding,
		"--amp-section-padding": density.sectionPadding,

		"--amp-radius-sm": config.radius.sm,
		"--amp-radius-md": config.radius.md,
		"--amp-radius-lg": config.radius.lg,
		"--amp-radius-full": config.radius.full,

		"--amp-space-1": config.spacing[1],
		"--amp-space-2": config.spacing[2],
		"--amp-space-3": config.spacing[3],
		"--amp-space-4": config.spacing[4],
		"--amp-space-5": config.spacing[5],
		"--amp-space-6": config.spacing[6],

		"--amp-font": config.typography.fontFamily,
		"--amp-font-mono": config.typography.fontFamilyMono,
	} as CSSProperties;
}
