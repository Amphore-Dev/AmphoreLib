import { QueryFunction } from "@tanstack/react-query";

import { IUseListValues } from "hooks/useList";

import { IActionsListItem, ISortOptions, ITableRow } from "components/types";

export interface IPaginationProp {
	currentPage?: number;
	totalCount?: number;
	pageSize?: number;
}

export interface IPagination extends IPaginationProp {
	currentPage: number;
	totalCount: number;
	pageSize: number;
}

export interface IColumn {
	name: string;
	value: string;
	hidden?: boolean | ((rowProps: any) => boolean);
	sortable?: boolean;
	sortKey?: string;
	sortLabel?: string;
	headerClassName?: string;
	className?: string;
	render?: (item: any, props: any) => React.ReactNode;
	headerRender?: (column: IColumn, props: any) => React.ReactNode;
}

export interface IRowProps {
	row: any;
	props?: any;
	columns: any[];
	className?: string;
	onRowClick?: (item: any) => void;
}

export interface IColHeaderProps extends IRowProps {
	onColumnClick?: (column: IColumn) => void;
	sortableHeader?: boolean;
	sortOptions?: ISortOptions;
}

export interface IListHeaderProps {
	selectable?: ((item: any) => boolean) | boolean;
	selected?: any[];
	isSelected?: (item: any) => boolean;
	isSelectionDisabled?: (item: any) => boolean;
	onSelected?: (selected: any, state: boolean) => void;
	columns?: IColumn[];
	activeValue?: string;
	handleFilter?: (option: any) => void;
	sortBy?: string;
	actions?: IActionsListItem[] | React.ReactNode | any;
	className?: string;
	disabled?: boolean;
	items?: any[];
}

export interface IListProps extends IListHeaderProps {
	filters?: React.ReactNode;
	itemActions?:
		| IActionsListItem[]
		| React.ReactNode
		| ((item: any) => IActionsListItem[] | React.ReactNode | any)
		| any;
	children?: React.FC;
	rowProps?: any;
	header?: React.ReactNode | "disabled";
	tableHeader?: boolean | ITableRow | any;
	tableClassName?: string;
	paginated?: boolean;
	pagination?: IPagination;
	onPageChange?: (page: number) => void;
	footer?: React.ReactNode;
	scrollParentSelector?: string;
	useListHook?: IUseListValues;
	itemIdKey?: string; // used to identify item in list
	preventPageChange?: boolean;
	sortableHeader?: boolean;
	sortOptions?: ISortOptions;
	onItemClick?: (item: any) => void;
	onColumnClick?: (column: IColumn) => void;
}

// async

interface IQuery {
	queryKey: string[];
	queryFn: QueryFunction<any>;
	[key: string]: any; // for other query params
}

export interface IAsyncListProps extends IListProps {
	query: IQuery;
	itemsKey?: string;
	loadingMessage?: string;
	errorMessage?: string;
	noDataMessage?: string | React.ReactNode;
}
