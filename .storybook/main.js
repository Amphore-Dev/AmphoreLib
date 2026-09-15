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
		// FileViewer's own `import("react-pdf")` (dynamic) and preview.tsx's
		// `import { pdfjs } from "react-pdf"` (static) otherwise resolve to
		// two separate module instances in the built bundle — each with its
		// own GlobalWorkerOptions object — so preview.tsx's workerSrc
		// assignment never reaches the one FileViewer actually reads.
		// Force a single shared instance, same purpose this Vite option
		// exists for.
		config.resolve.dedupe = [
			...(config.resolve.dedupe ?? []),
			"react-pdf",
			"pdfjs-dist",
		];
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

		// `resolve.dedupe` (above) only fixes module *resolution* identity —
		// it doesn't stop Rollup from still emitting react-pdf/pdfjs-dist
		// into more than one physical chunk file when reached from several
		// separate dynamic-import call sites (FileViewer's own lazy import,
		// used both from the plain story/canvas bundle and, independently,
		// from addon-docs' own live-preview chunk for the same story) —
		// two files means two runtime instances again, dedupe or not.
		// Force it into one named chunk so every entry point shares it.
		config.build ??= {};
		config.build.rollupOptions ??= {};
		config.build.rollupOptions.output ??= {};
		config.build.rollupOptions.output.manualChunks = (id) => {
			if (/node_modules\/(react-pdf|pdfjs-dist)\//.test(id)) {
				return "pdf-vendor";
			}
		};

		return config;
	},

    docs: {},
    telemetry: false,

    core: {
        disableWhatsNewNotifications: true
    }
};
