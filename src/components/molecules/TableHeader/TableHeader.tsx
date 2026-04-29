import React from "react";

import { TSortDirection, TTableColumn } from "@interfaces/TTable";

import { TableHeaderCell } from "@components/atoms";

import "./TableHeader.scss";

export interface ITableHeaderProps<T = unknown> {
	columns: TTableColumn<T>[];
	sortKey: string;
	sortDirection: TSortDirection;
	onSort: (key: string, direction: TSortDirection) => void;
	items?: T[];
	cellsClassName?: string;
	onSelect?: (selectedItems: T[]) => void;
	selectedItems?: T[];
	getItemId?: (item: T) => string | number;
}

export const TableHeader = <T,>({
	columns = [],
	sortKey,
	sortDirection,
	onSort,
	items = [],
	cellsClassName,
	onSelect = undefined,
	selectedItems = [],
	getItemId,
}: ITableHeaderProps<T>) => {
	const getSelectableItems = (column: TTableColumn<T>) => {
		return items.filter((item) =>
			typeof column.selectable === "function"
				? column.selectable(item)
				: column.selectable !== false
		);
	};

	const handleSelectAll = (checked: boolean, column: TTableColumn<T>) => {
		const selectableItems = getSelectableItems(column);
		onSelect?.(checked && selectableItems.length ? selectableItems : []);
	};

	const isAllSelected = (column: TTableColumn<T>) => {
		const selectableItems = getSelectableItems(column);
		if (selectableItems.length === 0) return false;

		if (getItemId) {
			const selectedIds = selectedItems.map(getItemId);
			return selectableItems
				.map(getItemId)
				.every((id) => selectedIds.includes(id));
		}
		return selectableItems.length === selectedItems.length;
	};

	return (
		<div data-ras-table-header role="row">
			{columns.map((column, index) => (
				<TableHeaderCell
					isAllSelected={isAllSelected}
					key={index}
					{...column}
					column={column}
					sortDirection={
						sortKey === column.value ? sortDirection : undefined
					}
					onSelect={handleSelectAll}
					onSort={(direction) => {
						if (column.sortable) {
							onSort?.(column.name, direction);
						}
					}}
					className={column.headerClassName ?? cellsClassName}
				/>
			))}
		</div>
	);
};
