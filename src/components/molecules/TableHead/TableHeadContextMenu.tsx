import React, { useMemo } from "react";

import { TContextMenuItem } from "@interfaces/TContextMenu";
import { TTableColumn } from "@interfaces/TTable";

import { ContextMenu } from "../ContextMenu/ContextMenu";

export interface ITableHeadContextMenuProps<T> {
	id?: string;
	columns: TTableColumn<T>[];
	onClick?: (columnKey: keyof T & string) => void;
}

export const TableHeadContextMenu = <T,>({
	id,
	columns,
	onClick,
}: ITableHeadContextMenuProps<T>) => {
	const items: TContextMenuItem[] = useMemo(
		() =>
			columns
				.filter((col) => col.disableHiding !== true)
				.map((col) => ({
					id: col.key,
					label: col.label || col.key,
					icon: !col.hidden ? "check" : undefined,
					onClick: () => {
						onClick?.(col.key as keyof T & string);
					},
				})),
		[columns, onClick]
	);

	return (
		<ContextMenu id={id ?? "al__table-head-context-menu"} items={items} />
	);
};
