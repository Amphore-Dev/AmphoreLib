import path from "path";

import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: "./tests/setup.js",
	},
	resolve: {
		alias: {
			"@components": path.resolve(__dirname, "./src/components"),
			"@utils": path.resolve(__dirname, "./src/utils"),
			"@constants": path.resolve(__dirname, "./src/constants"),
			"@styles": path.resolve(__dirname, "./src/styles"),
			"@i18n": path.resolve(__dirname, "./src/i18n"),
			"@hoc": path.resolve(__dirname, "./src/hoc"),
			"@hooks": path.resolve(__dirname, "./src/hooks"),
			"@interfaces": path.resolve(__dirname, "./src/types"),
			"@assets": path.resolve(__dirname, "./src/assets"),
		},
	},
});
