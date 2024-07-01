import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
// This is required to read package.json file when
// using Native ES modules in Node.js
// https://rollupjs.org/command-line-interface/#importing-package-json
import { createRequire } from "node:module";
import dts from "rollup-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

import svg from "rollup-plugin-svg";

const requireFile = createRequire(import.meta.url);
const packageJson = requireFile("./package.json");

export default [
	{
		input: "src/index.ts",
		output: [
			{
				file: packageJson.main,
				format: "cjs",
				sourcemap: true,
			},
			{
				file: packageJson.module,
				format: "esm",
				sourcemap: true,
			},
		],
		plugins: [
			peerDepsExternal({
				includeDependencies: true,
			}),
			resolve(),
			commonjs(),
			typescript(),
			postcss({
				config: {
					path: "./postcss.config.js",
				},
				extensions: [".css", ".scss"],
			}),
			svg({
				base64: true,
			}),
		],
		globals: {
			react: "React",
			"react-dom": "ReactDOM",
			formik: "Formik",
			yup: "Yup",
		},
		external: ["react", "react-dom", "formik"],
	},
	{
		input: "lib/index.d.ts",
		output: [{ file: "lib/index.d.ts", format: "es" }],
		plugins: [dts()],
		external: [/\.css|\.scss$/],
	},
];
