import React from "react";

import { cn } from "@utils/cn";

import { TTableColumn } from "@interfaces/index";

import { Checkbox } from "../../atoms/Checkbox/Checkbox";
import { Picto } from "../../atoms/Picto/Picto";
import { Td } from "../../atoms/Td/Td";
import { TruncatedTooltipText } from "../../atoms/TruncatedTooltipText/TruncatedTooltipText";

import styles from "./TableRow.module.scss";

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
	/** Position among all rows, the header being 1: virtualized rows aren't all in the DOM to be counted. */
	rowIndex?: number;
	/** aria-label prefix for the row's checkbox, followed by the row's first value. */
	selectRowLabel?: string;
	/** aria-label prefix for the "⋮" button, followed by the row's first value. */
	rowActionsLabel?: string;
	/**
	 * aria-label prefix for a button doing what clicking the row does, followed
	 * by the row's first value: a row can't take focus itself (`display:
	 * contents`), so without it `onClick` is mouse-only. Omit when the row has
	 * no click, or a checkbox already does the same thing.
	 */
	rowButtonLabel?: string;
	/** State of that button when it toggles selection. */
	rowButtonPressed?: boolean;
}

/** What tells a row from the others: its first column, as plain text. */
const firstValue = <T,>(item: T, columns: TTableColumn<T>[]) => {
	const column = columns.find((col) => col.key !== "contextMenu");
	const value = column ? item[column.key as keyof T] : undefined;
	return typeof value === "string" || typeof value === "number"
		? String(value)
		: "";
};

const labelled = (label?: string, name?: string) =>
	label && name ? `${label}: ${name}` : label;

/**
 * V2 TableRow — `display: contents` so its `Td`s land directly in
 * `Table`'s grid (a real wrapper element would add its own grid item,
 * breaking column alignment). Selection state comes down as `isSelected`/
 * `onToggleSelect` — `Table` owns the actual `Set<key>` and shift/ctrl
 * range logic, this only renders one row's worth of it.
 */
export const TableRow = <T,>({
	item,
	columns,
	onClick,
	onContextMenu,
	onToggleSelect,
	className = "",
	selectable = false,
	isSelected = false,
	rowKey,
	rowIndex,
	selectRowLabel,
	rowActionsLabel,
	rowButtonLabel,
	rowButtonPressed,
}: ITableRowProps<T>) => (
	// Same reasoning as TableHead: role="row" is the grid layout semantic
	// (its Tds are the real grid cells via display:contents); onClick here
	// is the mouse's way to the row's action, the keyboard's is the button in
	// its first cell (`rowButtonLabel`).
	// eslint-disable-next-line jsx-a11y/interactive-supports-focus, jsx-a11y/click-events-have-key-events
	<div
		role="row"
		aria-rowindex={rowIndex}
		data-row-key={rowKey}
		data-selected={isSelected || undefined}
		style={{ display: "contents" }}
		className={cn([styles.row, onClick && styles.clickable, className])}
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
			<Td className={styles.selectCell}>
				<Checkbox
					aria-label={labelled(
						selectRowLabel,
						firstValue(item, columns)
					)}
					checked={isSelected}
					// The actual selection logic lives in onClick below (it
					// needs shiftKey/ctrlKey/metaKey, which onChange doesn't
					// carry) — a controlled checkbox still requires an
					// onChange or React warns. Not preventing default here
					// keeps the browser's native toggle, which is also what
					// lets React re-sync the DOM `checked` property on the
					// next render (skipping it can leave the checkbox
					// visually a click behind the real selection).
					onChange={() => {}}
					onClick={(e) => {
						e.stopPropagation();
						onToggleSelect?.(e);
					}}
				/>
			</Td>
		)}

		{columns.map((col, index) => {
			if (col.key === "contextMenu" && onContextMenu) {
				return (
					<Td key="contextMenu" className={styles.contextMenuCell}>
						<button
							type="button"
							className={styles.contextMenuButton}
							aria-label={labelled(
								rowActionsLabel,
								firstValue(item, columns)
							)}
							aria-haspopup="menu"
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
			const content = col.render
				? col.render(item)
				: String(item[col.key as keyof T] ?? "");
			return (
				<Td
					key={col.key}
					onClick={col.onClick ? () => col.onClick!(item) : undefined}
					className={
						index === 0 && rowButtonLabel
							? styles.rowButtonCell
							: undefined
					}
				>
					{index === 0 && rowButtonLabel && onClick && (
						<button
							type="button"
							className={styles.rowButton}
							aria-label={labelled(
								rowButtonLabel,
								firstValue(item, columns)
							)}
							aria-pressed={rowButtonPressed}
							onClick={(e) => {
								e.stopPropagation();
								onClick(item, e);
							}}
						/>
					)}
					{typeof col.before === "function"
						? col.before(item)
						: undefined}
					{col.truncate === false && !col.maxLines ? (
						content
					) : (
						<TruncatedTooltipText
							maxLines={col.maxLines}
							tooltip={col.truncate !== false}
						>
							{content}
						</TruncatedTooltipText>
					)}
				</Td>
			);
		})}

		{/* Absorbs Table's trailing "1fr" filler grid track. */}
		<Td aria-hidden />
	</div>
);
