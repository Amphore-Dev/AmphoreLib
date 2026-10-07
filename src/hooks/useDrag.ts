import React, { useEffect, useRef, useState } from "react";

export type TDragState = {
	startX: number;
	startY: number;
	x: number;
	y: number;
	dx: number;
	dy: number;
	/** Past `threshold` at least once — a drag, not a tap. Stays true once set. */
	moved: boolean;
	pointerType: string;
};

export type TDragEndState = TDragState & {
	/** Ended by `pointercancel` (the browser took the gesture over, the pointer was lost) rather than a release. */
	cancelled: boolean;
};

export interface IUseDragOptions {
	/** The pointer went down on the handle. Fires before any movement. */
	onStart?: (state: TDragState) => void;
	/** Every move while the pointer is down, once `threshold` has been passed. */
	onMove?: (state: TDragState) => void;
	/** Release or cancel. Check `moved` to tell a tap from a drag. */
	onEnd?: (state: TDragEndState) => void;
	/** Distance (px) before moves start being reported — below it, a press is still a tap. Defaults to 0. */
	threshold?: number;
	/** Axis `threshold` is measured on. Defaults to both (whichever moved most). */
	axis?: "x" | "y";
	disabled?: boolean;
}

export interface IUseDragResult {
	/** Spread onto the handle element (with the `drag-handle` SCSS mixin, for `touch-action: none`). */
	handleProps: {
		onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
	};
	isDragging: boolean;
}

/**
 * Pointer-driven drag on a handle — the one path every drag in this lib
 * goes through (TextArea's resize corner, TodoList's reorder, BottomPanel's
 * sheet), so mouse, touch and pen behave the same everywhere.
 *
 * What it takes care of, each one a mobile bug when forgotten:
 * - `setPointerCapture`: moves keep coming once the finger leaves the
 *   handle (it always does, a handle is small).
 * - `pointercancel`: the browser can take a touch gesture over (a scroll,
 *   a system gesture) and only tells the page through this event — without
 *   it, the drag never ends.
 * - Listening on `window`, not the handle: captured events still bubble
 *   there, and a release outside the page still ends the drag.
 *
 * The other half is CSS: the handle needs `touch-action: none`, or the
 * browser claims the gesture as a scroll before any move reaches us — see
 * the `drag-handle` mixin in src/styles/_touch.scss.
 *
 * Callbacks are read through a ref, so they always see the latest render's
 * props/state without re-subscribing mid-drag.
 */
export const useDrag = ({
	onStart,
	onMove,
	onEnd,
	threshold = 0,
	axis,
	disabled = false,
}: IUseDragOptions): IUseDragResult => {
	const callbacksRef = useRef({ onStart, onMove, onEnd });
	callbacksRef.current = { onStart, onMove, onEnd };

	const [isDragging, setIsDragging] = useState(false);
	const cleanupRef = useRef<(() => void) | null>(null);

	// A drag in progress when the component unmounts must not leave its
	// window listeners behind.
	useEffect(() => () => cleanupRef.current?.(), []);

	const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
		if (disabled) return;
		// Mouse: main button only. Touch/pen report button 0 too.
		if (e.pointerType === "mouse" && e.button !== 0) return;
		cleanupRef.current?.();

		// No text selection or native image drag starting under the pointer.
		e.preventDefault();
		const handle = e.currentTarget;
		const pointerId = e.pointerId;
		try {
			handle.setPointerCapture?.(pointerId);
		} catch {
			// Not capturable (pointer already gone) — window listeners still work.
		}

		const state: TDragState = {
			startX: e.clientX,
			startY: e.clientY,
			x: e.clientX,
			y: e.clientY,
			dx: 0,
			dy: 0,
			moved: false,
			pointerType: e.pointerType || "mouse",
		};

		const isOwnPointer = (event: PointerEvent) =>
			event.pointerId === undefined || event.pointerId === pointerId;

		const handleMove = (event: PointerEvent) => {
			if (!isOwnPointer(event)) return;
			state.x = event.clientX;
			state.y = event.clientY;
			state.dx = state.x - state.startX;
			state.dy = state.y - state.startY;
			const distance =
				axis === "x"
					? Math.abs(state.dx)
					: axis === "y"
						? Math.abs(state.dy)
						: Math.max(Math.abs(state.dx), Math.abs(state.dy));
			if (!state.moved && distance > threshold) state.moved = true;
			if (state.moved) callbacksRef.current.onMove?.({ ...state });
		};

		const finish = (cancelled: boolean) => (event: PointerEvent) => {
			if (!isOwnPointer(event)) return;
			cleanup();
			callbacksRef.current.onEnd?.({ ...state, cancelled });
		};
		const handleUp = finish(false);
		const handleCancel = finish(true);

		const cleanup = () => {
			window.removeEventListener("pointermove", handleMove);
			window.removeEventListener("pointerup", handleUp);
			window.removeEventListener("pointercancel", handleCancel);
			try {
				if (handle.hasPointerCapture?.(pointerId))
					handle.releasePointerCapture(pointerId);
			} catch {
				// Already released.
			}
			cleanupRef.current = null;
			setIsDragging(false);
		};

		window.addEventListener("pointermove", handleMove);
		window.addEventListener("pointerup", handleUp);
		window.addEventListener("pointercancel", handleCancel);
		cleanupRef.current = cleanup;
		setIsDragging(true);
		callbacksRef.current.onStart?.({ ...state });
	};

	return { handleProps: { onPointerDown }, isDragging };
};
