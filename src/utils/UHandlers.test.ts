import { describe, expect, it, vi } from "vitest";

import { composeHandlers } from "./UHandlers";

describe("composeHandlers", () => {
	it("calls every handler, in order, with the event", () => {
		const calls: string[] = [];
		const composed = composeHandlers<string>(
			(event) => calls.push(`first:${event}`),
			(event) => calls.push(`second:${event}`)
		);
		composed("click");
		expect(calls).toEqual(["first:click", "second:click"]);
	});

	it("skips what is not given", () => {
		const handler = vi.fn();
		composeHandlers<string>(undefined, handler)("click");
		expect(handler).toHaveBeenCalledTimes(1);
	});
});
