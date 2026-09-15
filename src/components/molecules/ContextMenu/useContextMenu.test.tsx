import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useContextMenu } from "./useContextMenu";

const fakeEvent = (x: number, y: number) =>
	({
		preventDefault: () => {},
		clientX: x,
		clientY: y,
	}) as React.MouseEvent;

describe("useContextMenu", () => {
	it("starts with no open state", () => {
		const { result } = renderHook(() => useContextMenu<string>());
		expect(result.current.state).toBeNull();
	});

	it("show() records the cursor position and the given data", () => {
		const { result } = renderHook(() => useContextMenu<string>());
		act(() => result.current.show(fakeEvent(10, 20), "row-1"));
		expect(result.current.state).toEqual({ x: 10, y: 20, data: "row-1" });
	});

	it("hide() clears the state", () => {
		const { result } = renderHook(() => useContextMenu<string>());
		act(() => result.current.show(fakeEvent(10, 20), "row-1"));
		act(() => result.current.hide());
		expect(result.current.state).toBeNull();
	});

	it("a second show() replaces the previous state", () => {
		const { result } = renderHook(() => useContextMenu<string>());
		act(() => result.current.show(fakeEvent(10, 20), "row-1"));
		act(() => result.current.show(fakeEvent(30, 40), "row-2"));
		expect(result.current.state).toEqual({ x: 30, y: 40, data: "row-2" });
	});
});
