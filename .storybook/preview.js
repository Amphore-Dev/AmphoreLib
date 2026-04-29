import { create } from "@storybook/theming";

import logo from "../src/assets/logo.png";
import logoWhite from "../src/assets/logo-white.png";
import "../src/i18n";
import "../src/index.scss";

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

			// 1. Priorité aux racines (components avant wiki)
			const rootA = a.title.split("/")[0].toLowerCase();
			const rootB = b.title.split("/")[0].toLowerCase();
			if (rootA !== rootB) {
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

			// 4. "Default" toujours en premier dans un groupe
			if (a.name === "Default") return -1;
			if (b.name === "Default") return 1;

			// 5. Tri alpha-numérique final
			return a.id.localeCompare(b.id, undefined, { numeric: true });
		},
	},
};
export const tags = ["autodocs"];
