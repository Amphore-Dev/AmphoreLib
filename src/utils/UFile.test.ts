import isEqual from "react-fast-compare";
import { describe, expect, it } from "vitest";

import { tagFile } from "./UFile";

describe("tagFile", () => {
	it("makes two distinct files compare as different under react-fast-compare (Formik's dirty-check)", () => {
		// Without tagging, a bare File has zero own enumerable properties —
		// react-fast-compare (and lodash.isEqual) see `{}` vs `{}` and call
		// any two files equal, no matter how different — this is exactly
		// why picking a new file never used to flip Formik's `dirty`.
		const a = tagFile(new File(["x"], "a.pdf"));
		const b = tagFile(new File(["y"], "b.pdf"));
		expect(isEqual([a], [b])).toBe(false);
	});

	it("makes two picks of the literally same file compare as equal", () => {
		const a = tagFile(new File(["x"], "a.pdf"));
		const b = tagFile(new File(["x"], "a.pdf"));
		expect(isEqual([a], [b])).toBe(true);
	});

	it("mutates and returns the same reference", () => {
		const file = new File(["x"], "a.pdf");
		expect(tagFile(file)).toBe(file);
	});
});
