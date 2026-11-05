import { useState } from "react";

export interface IContextMenuState<T> {
	x: number;
	y: number;
	data: T;
}

export interface IContextMenuController<T> {
	state: IContextMenuState<T> | null;
	/** Call from any trigger's onContextMenu — e.g. `onContextMenu={(e) => menu.show(e, row.id)}`. */
	show: (event: React.MouseEvent, data: T) => void;
	hide: () => void;
}

/**
 * Where to open. A click from the keyboard (Enter on a "⋮" button) has no
 * pointer behind it and reports (0, 0), `detail` 0, which would throw the menu
 * into the corner of the screen: it opens under the trigger instead.
 */
const anchorOf = (event: React.MouseEvent) => {
	const fromKeyboard =
		(event.type === "click" && event.detail === 0) ||
		(event.clientX === 0 && event.clientY === 0);
	const target = event.currentTarget as Element | null;
	if (!fromKeyboard || !target?.getBoundingClientRect) {
		return { x: event.clientX, y: event.clientY };
	}
	const { left, bottom } = target.getBoundingClientRect();
	return { x: left, y: bottom };
};

/**
 * One controller, many triggers, one rendered `<ContextMenu menu={...}>`
 * (react-contexify's model) — not a `<ContextMenu>` per row. `data` passed
 * to `show` is what the menu's `items` resolver and item handlers get back.
 */
export function useContextMenu<T = undefined>(): IContextMenuController<T> {
	const [state, setState] = useState<IContextMenuState<T> | null>(null);

	const show = (event: React.MouseEvent, data: T) => {
		event.preventDefault();
		setState({ ...anchorOf(event), data });
	};

	const hide = () => setState(null);

	return { state, show, hide };
}
