import { describe, expect, it } from "vitest";

import { getPicto } from "./UPicto";

describe("getPicto", () => {
	it("wraps a plain icon name into an IPictoProps object", () => {
		expect(getPicto("search")).toEqual({ icon: "search" });
	});

	it("passes an already-IPictoProps object through unchanged", () => {
		const props = { icon: "search" as const, rotation: 90, color: "red" };
		expect(getPicto(props)).toBe(props);
	});
});
