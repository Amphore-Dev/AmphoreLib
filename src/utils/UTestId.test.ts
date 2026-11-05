import { describe, expect, it } from "vitest";

import { deriveTestId, testIdPart } from "./UTestId";

describe("deriveTestId", () => {
	it("joins the base and the parts", () => {
		expect(deriveTestId("invoice", "title")).toBe("invoice-title");
		expect(deriveTestId("menu", "item", 0)).toBe("menu-item-0");
	});

	it("returns the base alone without parts", () => {
		expect(deriveTestId("invoice")).toBe("invoice");
	});

	it("never invents a testid", () => {
		expect(deriveTestId(undefined, "title")).toBeUndefined();
		expect(deriveTestId("", "title")).toBeUndefined();
	});
});

describe("testIdPart", () => {
	it("keeps a value that reads as text", () => {
		expect(testIdPart("fr", 2)).toBe("fr");
		expect(testIdPart(7, 2)).toBe(7);
	});

	it("falls back to the position otherwise", () => {
		expect(testIdPart({ id: 1 }, 2)).toBe(2);
		expect(testIdPart(null, 2)).toBe(2);
	});
});
