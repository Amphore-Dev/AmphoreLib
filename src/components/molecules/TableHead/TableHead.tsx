import React from "react";

import { useContextMenu } from "react-contexify";

import { TSortDirection, TTableColumn } from "@interfaces/TTable";

import { Checkbox, Picto, Th } from "@components/atoms";

export interface ITableHeadProps<T> {
	columns: TTableColumn<T>[];
	activeSortKey?: keyof T & string;
	sortDirection?: TSortDirection;
	onSort?: (key: keyof T & string) => void;
	columnsMenuId?: string;
	onContextMenu?: (item: T, event: React.MouseEvent) => void;
	onGlobalContextMenu?: (event: React.MouseEvent) => void;
	selectable?: boolean;
	allSelected?: boolean;
	someSelected?: boolean;
	onSelectAll?: () => void;
}

export const TableHead = <T,>({
	columns,
	activeSortKey,
	sortDirection,
	onSort,
	columnsMenuId,
	onContextMenu,
	onGlobalContextMenu,
	selectable,
	allSelected,
	someSelected,
	onSelectAll,
}: ITableHeadProps<T>) => {
	const { show } = useContextMenu({
		id: columnsMenuId ?? "al__table-head-context-menu",
	});

	return (
		<div
			role="row"
			style={{ display: "contents" }}
			onContextMenu={(e) => {
				e.preventDefault();
				show({ event: e });
			}}
		>
			{selectable && (
				<Th className="justify-center" key="select">
					<Checkbox
						checked={allSelected}
						indeterminate={someSelected}
						onChange={() => onSelectAll?.()}
					/>
				</Th>
			)}
			{columns.map((col) => {
				const key = col.sortKey ?? col.key;
				const isActive = activeSortKey === key;
				if (col.key === "contextMenu") {
					return (
						(onContextMenu || onGlobalContextMenu) && (
							<Th className="relative" key="contextMenu">
								{onGlobalContextMenu &&
								(someSelected || allSelected) ? (
									<button
										type="button"
										className="absolute left-0 top-0 flex h-full w-full items-center justify-center"
										onClick={(e) => {
											e.stopPropagation();
											onGlobalContextMenu?.(e);
										}}
									>
										<Picto icon="more" />
									</button>
								) : (
									<>&nbsp;</>
								)}
							</Th>
						)
					);
				}
				return (
					<Th
						key={col.key}
						sortable={col.sortable}
						sortDirection={isActive ? sortDirection : undefined}
						onSort={
							col.sortable
								? () => onSort?.(key as keyof T & string)
								: undefined
						}
					>
						{col.label}
					</Th>
				);
			})}

			<Th />
		</div>
	);
};
