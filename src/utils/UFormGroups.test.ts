import { describe, expect, it } from "vitest";

import { TField, TFieldsGroup } from "@interfaces/index";

import {
	computeModalSize,
	genGroups,
	getDefaultValueDisplay,
	hasValue,
} from "./UFormGroups";

describe("genGroups", () => {
	const fields: TField[] = [
		{ name: "a", type: "input" },
		{ name: "b", type: "input" },
	];

	it("wraps a flat field array into a single group", () => {
		expect(genGroups(fields)).toEqual([{ fields }]);
	});

	it("passes an already-grouped array through unchanged", () => {
		const groups: TFieldsGroup[] = [
			{ title: "A", fields: [fields[0]] },
			{ title: "B", fields: [fields[1]] },
		];
		expect(genGroups(groups)).toEqual(groups);
	});

	it("keeps multiple groups separate when mergeForDisplay is false", () => {
		const groups: TFieldsGroup[] = [
			{ title: "A", fields: [fields[0]] },
			{ title: "B", fields: [fields[1]] },
		];
		expect(genGroups(groups, false)).toEqual(groups);
	});

	it("merges multiple groups into one when mergeForDisplay is true", () => {
		const groups: TFieldsGroup[] = [
			{ title: "A", fields: [fields[0]] },
			{ title: "B", fields: [fields[1]] },
		];
		const merged = genGroups(groups, true);
		expect(merged).toHaveLength(1);
		expect(merged[0].title).toBeUndefined();
		const merged0Fields = merged[0].fields;
		const resolved =
			typeof merged0Fields === "function"
				? merged0Fields(false)
				: merged0Fields;
		expect(resolved).toEqual(fields);
	});
});

describe("computeModalSize", () => {
	it("returns sm for 1 or fewer columns", () => {
		expect(computeModalSize(1)).toBe("sm");
		expect(computeModalSize(0)).toBe("sm");
	});

	it("returns md for 2 columns", () => {
		expect(computeModalSize(2)).toBe("md");
	});

	it("returns lg for 3+ columns", () => {
		expect(computeModalSize(3)).toBe("lg");
		expect(computeModalSize(6)).toBe("lg");
	});
});

describe("hasValue", () => {
	it("is false for null/undefined", () => {
		expect(hasValue(null)).toBe(false);
		expect(hasValue(undefined)).toBe(false);
	});

	it("is false for empty/whitespace strings", () => {
		expect(hasValue("")).toBe(false);
		expect(hasValue("   ")).toBe(false);
	});

	it("is false for empty arrays/objects", () => {
		expect(hasValue([])).toBe(false);
		expect(hasValue({})).toBe(false);
	});

	it("is true for 0/false", () => {
		expect(hasValue(0)).toBe(true);
		expect(hasValue(false)).toBe(true);
	});

	it("is true for non-empty strings/arrays/objects", () => {
		expect(hasValue("x")).toBe(true);
		expect(hasValue([1])).toBe(true);
		expect(hasValue({ a: 1 })).toBe(true);
	});
});

describe("getDefaultValueDisplay", () => {
	it("formats a date field's Date value", () => {
		expect(getDefaultValueDisplay("date", new Date(2026, 2, 1))).toBe(
			"3/1/2026"
		);
	});

	it("formats a toggle field's boolean value", () => {
		expect(getDefaultValueDisplay("toggle", true)).toBe("Yes");
		expect(getDefaultValueDisplay("toggle", false)).toBe("No");
	});

	it("joins a checkbox field's array value", () => {
		expect(getDefaultValueDisplay("checkbox", ["a", "b"])).toBe("a, b");
	});

	it("names a file field's single file", () => {
		const file = new File(["x"], "contrat.pdf");
		expect(getDefaultValueDisplay("file", [file])).toBe("contrat.pdf");
	});

	it("counts a file field's multiple files", () => {
		const files = [new File(["x"], "a.pdf"), new File(["y"], "b.pdf")];
		expect(getDefaultValueDisplay("file", files)).toBe("2 files");
	});

	it('returns undefined for an empty file array — the caller\'s own has-a-value/"-" fallback applies instead', () => {
		expect(getDefaultValueDisplay("file", [])).toBeUndefined();
	});

	it("returns undefined when the value's shape doesn't match the type (falls back to the caller's own handling)", () => {
		expect(getDefaultValueDisplay("date", "not-a-date")).toBeUndefined();
		expect(getDefaultValueDisplay("toggle", "yes")).toBeUndefined();
	});

	it("returns undefined for a type with no special-cased default", () => {
		expect(getDefaultValueDisplay("input", "hello")).toBeUndefined();
		expect(getDefaultValueDisplay(undefined, "hello")).toBeUndefined();
	});
});
