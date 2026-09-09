import { TPictoName } from "@constants/CPictos";

export type TSortDirection = "asc" | "desc";

export type TTableItemAction<T> = {
	label: string;
	icon?: TPictoName;
	onClick: (item: T, event: React.MouseEvent) => void;
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
