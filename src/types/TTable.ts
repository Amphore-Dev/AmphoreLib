import type { IPictoProps } from "@components/atoms";

import type { TPictoName } from "@constants/index";

export type TSortDirection = "asc" | "desc";

export type TTableItemAction<T> = {
	label: string;
	/** Leading icon (see Picto) — an icon name, or an `IPictoProps` object to pass other Picto props. */
	picto?: TPictoName | IPictoProps;
	/**
	 * No event param (unlike v1's react-contexify version) — V2's
	 * ContextMenu doesn't forward the triggering right-click event to item
	 * selection, and by the time a menu item is clicked it'd be stale
	 * anyway (a different DOM event: the menu item's own click).
	 */
	onClick: (item: T) => void;
	disabled?: boolean | ((item: T) => boolean);
	hidden?: boolean | ((item: T) => boolean);
};

type KeyOfChildren<T> = {
	[K in keyof T]: T[K] extends object ? keyof T[K] & string : never;
}[keyof T];

export type TTableColumn<T> = {
	key: (keyof T & string) | "contextMenu" | KeyOfChildren<T>;
	label?: string;
	/**
	 * Any CSS grid track size: a length/percentage (`"200px"`, `"20%"`), a
	 * flex (`"1fr"`) or a keyword (`"auto"`, `"max-content"`). Combined with
	 * `minWidth` when both are given. Defaults to `max-content`.
	 */
	width?: string;
	/** Lower bound for the column. Defaults to `150px` (no `width` or a `fr` width), `min-content` (keyword width), none otherwise. */
	minWidth?: string;
	sortable?: boolean;
	onClick?: (item: T) => void;
	before?: (item: T) => React.ReactNode;
	sortKey?: keyof T & string;
	render?: (item: T) => React.ReactNode;
	hidden?: boolean;
	disableHiding?: boolean;
	/**
	 * Cell content is wrapped in a `TruncatedTooltipText` (ellipsis + tooltip
	 * with the full text once it overflows). Set `false` to turn that off —
	 * e.g. when `render` returns something that shouldn't be clipped or
	 * hovered (badges, buttons). Alone it renders the content as-is; with
	 * `maxLines` it keeps the line clamp and only drops the tooltip.
	 * Defaults to true.
	 */
	truncate?: boolean;
	/**
	 * Lines of text before the ellipsis kicks in (see TruncatedTooltipText).
	 * Defaults to 1. Rows are laid out in normal flow so taller cells just
	 * make taller rows, but bump `rowHeight` to match — it's the
	 * virtualizer's size estimate.
	 */
	maxLines?: number;
};
