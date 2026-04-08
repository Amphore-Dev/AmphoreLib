import React, { ForwardedRef, forwardRef, memo, useMemo } from "react";

import { UseFloatingOptions } from "@floating-ui/react";

import { TTableColumn } from "@interfaces/TTable";

import { TableCell } from "@components/atoms";

import { cn } from "@utils/cn";

import "./TableRow.scss";

export interface ITableRowProps<T = unknown> {
	isClickable?: boolean;
	isDisabled?: boolean;
	item: T;
	onClick?: (item: T) => void;
	columns: TTableColumn<T>[];
	className?: string;
	style?: React.CSSProperties;
	selected?: boolean;
	onSelect?: (item: T) => void;
	cellSpacing?: string;
	itemsActionsStrategy?: UseFloatingOptions["strategy"];
}

function TableRowInner<T>(
	{
		isClickable = false,
		isDisabled = false,
		item,
		onClick,
		columns,
		className,
		style,
		selected,
		onSelect,
		cellSpacing = "1rem",
		itemsActionsStrategy,
	}: ITableRowProps<T>,
	ref: ForwardedRef<HTMLTableRowElement>
) {
	const cells = useMemo(() => {
		return columns.map((column, colIndex) => {
			const isColumnClickable =
				typeof column.clickable === "function"
					? column.clickable(item)
					: column.clickable ?? !!column.onClick;

			const value = column.value
				? typeof column.value === "function"
					? column.value(item)
					: (item[column.value as keyof T] as string | number)
				: undefined;

			const isSelectable =
				typeof column.selectable === "function"
					? column.selectable(item)
					: column.selectable ?? false;

			return (
				<TableCell
					key={colIndex}
					{...column}
					clickable={isColumnClickable}
					onClick={
						isColumnClickable
							? (item, e) => {
									if (isClickable) {
										e.stopPropagation();
									}
									column.onClick?.(item, e);
								}
							: undefined
					}
					onSelect={
						isSelectable
							? column.onSelect &&
								typeof column.onSelect === "function"
								? (state, item, e) =>
										column.onSelect?.(state, item, e)
								: (_, item) => onSelect?.(item)
							: undefined
					}
					isSelectCell={
						column.isSelectCell ||
						!!column.onSelect ||
						!!column.selectable
					}
					className={
						typeof column.className === "function"
							? column.className(item)
							: column.className
					}
					value={value}
					item={item}
					size={column.size}
					disabled={isDisabled}
					checked={selected}
					marginRight={
						colIndex < columns.length - 1 ? cellSpacing : undefined
					}
					itemsActionsStrategy={itemsActionsStrategy}
				/>
			);
		});
	}, [columns, item, isDisabled, selected]);

	return (
		<tr
			ref={ref}
			data-ras-table-row
			className={cn([
				"group",
				isClickable && "clickable",
				isDisabled && "disabled",
				selected && "selected",
				className,
			])}
			onKeyDown={(e) => {
				if (isClickable && (e.key === "Enter" || e.key === " ")) {
					e.preventDefault();
					onClick?.(item);
				}
			}}
			onClick={isClickable ? () => onClick?.(item) : undefined}
			tabIndex={isClickable ? 0 : undefined}
			data-disabled={isDisabled}
			style={style}
		>
			{cells}
		</tr>
	);
}

const ForwardedTableRowInner = forwardRef(TableRowInner) as <T>(
	props: ITableRowProps<T> & { ref?: ForwardedRef<HTMLTableRowElement> }
) => React.ReactElement | null;

// Wrap dans React.memo
export const TableRow = memo(
	ForwardedTableRowInner
) as typeof ForwardedTableRowInner;
