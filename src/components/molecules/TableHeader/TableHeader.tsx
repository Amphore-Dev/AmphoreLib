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

		if (selectableItems && selectableItems.length > 0) {
			const selectedItems = checked ? selectableItems : [];

			onSelect?.(selectedItems);
		} else {
			onSelect?.([]);
		}
	};

	const isAllSelected = (column: TTableColumn<T>) => {
		const selectableItems = getSelectableItems(column);
		if (selectableItems.length === 0) return false;

		if (getItemId) {
			const selectedItemIds = selectedItems.map(getItemId);
			const selectableItemIds = selectableItems.map(getItemId);
			return (
				selectableItemIds.length > 0 &&
				selectableItemIds.every((id) => selectedItemIds.includes(id))
			);
		}
		return selectableItems?.length === selectedItems?.length;
	};

	return (
		<thead data-ras-table-header>
			<tr>
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
						size={column.size}
						className={column.headerClassName ?? cellsClassName}
					/>
				))}
			</tr>
		</thead>
	);
};
