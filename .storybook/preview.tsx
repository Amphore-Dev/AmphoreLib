import React from "react";
import { create } from "storybook/theming";

import { AmphoreProvider } from "../src/theme/AmphoreProvider";
import type { TAmphoreLocale } from "../src/theme/AmphoreProvider";
import type {
	TThemeConfigInput,
	TThemeMode,
	TThemeStylePreset,
} from "../src/theme/TThemeTokens";
import type { TSize } from "../src/types/TSize";

import logo from "../src/assets/logo.png";
import logoWhite from "../src/assets/logo-white.png";

const lightTheme = create({
	base: "light",
	appBg: "#FAF3EC",
	appContentBg: "#FFFFFF",
	appBorderRadius: 8,
	colorPrimary: "#0f9be8",
	colorSecondary: "#39b5f7",
	textColor: "#27272B",
	barBg: "#FFFFFF",
	fontCode: "'Operator Mono', monospace",
	brandImage: logo,
});

const darkTheme = create({
	base: "dark",
	appBg: "#27272B",
	appContentBg: "#1D1D20",
	appBorderRadius: 8,
	colorPrimary: "#0462a0",
	colorSecondary: "#0383d3",
	textColor: "#FAF3EC",
	barBg: "#1D1D20",
	fontCode: "'Operator Mono', monospace",
	brandImage: logoWhite,
});

const commons = {
	brandTitle: "Amphore Lib",
};

export const parameters = {
	actions: {
		argTypesRegex: "^on.*",
	},
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	darkMode: {
		dark: { ...darkTheme, ...commons },
		light: { ...lightTheme, ...commons },
		stylePreview: true,
	},
	options: {
		storySort: (a, b) => {
			if (a.id === b.id) return 0;

			// 1. Priorité aux racines (introduction, puis components, avant le reste)
			const rootA = a.title.split("/")[0].toLowerCase();
			const rootB = b.title.split("/")[0].toLowerCase();
			if (rootA !== rootB) {
				if (rootA === "introduction") return -1;
				if (rootB === "introduction") return 1;
				if (rootA === "components") return -1;
				if (rootB === "components") return 1;
			}

			// 2. Priorité aux docs
			if (a.type === "docs" && b.type !== "docs") return -1;
			if (a.type !== "docs" && b.type === "docs") return 1;

			// 3. Tri docs par profondeur
			if (a.type === "docs" && b.type === "docs") {
				const deepA = a.title.split("/").length;
				const deepB = b.title.split("/").length;
				if (deepA === deepB) {
					return a.id.localeCompare(b.id, undefined, {
						numeric: true,
					});
				}
				return deepA - deepB;
			}

			// 4. "Default"/"Base" toujours en premier dans un groupe — V2
			// nomme sa première story "Base" partout (Template.bind({}) +
			// .args), jamais "Default".
			const isFirst = (name) => name === "Default" || name === "Base";
			if (isFirst(a.name)) return -1;
			if (isFirst(b.name)) return 1;

			// 5. Tri alpha-numérique final
			return a.id.localeCompare(b.id, undefined, { numeric: true });
		},
	},
};
export const globalTypes = {
	ampStyle: { name: "Amphore style" },
	ampPrimary: { name: "Amphore primary" },
	ampDensity: { name: "Amphore density" },
	ampDefaultSize: { name: "Amphore default size" },
	ampTheme: { name: "Amphore theme" },
	ampLocale: { name: "Amphore locale" },
};

// Storybook-only demo typeface — matches Storybook's own chrome font
// (Nunito Sans, per its default theme), loaded via preview-head.html
// (Google Fonts). NOT the lib's shipped default (CThemeConfig.ts's
// DEFAULT_CONFIG deliberately "inherit"s the host app's own font instead —
// this lib never bundles a webfont of its own). Applied unconditionally
// below, ahead of the panel's own overrides — there's no "reset
// typography" control.
const STORYBOOK_TYPOGRAPHY: TThemeConfigInput["typography"] = {
	fontFamily:
		'"Nunito Sans", -apple-system, ".SFNSText-Regular", "San Francisco", BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
	fontFamilyMono: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace",
};

/**
 * Reads the live config from the "Amphore Theme" panel (see manager.tsx /
 * ThemeConfigPanel.tsx) and applies it to every story via AmphoreProvider —
 * same mechanism a consumer app uses at its own root.
 */
export const decorators = [
	(Story, context) => {
		const {
			ampStyle,
			ampPrimary,
			ampDensity,
			ampDefaultSize,
			ampTheme,
			ampLocale,
		} = context.globals;

		const config: TThemeConfigInput = {
			typography: STORYBOOK_TYPOGRAPHY,
			...(ampStyle && ampStyle !== "default"
				? { style: ampStyle as TThemeStylePreset }
				: {}),
			...(ampPrimary ? { colors: { primary: ampPrimary } } : {}),
			...(ampDensity ? { density: ampDensity } : {}),
			...(ampDefaultSize && ampDefaultSize !== "default"
				? { defaults: { size: ampDefaultSize as TSize } }
				: {}),
		};

		return (
			<AmphoreProvider
				config={config}
				theme={(ampTheme as TThemeMode) || "system"}
				locale={
					ampLocale && ampLocale !== "default"
						? (ampLocale as TAmphoreLocale)
						: undefined
				}
			>
				<Story />
			</AmphoreProvider>
		);
	},
];

export const tags = ["autodocs"];
