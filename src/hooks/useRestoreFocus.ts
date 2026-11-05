import { useLayoutEffect } from "react";

/**
 * For a non-modal panel: when `open` turns false and took the focused element
 * away with it, focus goes back to whatever had it when the panel opened.
 * Closing with focus elsewhere moves nothing. (Modal, Popover and the menus
 * get this from FloatingFocusManager, which also traps; a docked panel must
 * not trap.)
 */
export const useRestoreFocus = (open: boolean) => {
	useLayoutEffect(() => {
		if (!open) return;
		const opener = document.activeElement as HTMLElement | null;
		return () => {
			if (document.activeElement === document.body) opener?.focus();
		};
	}, [open]);
};
