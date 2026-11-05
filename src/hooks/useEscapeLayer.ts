import { useEffect, useRef } from "react";

type TLayer = { current: () => void };

/** Open layers, oldest first: Escape only ever reaches the last one. */
const layers: TLayer[] = [];

const handleKeyDown = (e: KeyboardEvent) => {
	// `isComposing`: Escape cancels an IME composition, nothing else.
	// `defaultPrevented`: a field used it for itself (ChipInput dropping its
	// draft, TodoItem cancelling an edit).
	if (e.key !== "Escape" || e.isComposing || e.defaultPrevented) return;
	layers[layers.length - 1]?.current();
};

/**
 * Closes an overlay on Escape, one layer at a time. floating-ui's `useDismiss`
 * listens on the document for each overlay separately and only knows about
 * nesting through a `FloatingTree`, so Escape in a Select inside a Modal
 * closed both, and a form's unsaved edits with them. Every overlay of the lib
 * goes through this stack instead (`useDismiss` with `escapeKey: false`): the
 * most recently opened one closes, the next Escape reaches the one below.
 *
 * An overlay that refuses Escape for now (a modal mid-submit) still passes a
 * no-op: it stays the top layer, so nothing beneath it closes either.
 */
export const useEscapeLayer = (active: boolean, onEscape: () => void) => {
	const layer = useRef(onEscape);
	layer.current = onEscape;

	useEffect(() => {
		if (!active) return;
		if (!layers.length) document.addEventListener("keydown", handleKeyDown);
		layers.push(layer);
		return () => {
			layers.splice(layers.indexOf(layer), 1);
			if (!layers.length) {
				document.removeEventListener("keydown", handleKeyDown);
			}
		};
	}, [active]);
};
