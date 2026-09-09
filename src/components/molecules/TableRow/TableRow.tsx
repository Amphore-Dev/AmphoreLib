import React from "react";

import { TTableColumn } from "@interfaces/TTable";

import { Checkbox, Picto, Td, TruncatedTooltipText } from "@components/atoms";

import { cn } from "@utils/cn";

export interface ITableRowProps<T> {
	item: T;
	columns: TTableColumn<T>[];
	onClick?: (item: T, event: React.MouseEvent) => void;
	onContextMenu?: (
		item: T,
		event: React.MouseEvent,
		fromButton?: boolean
	) => void;
	onToggleSelect?: (event: React.MouseEvent) => void;
	className?: string;
	selectable?: boolean;
	isSelected?: boolean;
	rowKey?: React.Key;
}

export const TableRow = <T,>({
	item,
	columns,
	onClick,
	onContextMenu,
	onToggleSelect,
	className,
	selectable,
	isSelected,
	rowKey,
}: ITableRowProps<T>) => {
	return (
		<div
			role="row"
			data-row-key={rowKey}
			style={{ display: "contents" }}
			data-selected={isSelected || undefined}
			className={cn(["group", onClick && "cursor-pointer", className])}
			onClick={onClick ? (e) => onClick(item, e) : undefined}
			onContextMenu={
				onContextMenu
					? (e) => {
							e.preventDefault();
							onContextMenu(item, e);
						}
					: undefined
			}
		>
			{selectable && (
				<Td className="justify-center" key="select">
					<Checkbox
						checked={!!isSelected}
						// react requires an onChange on a controlled checkbox;
						// the actual selection logic lives in onClick below so
						// it can read shiftKey/ctrlKey/metaKey. Don't
						// preventDefault the click — doing so stops the
						// browser's native toggle, which is also what lets
						// React correctly re-sync the DOM `checked` property
						// on the next render (without it, the checkbox can
						// visually lag a click behind the real selection).
						onChange={() => {}}
						onClick={(e) => {
							e.stopPropagation();
							onToggleSelect?.(e);
						}}
					/>
				</Td>
			)}
			{columns.map((col) => {
				if (col.key === "contextMenu" && onContextMenu) {
					return (
						<Td className="relative" key="contextMenu">
							<button
								type="button"
								className="absolute left-0 top-0 flex h-full w-full items-center justify-center opacity-0 group-hover:opacity-100"
								onClick={(e) => {
									e.stopPropagation();
									onContextMenu(item, e, true);
								}}
							>
								<Picto icon="more" />
							</button>
						</Td>
					);
				}
				return (
					<Td
						key={col.key}
						onClick={col.onClick ? () => col.onClick!(item) : undefined}
					>
						{typeof col.before === "function"
							? col.before(item)
							: undefined}
						<TruncatedTooltipText>
							{col.render
								? col.render(item)
								: String(item[col.key as keyof T] ?? "")}
						</TruncatedTooltipText>
					</Td>
				);
			})}

			<Td />
		</div>
	);
};
