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
	width?: string;
	minWidth?: string;
	sortable?: boolean;
	onClick?: (item: T) => void;
	before?: (item: T) => React.ReactNode;
	sortKey?: keyof T & string;
	render?: (item: T) => React.ReactNode;
	hidden?: boolean;
	disableHiding?: boolean;
};
