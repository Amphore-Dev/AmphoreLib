import react from "@vitejs/plugin-react";
import path from "path";
import { type Plugin, defineConfig } from "vite";
import dts from "vite-plugin-dts";

import pkg from "./package.json";

// package.json's "sideEffects" is written for consumers' bundlers, but Vite
// applies it to this lib's own sources as well. Rollup then skips the barrels,
// and style.css, which Vite concatenates by walking the import graph, comes
// out in alphabetical export order: same rules, but an organism's override now
// precedes the atom rule it overrides, and loses at equal specificity.
const keepSourceImportOrder = (): Plugin => ({
	name: "amphore:keep-source-import-order",
	transform: (_code, id) =>
		/\.tsx?$/.test(id) ? { moduleSideEffects: true } : null,
});

// Everything a consumer installs alongside this lib stays external, subpaths
// included ("react/jsx-runtime", "react-day-picker/locale"): their bundler
// dedupes it, and tree-shakes it, against the rest of their app. That also
// keeps react-pdf/pdfjs-dist out: FileViewer needs the consumer's own
// pdfjs-dist instance (the *same* module singleton) to read a workerSrc the
// consumer configured, see FileViewer.tsx's own comment. Stylesheets are the
// one exception, so that style.css stays the only file to import.
const externalPackages = Object.keys({
	...pkg.dependencies,
	...pkg.peerDependencies,
});
const isExternal = (id: string) =>
	!id.endsWith(".css") &&
	externalPackages.some((dep) => id === dep || id.startsWith(`${dep}/`));

// One output file per source module, so a consumer's bundler only follows
// the components it was asked for. The extensions carry the module format:
// the package has no "type" field, and Node reads a bare `.js` as CommonJS.
const sharedOutput = {
	preserveModules: true,
	preserveModulesRoot: "src",
	exports: "named",
	// The same file for both outputs: Vite writes it once per format.
	assetFileNames: "style.[ext]",
} as const;

// Library builds only. Storybook inherits these plugins, and would otherwise
// overwrite lib/types on every `yarn build-sb`, resolving each `react` import
// through its own alias into a `../../node_modules/react` path.
const declarations: Plugin = {
	...dts({
		include: ["src"],
		exclude: [
			"src/**/*.stories.tsx",
			"src/**/*.test.tsx",
			"src/**/*.test.ts",
			"src/**/Mocks/**",
			"src/stories/**",
		],
		entryRoot: "src",
		outDirs: "lib/types",
	}),
	apply: (config) => Boolean(config.build?.lib),
};

// V2 build pipeline — replaced the v1 rollup.config.mjs (deleted).
export default defineConfig({
	plugins: [react(), keepSourceImportOrder(), declarations],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@assets": path.resolve(__dirname, "./src/assets"),
			"@components": path.resolve(__dirname, "./src/components"),
			"@constants": path.resolve(__dirname, "./src/constants"),
			"@contexts": path.resolve(__dirname, "./src/contexts"),
			"@hooks": path.resolve(__dirname, "./src/hooks"),
			"@utils": path.resolve(__dirname, "./src/utils"),
			"@theme": path.resolve(__dirname, "./src/theme"),
			"@interfaces": path.resolve(__dirname, "./src/types"),
			"@stories": path.resolve(__dirname, "./src/stories"),
		},
	},
	// public/ only serves Storybook (favicon, logo).
	publicDir: false,
	build: {
		outDir: "lib",
		lib: {
			entry: path.resolve(__dirname, "src/index.ts"),
			cssFileName: "style",
		},
		sourcemap: true,
		rollupOptions: {
			external: isExternal,
			output: [
				{
					...sharedOutput,
					format: "es",
					entryFileNames: "esm/[name].mjs",
				},
				{
					...sharedOutput,
					format: "cjs",
					entryFileNames: "cjs/[name].cjs",
					// A package's own `exports.default` (react-gcolor-picker)
					// must come out as the default import, not the namespace.
					interop: "auto",
				},
			],
		},
	},
	css: {
		modules: {
			localsConvention: "camelCase",
			generateScopedName: "amp-[name]__[local]--[hash:base64:5]",
		},
	},
});
