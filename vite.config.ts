import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// V2 build pipeline — replaced the v1 rollup.config.mjs (deleted).
export default defineConfig({
	plugins: [
		react(),
		dts({
			include: ["src"],
			exclude: [
				"src/**/*.stories.tsx",
				"src/**/*.test.tsx",
				"src/**/Mocks/**",
			],
			rollupTypes: true,
			insertTypesEntry: true,
		}),
	],
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
	build: {
		outDir: "lib",
		lib: {
			entry: path.resolve(__dirname, "src/index.ts"),
			name: "AmphoreLib",
			formats: ["es", "cjs"],
			fileName: (format) => `index.${format === "es" ? "esm.js" : "js"}`,
		},
		sourcemap: true,
		rollupOptions: {
			// Never bundle peer deps into the lib output. react-pdf/pdfjs-dist
			// matter beyond just weight here: FileViewer needs the consumer's
			// own pdfjs-dist instance (the *same* module singleton) to read a
			// workerSrc the consumer configured — bundling a separate copy in
			// here would make that impossible, see FileViewer.tsx's own comment.
			external: [
				"react",
				"react-dom",
				"react/jsx-runtime",
				"react-pdf",
				"pdfjs-dist",
			],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
				// One CSS file for the whole lib; consumers import it once.
				assetFileNames: "style.[ext]",
			},
		},
	},
	css: {
		modules: {
			localsConvention: "camelCase",
			generateScopedName: "amp-[name]__[local]--[hash:base64:5]",
		},
	},
});
