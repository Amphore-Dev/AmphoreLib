import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import * as components from "@components/index";

const dir = dirname(fileURLToPath(import.meta.url));

/** Every `*.test.tsx` next to this file, concatenated. */
const matrices = readdirSync(dir)
	.filter((file) => file.endsWith(".test.tsx"))
	.map((file) => readFileSync(join(dir, file), "utf8"))
	.join("\n");

describe("axe coverage", () => {
	const names = Object.keys(components).filter((name) => /^[A-Z]/.test(name));

	it.each(names)("%s has an axe assertion", (name) => {
		expect(matrices).toMatch(new RegExp(`<${name}\\b`));
	});
});
