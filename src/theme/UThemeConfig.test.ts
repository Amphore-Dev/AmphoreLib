import type { CSSProperties } from "react";

import { describe, expect, it } from "vitest";

import { DENSITY_PRESETS, DEFAULT_CONFIG } from "./CThemeConfig";
import {
	configToCssVars,
	cssVarsToDeclarations,
	mergeConfig,
} from "./UThemeConfig";

describe("mergeConfig", () => {
	it("returns the defaults untouched when no input is given", () => {
		expect(mergeConfig()).toEqual(DEFAULT_CONFIG);
	});

	it("auto-derives a matching tint via color-mix when only the base color is overridden", () => {
		const result = mergeConfig({ colors: { primary: "#e2673f" } });
		expect(result.colors.primary).toBe("#e2673f");
		// Must not keep the stale default (a mismatched blue) — must be
		// derived FROM the new primary, not some unrelated fixed value.
		expect(result.colors.primaryTint).not.toBe(
			DEFAULT_CONFIG.colors.primaryTint
		);
		expect(result.colors.primaryTint).toContain("#e2673f");
		expect(result.colors.primaryTint).toContain("color-mix");
	});

	it("keeps an explicit tint when the consumer overrides both", () => {
		const result = mergeConfig({
			colors: { primary: "#e2673f", primaryTint: "#fce4da" },
		});
		expect(result.colors.primary).toBe("#e2673f");
		expect(result.colors.primaryTint).toBe("#fce4da");
	});

	it("leaves the default tint alone when the base color isn't overridden", () => {
		const result = mergeConfig({ colors: { danger: "#ff0000" } });
		expect(result.colors.primary).toBe(DEFAULT_CONFIG.colors.primary);
		expect(result.colors.primaryTint).toBe(
			DEFAULT_CONFIG.colors.primaryTint
		);
	});

	it("applies the same auto-tint derivation to every base color, not just primary", () => {
		const result = mergeConfig({ colors: { success: "#00aa55" } });
		expect(result.colors.successTint).toContain("#00aa55");
		expect(result.colors.primaryTint).toBe(
			DEFAULT_CONFIG.colors.primaryTint
		);
	});

	it("resolves darkColors independently of colors — overriding one leaves the other's default alone", () => {
		const result = mergeConfig({ colors: { primary: "#e2673f" } });
		expect(result.colors.primary).toBe("#e2673f");
		expect(result.darkColors.primary).toBe(
			DEFAULT_CONFIG.darkColors.primary
		);
	});

	it("auto-derives darkColors tints toward black, not white", () => {
		const result = mergeConfig({ darkColors: { primary: "#4477ee" } });
		expect(result.darkColors.primary).toBe("#4477ee");
		expect(result.darkColors.primaryTint).toContain("#4477ee");
		expect(result.darkColors.primaryTint).toContain("black");
	});
});

describe("cssVarsToDeclarations", () => {
	const vars = { "--a": "1", "--b": "2" } as CSSProperties;

	it("renders plain declarations by default", () => {
		expect(cssVarsToDeclarations(vars)).toBe("--a: 1; --b: 2;");
	});

	it("marks every declaration !important on request", () => {
		expect(cssVarsToDeclarations(vars, { important: true })).toBe(
			"--a: 1 !important; --b: 2 !important;"
		);
	});
});

describe("mergeConfig text tones", () => {
	it("replaces a color's text tone along with its base", () => {
		const { colors } = mergeConfig({ colors: { primary: "#e2673f" } });
		expect(colors.primaryText).toBe("#e2673f");
	});

	it("keeps an explicit text tone, and the default of an untouched color", () => {
		const { colors } = mergeConfig({
			colors: { primary: "#e2673f", primaryText: "#7a2f14" },
		});
		expect(colors.primaryText).toBe("#7a2f14");
		expect(colors.warningText).toBe(DEFAULT_CONFIG.colors.warningText);
	});
});

describe("configToCssVars", () => {
	it("emits the spacing base as the only spacing variable", () => {
		const vars = configToCssVars(
			mergeConfig({ spacing: { base: "0.5rem" } })
		) as Record<string, string>;
		expect(vars["--amp-spacing"]).toBe("0.5rem");
		expect(
			Object.keys(vars).filter((name) => name.startsWith("--amp-space-"))
		).toEqual([]);
	});

	it("emits every scale from the config, overridable one key at a time", () => {
		const vars = configToCssVars(
			mergeConfig({
				text: { sm: "1rem" },
				weights: { bold: "800" },
				focus: { width: "3px" },
				ease: "linear",
			})
		) as Record<string, string>;
		expect(vars["--amp-text-sm"]).toBe("1rem");
		expect(vars["--amp-text-2xl"]).toBe(DEFAULT_CONFIG.text["2xl"]);
		expect(vars["--amp-leading-none"]).toBe("1");
		expect(vars["--amp-weight-bold"]).toBe("800");
		expect(vars["--amp-shadow-xl"]).toBe(DEFAULT_CONFIG.shadows.xl);
		expect(vars["--amp-shadow-color-3"]).toBe(
			DEFAULT_CONFIG.shadowColors[3]
		);
		expect(vars["--amp-focus-width"]).toBe("3px");
		expect(vars["--amp-focus-color"]).toBe("var(--amp-color-primary)");
		expect(vars["--amp-z-overlay"]).toBe("1000");
		expect(vars["--amp-duration-fast"]).toBe("0.15s");
		expect(vars["--amp-ease"]).toBe("linear");
		expect(vars["--amp-border-width-sm"]).toBe("1px");
		expect(vars["--amp-icon-md"]).toBe("1rem");
	});

	it("emits gap/card-padding/section-padding from the comfortable density preset by default", () => {
		const vars = configToCssVars(DEFAULT_CONFIG) as Record<string, string>;
		expect(vars["--amp-gap"]).toBe(DENSITY_PRESETS.comfortable.gap);
		expect(vars["--amp-card-padding"]).toBe(
			DENSITY_PRESETS.comfortable.cardPadding
		);
		expect(vars["--amp-section-padding"]).toBe(
			DENSITY_PRESETS.comfortable.sectionPadding
		);
	});

	it("switches to the compact density preset's values", () => {
		const config = mergeConfig({ density: "compact" });
		const vars = configToCssVars(config) as Record<string, string>;
		expect(vars["--amp-gap"]).toBe(DENSITY_PRESETS.compact.gap);
		expect(vars["--amp-card-padding"]).toBe(
			DENSITY_PRESETS.compact.cardPadding
		);
	});
});
