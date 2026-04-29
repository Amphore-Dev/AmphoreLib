import { TPictoName } from "@constants/CPictos";
import { UseFloatingOptions } from "@floating-ui/react";

import { IButtonProps, ITagProps } from "@components/atoms";

export type TSortDirection = "asc" | "desc" | "none" | undefined;

export type TTableItemAction<T> = {
	label: string;
	icon?: TPictoName;
	onClick: (item: T, event: React.MouseEvent) => void;
	disabled?: boolean | ((item: T) => boolean);
	hidden?: boolean | ((item: T) => boolean);
};

export type TTableCell<T> = {
	value?:
		| string
		| number
		| boolean
		| null
		| React.ReactNode
		| ((
				item: T
		  ) => string | number | undefined | null | boolean | React.ReactNode);
	description?: string | ((item: T) => string | undefined);
	badge?:
		| string
		| {
				label: string;
				color?: ITagProps["color"];
				size?: ITagProps["size"];
		  }
		| ((
				item: T
		  ) =>
				| string
				| { label: string; color?: string; size?: ITagProps["size"] }
				| undefined
				| false);
	itemActions?:
		| TTableItemAction<T>[]
		| ((item: T) => TTableItemAction<T>[] | undefined | false);
	clickable?: boolean | ((item: T) => boolean);
	onClick?: (item: T, e: React.MouseEvent | React.KeyboardEvent) => void;
	onSelect?: (
		selected: boolean,
		item: T,
		event: React.ChangeEvent<HTMLInputElement>
	) => void;
	isSelectCell?: boolean;
	selectable?: boolean | ((item: T) => boolean);
	checked?: boolean;
	button?: Omit<IButtonProps, "onClick"> & {
		onClick?: (item: T, e: React.MouseEvent | React.KeyboardEvent) => void;
	};
	className?: string | ((item: T) => string);
	item?: T;
	picto?: TPictoName | ((item: T) => TPictoName | undefined);
	disabled?: boolean;
	itemsActionsStrategy?: UseFloatingOptions["strategy"];
};

export type TTableColumn<T> = TTableCell<T> & {
	title?: string;
	name: string;
	hidden?: boolean | ((rowProps: unknown) => boolean);
	sortable?: boolean;
	sortKey?: string;
	sortLabel?: string;
	onSort?: (key: string, direction: TSortDirection) => void;
	className?: string | ((rowProps: T) => string);
	headerClassName?: string;
	width?: string;
	showOnHover?: boolean;
	render?: React.ReactNode | ((props: TTableCell<T>) => React.ReactNode);
};

export type TTableOmitedColumn<T> = Omit<
	TTableColumn<T>,
	"onSort" | "onSelect"
>; // used for TableHeaderCell
