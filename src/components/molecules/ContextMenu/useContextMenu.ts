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
 * One controller, many triggers, one rendered `<ContextMenu menu={...}>`
 * (react-contexify's model) — not a `<ContextMenu>` per row. `data` passed
 * to `show` is what the menu's `items` resolver and item handlers get back.
 */
export function useContextMenu<T = undefined>(): IContextMenuController<T> {
	const [state, setState] = useState<IContextMenuState<T> | null>(null);

	const show = (event: React.MouseEvent, data: T) => {
		event.preventDefault();
		setState({ x: event.clientX, y: event.clientY, data });
	};

	const hide = () => setState(null);

	return { state, show, hide };
}
