import { create } from "@storybook/theming";
import "../src/index.scss";
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
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  darkMode: {
    dark: {...darkTheme, ...commons},
    light: {...lightTheme, ...commons},
    stylePreview: true,
  },
  options: {
	storySort: (a, b) => 
		{
			if (a.id === b.id)
				return 0;
			if (a.type === "docs" && b.type !== "docs")
				return -1;
			else if (a.type !== "docs" && b.type === "docs")
				return 1;
			return a.id.localeCompare(b.id, undefined, { numeric: true });
		}
}
};
export const tags = ["autodocs"];
