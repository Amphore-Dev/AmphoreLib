import ESLintPlugin from "eslint-webpack-plugin";
import path from "path";
import postcss from "postcss";
import sass from "sass";

module.exports = {
	stories:  ["../src/**/*.@((stories|story).@(js|jsx|ts|tsx))"],
	/** Expose public folder to storybook as static */
	staticDirs: ["../public"],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"storybook-dark-mode",
		"@storybook/addon-styling-webpack",
		"@storybook/addon-webpack5-compiler-babel",
		"@storybook/addon-measure",
		"@storybook/addon-outline",
	],
	framework: {
		name: "@storybook/react-webpack5",
		options: {},
	},
	typescript: {
		reactDocgen: "react-docgen-typescript",
		// Provide your own options if necessary.
		// See https://storybook.js.org/docs/configure/typescript for more information.
		reactDocgenTypescriptOptions: {},
	},
	webpackFinal: async (config) => {
		config.resolve.extensions.push(".ts", ".tsx");
		config.plugins.push(
			new ESLintPlugin({
				extensions: ["js", "jsx", "ts", "tsx"],
				files: "src",
				emitWarning: true,
				failOnWarning: false,
				failOnError: false,
			})
		);
		// SASS + Tailwind CSS
		config.module.rules.push({
			test: /\.s(a|c)ss$/,
			use: [
				"style-loader",
				{
					loader: "css-loader",
					options: {
						importLoaders: 1,
						// We always need to apply postcss-loader before css-loader
						modules: {
							auto: /\.module\.scss$/,
							localIdentName: "[name]__[local]--[hash:base64:5]",
						},
					},
				},
				{
					loader: "postcss-loader",
					// required for tailwind
					options: {
						implementation: postcss,
						postcssOptions: {
							config: path.resolve(
								__dirname,
								"../postcss.config.js"
							),
						},
					},
				},
				{
					loader: "sass-loader",
					options: {
						implementation: sass,
					},
				},
			],
		});

		return config;
	},
	docs: {},
	telemetry: false,
};
