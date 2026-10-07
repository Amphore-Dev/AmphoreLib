import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { IUseDragOptions, useDrag } from "./useDrag";

const Handle: React.FC<IUseDragOptions> = (options) => {
	const { handleProps, isDragging } = useDrag(options);
	return (
		<div
			data-testid="handle"
			data-dragging={isDragging || undefined}
			{...handleProps}
		/>
	);
};

const move = (clientX: number, clientY: number) =>
	fireEvent(window, new PointerEvent("pointermove", { clientX, clientY }));

describe("useDrag", () => {
	it("reports start, moves (relative to the start) and end", () => {
		const onStart = vi.fn();
		const onMove = vi.fn();
		const onEnd = vi.fn();
		render(<Handle onStart={onStart} onMove={onMove} onEnd={onEnd} />);

		fireEvent.pointerDown(screen.getByTestId("handle"), {
			clientX: 10,
			clientY: 100,
		});
		expect(onStart).toHaveBeenCalledWith(
			expect.objectContaining({ startY: 100, moved: false })
		);

		move(15, 140);
		expect(onMove).toHaveBeenLastCalledWith(
			expect.objectContaining({ dx: 5, dy: 40, y: 140, moved: true })
		);

		fireEvent(window, new PointerEvent("pointerup"));
		expect(onEnd).toHaveBeenCalledWith(
			expect.objectContaining({ dy: 40, moved: true, cancelled: false })
		);
	});

	it("ends the drag on pointercancel, flagged as cancelled", () => {
		const onEnd = vi.fn();
		const onMove = vi.fn();
		render(<Handle onMove={onMove} onEnd={onEnd} />);

		fireEvent.pointerDown(screen.getByTestId("handle"), { clientY: 0 });
		fireEvent(window, new PointerEvent("pointercancel"));
		expect(onEnd).toHaveBeenCalledWith(
			expect.objectContaining({ cancelled: true })
		);

		// Listeners are gone: later moves no longer reach the consumer.
		move(0, 50);
		expect(onMove).not.toHaveBeenCalled();
	});

	it("exposes isDragging while the pointer is down", () => {
		render(<Handle />);
		const handle = screen.getByTestId("handle");
		expect(handle).not.toHaveAttribute("data-dragging");
		fireEvent.pointerDown(handle);
		expect(handle).toHaveAttribute("data-dragging", "true");
		fireEvent(window, new PointerEvent("pointerup"));
		expect(handle).not.toHaveAttribute("data-dragging");
	});

	it("doesn't report moves under the threshold — still a tap", () => {
		const onMove = vi.fn();
		const onEnd = vi.fn();
		render(<Handle threshold={4} onMove={onMove} onEnd={onEnd} />);

		fireEvent.pointerDown(screen.getByTestId("handle"), { clientY: 100 });
		move(0, 103);
		fireEvent(window, new PointerEvent("pointerup"));

		expect(onMove).not.toHaveBeenCalled();
		expect(onEnd).toHaveBeenCalledWith(
			expect.objectContaining({ moved: false })
		);
	});

	it("measures the threshold on `axis` only", () => {
		const onMove = vi.fn();
		render(<Handle threshold={4} axis="y" onMove={onMove} />);

		fireEvent.pointerDown(screen.getByTestId("handle"), {
			clientX: 0,
			clientY: 100,
		});
		move(30, 102); // far sideways, barely vertical
		expect(onMove).not.toHaveBeenCalled();
		move(30, 110);
		expect(onMove).toHaveBeenCalledTimes(1);
	});

	it("captures the pointer on the handle", () => {
		render(<Handle />);
		const handle = screen.getByTestId("handle");
		const setPointerCapture = vi.fn();
		handle.setPointerCapture = setPointerCapture;

		fireEvent.pointerDown(handle, { pointerId: 7 });
		expect(setPointerCapture).toHaveBeenCalledWith(7);
	});

	it("ignores a mouse button other than the main one", () => {
		const onStart = vi.fn();
		render(<Handle onStart={onStart} />);
		fireEvent.pointerDown(screen.getByTestId("handle"), {
			button: 2,
			pointerType: "mouse",
		});
		expect(onStart).not.toHaveBeenCalled();
	});

	it("does nothing when disabled", () => {
		const onStart = vi.fn();
		render(<Handle disabled onStart={onStart} />);
		fireEvent.pointerDown(screen.getByTestId("handle"));
		expect(onStart).not.toHaveBeenCalled();
	});

	it("removes its window listeners if unmounted mid-drag", () => {
		const onMove = vi.fn();
		const { unmount } = render(<Handle onMove={onMove} />);
		fireEvent.pointerDown(screen.getByTestId("handle"), { clientY: 0 });
		unmount();
		move(0, 50);
		expect(onMove).not.toHaveBeenCalled();
	});
});
