import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('@storybook/react-vite').StorybookConfig} */
export default {
    // Plain glob only — the extglob form (@((stories|story).@(js|jsx|ts|tsx)))
    // breaks @storybook/react-vite's dev-mode import map ("importers[path]
    // is not a function"): its story-matching regex mishandles that syntax.
    // V2 convention is `.stories.tsx` only anyway, so this is not a loss.
    stories: ["../src/**/*.stories.tsx", "../src/**/*.mdx"],

    /** Expose public folder to storybook as static */
    staticDirs: ["../public"],

    // addon-measure/addon-outline dropped: latest published versions (9.0.8)
    // still target Storybook 9's package layout and fail to load under v10
    // ("package-structure-changes" migration error). Re-add once v10 builds ship.
    addons: [
		"@storybook/addon-links",
		"@storybook/addon-docs",
		"@storybook/addon-a11y",
		"storybook-dark-mode",
	],

    framework: {
		name: "@storybook/react-vite",
		options: {},
	},

    typescript: {
		reactDocgen: "react-docgen-typescript",
		reactDocgenTypescriptOptions: {},
	},

    // Vite handles .module.scss natively — same behavior as the lib build
    // (vite.config.ts), so aliases are kept in sync manually here.
    async viteFinal(config) {
		config.resolve ??= {};
		config.resolve.alias = {
			...config.resolve.alias,
			"@": path.resolve(__dirname, "../src"),
			"@assets": path.resolve(__dirname, "../src/assets"),
			"@components": path.resolve(__dirname, "../src/components"),
			"@constants": path.resolve(__dirname, "../src/constants"),
			"@contexts": path.resolve(__dirname, "../src/contexts"),
			"@hooks": path.resolve(__dirname, "../src/hooks"),
			"@utils": path.resolve(__dirname, "../src/utils"),
			"@theme": path.resolve(__dirname, "../src/theme"),
			"@interfaces": path.resolve(__dirname, "../src/types"),
			"@stories": path.resolve(__dirname, "../src/stories"),
		};
		return config;
	},

    docs: {},
    telemetry: false,

    core: {
        disableWhatsNewNotifications: true
    }
};
