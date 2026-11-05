import React from "react";

import { TSortDirection, TTableColumn } from "@interfaces/index";

import { Checkbox } from "../../atoms/Checkbox/Checkbox";
import { Picto } from "../../atoms/Picto/Picto";
import { Th } from "../../atoms/Th/Th";

import styles from "./TableHead.module.scss";

export interface ITableHeadProps<T> {
	columns: TTableColumn<T>[];
	activeSortKey?: keyof T & string;
	sortDirection?: TSortDirection;
	onSort?: (key: keyof T & string) => void;
	/** Right-click anywhere on the header row — `Table` owns the actual column-visibility menu/controller. */
	onColumnsContextMenu?: (event: React.MouseEvent) => void;
	/** Whether rows have a "contextMenu" column, so its header cell renders too (kept aligned). */
	hasContextMenuColumn?: boolean;
	onGlobalContextMenu?: (event: React.MouseEvent) => void;
	selectable?: boolean;
	allSelected?: boolean;
	someSelected?: boolean;
	onSelectAll?: () => void;
	/** aria-label for the select-all checkbox. */
	selectAllLabel?: string;
	/** aria-label for the row-actions column. */
	rowActionsLabel?: string;
	/** aria-label for the button acting on the whole selection. */
	bulkActionsLabel?: string;
	/** aria-label for the button opening the column-visibility menu, the keyboard's way to it: `onColumnsContextMenu` is otherwise a right-click. */
	columnsLabel?: string;
}

/**
 * V2 TableHead — v1 called `useContextMenu({ id: columnsMenuId })` directly
 * (react-contexify's global id registry lets any component reference a menu
 * by string). V2's `useContextMenu<T>()` controller has no such registry —
 * it's an object, not an id — so `Table` owns it and passes down a plain
 * `onColumnsContextMenu` callback instead.
 */
export const TableHead = <T,>({
	columns,
	activeSortKey,
	sortDirection,
	onSort,
	onColumnsContextMenu,
	hasContextMenuColumn = false,
	onGlobalContextMenu,
	selectable = false,
	allSelected = false,
	someSelected = false,
	onSelectAll,
	selectAllLabel,
	rowActionsLabel,
	bulkActionsLabel,
	columnsLabel,
}: ITableHeadProps<T>) => (
	// role="row" is a layout/grid semantic (this div's Ths are its real grid
	// cells, via display:contents) — right-click-to-open-a-menu is a mouse
	// affordance layered on top, not the row itself becoming a single
	// keyboard-focusable interactive control (individual Ths already are).
	// eslint-disable-next-line jsx-a11y/interactive-supports-focus
	<div
		role="row"
		aria-rowindex={1}
		style={{ display: "contents" }}
		onContextMenu={
			onColumnsContextMenu
				? (e) => {
						e.preventDefault();
						onColumnsContextMenu(e);
					}
				: undefined
		}
	>
		{selectable && (
			<Th
				key="select"
				className={styles.selectCell}
				aria-label={selectAllLabel}
			>
				<Checkbox
					aria-label={selectAllLabel}
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
					(hasContextMenuColumn || onGlobalContextMenu) && (
						<Th
							key="contextMenu"
							className={styles.contextMenuCell}
						>
							<span className={styles.srOnly}>
								{rowActionsLabel}
							</span>
							{onGlobalContextMenu &&
							(someSelected || allSelected) ? (
								<button
									type="button"
									className={styles.contextMenuButton}
									aria-label={bulkActionsLabel}
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

		{/* Absorbs Table's trailing "1fr" filler grid track, not a column as
		    far as assistive tech is concerned. Visually hidden until focused,
		    the button leaves the design alone. */}
		{onColumnsContextMenu ? (
			<Th aria-label={columnsLabel}>
				<button
					type="button"
					className={styles.columnsButton}
					aria-label={columnsLabel}
					aria-haspopup="menu"
					onClick={onColumnsContextMenu}
				>
					<Picto icon="more" />
				</button>
			</Th>
		) : (
			<Th aria-hidden />
		)}
	</div>
);
