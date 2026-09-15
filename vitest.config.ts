import path from "path";

import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./tests/setup.js",
		coverage: {
			provider: "v8",
			reporter: ["text", "html", "lcov"],
			include: ["src/**/*.{ts,tsx}"],
			exclude: [
				"src/**/*.stories.tsx",
				"src/**/*.test.{ts,tsx}",
				"src/**/index.ts",
				"src/types/**",
				// Generated SVG icon components, not hand-written logic.
				"src/assets/pictos/**",
				"src/global.d.ts",
			],
		},
	},
	resolve: {
		alias: {
			"@components": path.resolve(__dirname, "./src/components"),
			"@constants": path.resolve(__dirname, "./src/constants"),
			"@contexts": path.resolve(__dirname, "./src/contexts"),
			"@hooks": path.resolve(__dirname, "./src/hooks"),
			"@utils": path.resolve(__dirname, "./src/utils"),
			"@theme": path.resolve(__dirname, "./src/theme"),
			"@interfaces": path.resolve(__dirname, "./src/types"),
			"@assets": path.resolve(__dirname, "./src/assets"),
		},
	},
});
