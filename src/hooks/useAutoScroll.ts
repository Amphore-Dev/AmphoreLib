import { RefObject, useEffect, useRef } from "react";

export interface IUseAutoScrollOptions {
	/** Distance (px) from the scroll container's top/bottom edge where scrolling kicks in. Defaults to 48. */
	edge?: number;
	/** Scroll speed (px per frame) right at the edge — ramps up from 0 across `edge`. Defaults to 14. */
	maxSpeed?: number;
	/** Called after every scroll step, so the consumer can re-hit-test against content that just moved under a still pointer. */
	onScroll?: () => void;
}

export interface IUseAutoScrollResult {
	/** Feed the pointer's latest Y while dragging. */
	update: (clientY: number) => void;
	/** Drag ended — stops scrolling. */
	stop: () => void;
}

const isScrollable = (el: HTMLElement) => {
	const { overflowY } = getComputedStyle(el);
	return (
		(overflowY === "auto" || overflowY === "scroll") &&
		el.scrollHeight > el.clientHeight
	);
};

/** Nearest scrollable ancestor, or `null` for the page itself. */
const findScrollParent = (el: HTMLElement | null): HTMLElement | null => {
	for (let node = el?.parentElement; node; node = node.parentElement) {
		if (node === document.body || node === document.documentElement)
			return null;
		if (isScrollable(node)) return node;
	}
	return null;
};

/**
 * Scrolls the nearest scrollable ancestor of `ref` (or the page) while a
 * dragged pointer sits near its top/bottom edge. On a phone the list being
 * reordered rarely fits the screen, and with `touch-action: none` on the
 * handle the finger can't scroll it either — this is the only way to drag
 * an item further than what's visible.
 *
 * Vertical only: every drag in this lib so far is.
 */
export const useAutoScroll = (
	ref: RefObject<HTMLElement | null>,
	{ edge = 48, maxSpeed = 14, onScroll }: IUseAutoScrollOptions = {}
): IUseAutoScrollResult => {
	const frameRef = useRef<number | null>(null);
	const pointerYRef = useRef(0);
	const onScrollRef = useRef(onScroll);
	onScrollRef.current = onScroll;

	const stop = () => {
		if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
		frameRef.current = null;
	};

	useEffect(() => stop, []);

	const step = () => {
		frameRef.current = null;
		const parent = findScrollParent(ref.current);
		const top = parent ? parent.getBoundingClientRect().top : 0;
		const bottom = parent
			? parent.getBoundingClientRect().bottom
			: window.innerHeight;
		const y = pointerYRef.current;

		let speed = 0;
		if (y < top + edge)
			speed = -maxSpeed * Math.min(1, (top + edge - y) / edge);
		else if (y > bottom - edge)
			speed = maxSpeed * Math.min(1, (y - (bottom - edge)) / edge);
		if (!speed) return;

		const scroller = parent ?? document.scrollingElement;
		if (!scroller) return;
		const before = scroller.scrollTop;
		scroller.scrollTop += speed;
		// Already at the end in that direction: nothing moved, stop asking.
		if (scroller.scrollTop === before) return;

		onScrollRef.current?.();
		frameRef.current = requestAnimationFrame(step);
	};

	const update = (clientY: number) => {
		pointerYRef.current = clientY;
		if (frameRef.current === null)
			frameRef.current = requestAnimationFrame(step);
	};

	return { update, stop };
};
