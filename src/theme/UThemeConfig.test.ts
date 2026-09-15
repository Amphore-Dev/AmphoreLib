import { describe, expect, it } from "vitest";

import { DENSITY_PRESETS, DEFAULT_CONFIG } from "./CThemeConfig";
import { configToCssVars, mergeConfig } from "./UThemeConfig";

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

describe("configToCssVars", () => {
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
