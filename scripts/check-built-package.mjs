// Fails the build when lib/ stops being what package.json promises. Each of
// these breaks consumers only, never Storybook or the tests, which load the
// sources:
// - a path in `main`/`module`/`types`/`exports` that the build did not emit;
// - an entry that does not load in plain Node, in either module format
//   (a named import from a CommonJS package, an extensionless subpath);
// - an optional peer reached at import time: an app without it would crash;
// - `sideEffects` no longer covering stylesheets: a bundler would then drop
//   the consumer's own `import ".../style.css"`;
// - a side effect a module relies on no longer imported from it;
// - a tsconfig path alias or a relative `node_modules` path left in a `.d.ts`:
//   unresolved for a consumer, the type silently turns into `any` under
//   `skipLibCheck`.
import { existsSync, globSync, readFileSync } from "node:fs";
import { createRequire, registerHooks } from "node:module";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const fromRoot = (file) => new URL(`../${file}`, import.meta.url);
const pkg = JSON.parse(readFileSync(fromRoot("package.json"), "utf8"));
const tsconfig = JSON.parse(readFileSync(fromRoot("tsconfig.json"), "utf8"));

const errors = [];

// Modules that need a package for what loading it does, not only for what it
// exports. react-gcolor-picker injects its panel's stylesheet on load.
const REQUIRED_SIDE_EFFECTS = [
	[
		"lib/esm/components/atoms/ColorPicker/ColorPicker.mjs",
		"react-gcolor-picker",
	],
];

// --- Every published path exists -------------------------------------------

const leaves = (value) =>
	typeof value === "string" ? [value] : Object.values(value).flatMap(leaves);

for (const target of [
	pkg.main,
	pkg.module,
	pkg.types,
	...leaves(pkg.exports),
]) {
	if (!existsSync(fromRoot(target))) {
		errors.push(`package.json points at ${target}, which was not built`);
	}
}

// --- Both entries load, without any optional peer --------------------------

const optionalPeers = Object.entries(pkg.peerDependenciesMeta ?? {})
	.filter(([, meta]) => meta.optional)
	.map(([name]) => name);
const isOptionalPeer = (specifier) =>
	optionalPeers.some(
		(peer) => specifier === peer || specifier.startsWith(`${peer}/`)
	);

// The hook sees what actually loads, for both module formats. A lazy
// `import("react-pdf")` does not count: it only runs on a first PDF render.
const reached = new Set();
registerHooks({
	resolve(specifier, context, nextResolve) {
		if (isOptionalPeer(specifier)) reached.add(specifier);
		return nextResolve(specifier, context);
	},
});

const load = async (format, loader) => {
	try {
		return Object.keys(await loader()).sort();
	} catch (error) {
		errors.push(`${format} entry does not load: ${error.message}`);
		return [];
	}
};

const esmExports = await load("ESM", () => import(fromRoot(pkg.module).href));
const cjsExports = await load("CJS", async () =>
	createRequire(import.meta.url)(fileURLToPath(fromRoot(pkg.main)))
);

for (const specifier of reached) {
	errors.push(`the main entry reaches optional peer ${specifier} on import`);
}
if (esmExports.join() !== cjsExports.join()) {
	errors.push(
		`ESM and CJS entries differ: ${esmExports.length} and ${cjsExports.length} exports`
	);
}

// --- Side effects ----------------------------------------------------------

if (!pkg.sideEffects?.includes("**/*.css")) {
	errors.push(`package.json "sideEffects" must keep "**/*.css"`);
}

for (const [file, specifier] of REQUIRED_SIDE_EFFECTS) {
	if (!readFileSync(fromRoot(file), "utf8").includes(`from "${specifier}"`)) {
		errors.push(`${file} no longer imports ${specifier}`);
	}
}

// --- Declarations ----------------------------------------------------------

const aliases = Object.keys(tsconfig.compilerOptions.paths).map((path) =>
	path.replace("/*", "")
);
const unresolvableImport = new RegExp(
	`(?:from\\s+|import\\s*\\(?\\s*)["'](?:(?:${aliases.join("|")})(?:/[^"']*)?|[^"']*node_modules/[^"']*)["']`
);

const declarations = globSync("lib/types/**/*.d.ts", { cwd: root });
for (const file of declarations) {
	if (unresolvableImport.test(readFileSync(fromRoot(file), "utf8"))) {
		errors.push(`${file} imports a path that only exists in this repo`);
	}
}

// --- Report ----------------------------------------------------------------

if (errors.length) {
	console.error(
		`lib/ is not publishable:\n${errors.map((e) => `  ${e}`).join("\n")}`
	);
	process.exit(1);
}
console.log(
	`lib/: ${esmExports.length} exports in ESM and CJS, no optional peer on import, ${declarations.length} declarations without aliases.`
);
