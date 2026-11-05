import { describe, expect, it } from "vitest";

import { DARK_DEFAULT_CONFIG_COLORS, DEFAULT_CONFIG } from "./CThemeConfig";
import { TThemeColors } from "./TThemeTokens";

const luminance = (hex: string) => {
	const [r, g, b] = [1, 3, 5].map((start) => {
		const channel = parseInt(hex.slice(start, start + 2), 16) / 255;
		return channel <= 0.03928
			? channel / 12.92
			: ((channel + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string) => {
	const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (light + 0.05) / (dark + 0.05);
};

const COLORS = [
	"primary",
	"danger",
	"warning",
	"success",
	"info",
	"neutral",
] as const;

// Normal text needs 4.5:1 (WCAG AA): a palette change must not lose that.
describe.each([
	["light", DEFAULT_CONFIG.colors],
	["dark", DARK_DEFAULT_CONFIG_COLORS],
] as [string, TThemeColors][])("%s palette", (_, colors) => {
	it.each(COLORS)("%s stays readable", (name) => {
		const text = colors[`${name}Text`];
		expect(
			contrast(colors[`${name}Foreground`], colors[name])
		).toBeGreaterThanOrEqual(4.5);
		expect(contrast(text, colors.card)).toBeGreaterThanOrEqual(4.5);
		expect(contrast(text, colors[`${name}Tint`])).toBeGreaterThanOrEqual(
			4.5
		);
		expect(contrast(text, colors.ghostBg)).toBeGreaterThanOrEqual(4.5);
	});

	it("keeps body text readable on every surface", () => {
		for (const surface of [colors.surface, colors.card, colors.ghostBg]) {
			expect(contrast(colors.ink, surface)).toBeGreaterThanOrEqual(4.5);
			expect(contrast(colors.sub, surface)).toBeGreaterThanOrEqual(4.5);
		}
	});
});
