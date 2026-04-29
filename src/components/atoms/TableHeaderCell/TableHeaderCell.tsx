import React, { AriaAttributes } from "react";

import {
	TTableOmitedColumn,
	TSortDirection,
	TTableColumn,
} from "@interfaces/index";

import { Checkbox } from "../Checkbox/Checkbox";
import { Picto } from "../Picto/Picto";

import { cn } from "@utils/cn";

import "./TableHeaderCell.scss";

export interface ITableHeaderCellProps<T> extends TTableOmitedColumn<T> {
	sortable?: boolean;
	sortDirection: TSortDirection;
	onSort?: (direction: TSortDirection) => void;
	title?: string;
	className?: string;
	onSelect?: (selected: boolean, column: TTableOmitedColumn<T>) => void;
	column?: TTableColumn<T>;
	isAllSelected?: (column: TTableColumn<T>) => boolean;
}

export const TableHeaderCell = <T,>({
	sortable = false,
	sortDirection,
	onSort,
	title = "",
	className = "",
	selectable = false,
	onSelect,
	column = {} as TTableColumn<T>,
	isAllSelected = () => false,
}: ITableHeaderCellProps<T>) => {
	const handleSort = () => {
		if (sortable && onSort) {
			onSort(sortDirection === "asc" ? "desc" : "asc");
		}
	};

	const sortDirectionToAria = (
		sortable: boolean,
		direction: TSortDirection
	): AriaAttributes["aria-sort"] => {
		if (!sortable) return undefined;
		const map = { asc: "ascending", desc: "descending", none: undefined };
		return map[direction || "none"] as AriaAttributes["aria-sort"];
	};

	return (
		<div
			tabIndex={sortable ? 0 : undefined}
			role="columnheader"
			aria-sort={sortDirectionToAria(sortable, sortDirection)}
			className={cn([
				"table-header-cell",
				sortable && "sortable",
				sortable && sortDirection && "is-sorted",
				className,
			])}
			onClick={handleSort}
			onKeyDown={(e) => {
				if ((e.key === "Enter" || e.key === " ") && sortable) {
					e.preventDefault();
					handleSort();
				}
			}}
		>
			<div className="table-header-cell-content">
				{selectable && (
					<div className="selectable-icon">
						<Checkbox
							checked={isAllSelected(column)}
							onChange={(e) =>
								onSelect?.(e.target.checked, column)
							}
							className="selectable-checkbox"
						/>
					</div>
				)}
				{title}
				{sortable && (
					<div className={cn(["sort-icon-wrapper", sortDirection])}>
						<Picto
							icon={
								sortDirection === "asc" ? "sortAsc" : "sortDesc"
							}
							className="sort-icon"
						/>
					</div>
				)}
			</div>
		</div>
	);
};
