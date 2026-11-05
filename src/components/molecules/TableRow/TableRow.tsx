import React from "react";

import { genericForwardRef } from "@utils/UForwardRef";
import { deriveTestId } from "@utils/UTestId";
import { cn } from "@utils/cn";

import { ITestIdProps, TTableColumn } from "@interfaces/index";

import { Checkbox } from "../../atoms/Checkbox/Checkbox";
import { Picto } from "../../atoms/Picto/Picto";
import { Td } from "../../atoms/Td/Td";
import { TruncatedTooltipText } from "../../atoms/TruncatedTooltipText/TruncatedTooltipText";

import styles from "./TableRow.module.scss";

export interface ITableRowProps<T>
	extends
		Omit<
			React.ComponentPropsWithoutRef<"div">,
			"onClick" | "onContextMenu" | "children"
		>,
		ITestIdProps {
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

const TableRowBase = <T,>(
	{
		item,
		columns,
		onClick,
		onContextMenu,
		onToggleSelect,
		className = "",
		selectable = false,
		isSelected = false,
		rowKey,
		style,
		...props
	}: ITableRowProps<T>,
	ref: React.ForwardedRef<HTMLDivElement>
) => (
	// Same reasoning as TableHead: role="row" is the grid layout semantic
	// (its Tds are the real grid cells via display:contents); onClick here
	// is an optional mouse convenience (selectOnClick / onRowClick), not the
	// row becoming a single keyboard-focusable control — the row's own
	// interactive elements (checkbox, buttons) already are.
	// eslint-disable-next-line jsx-a11y/interactive-supports-focus, jsx-a11y/click-events-have-key-events
	<div
		{...props}
		ref={ref}
		role="row"
		data-row-key={rowKey}
		data-selected={isSelected || undefined}
		style={{ ...style, display: "contents" }}
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
					checked={isSelected}
					data-testid={deriveTestId(props["data-testid"], "select")}
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

		{columns.map((col) => {
			if (col.key === "contextMenu" && onContextMenu) {
				return (
					<Td key="contextMenu" className={styles.contextMenuCell}>
						<button
							type="button"
							className={styles.contextMenuButton}
							data-testid={deriveTestId(
								props["data-testid"],
								"actions"
							)}
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
					data-testid={deriveTestId(props["data-testid"], col.key)}
					onClick={col.onClick ? () => col.onClick!(item) : undefined}
				>
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
		<Td />
	</div>
);

/**
 * V2 TableRow — `display: contents` so its `Td`s land directly in
 * `Table`'s grid (a real wrapper element would add its own grid item,
 * breaking column alignment). Selection state comes down as `isSelected`/
 * `onToggleSelect` — `Table` owns the actual `Set<key>` and shift/ctrl
 * range logic, this only renders one row's worth of it.
 *
 * Native props and `ref` go to the `role="row"` element; `onClick` and
 * `onContextMenu` are the row-level ones declared above. Derived testids:
 * `-select`, `-actions`, `-<column key>` per cell.
 */
export const TableRow = genericForwardRef(TableRowBase, "TableRow");
