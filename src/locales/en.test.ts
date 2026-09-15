import { describe, expect, it } from "vitest";

import { en } from "./en";

describe("en locale bundle", () => {
	it("has no empty value for any key in any group", () => {
		// TypeScript already forces every key to be *present* (en.ts's own
		// `TRequiredThemeLabels` type) — this catches the one mistake that
		// slips past that: a key added but left as "" or all-whitespace,
		// which `resolve()`'s `?? ""` fallback wouldn't tell apart from
		// "never set at all".
		for (const [group, entries] of Object.entries(en)) {
			for (const [key, value] of Object.entries(entries)) {
				expect(value.trim(), `en.${group}.${key}`).not.toBe("");
			}
		}
	});
});
