import React, { useEffect, useMemo, useRef, useState } from "react";

import { useVirtualizer } from "@tanstack/react-virtual";

import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { cn } from "@utils/cn";

import {
	TLabel,
	TMenuItem,
	TSortDirection,
	TTableColumn,
	TTableItemAction,
} from "@interfaces/index";

import { Spinner } from "../../atoms/Spinner/Spinner";
import { ContextMenu } from "../../molecules/ContextMenu/ContextMenu";
import { useContextMenu } from "../../molecules/ContextMenu/useContextMenu";
import { TableHead } from "../../molecules/TableHead/TableHead";
import { TableRow } from "../../molecules/TableRow/TableRow";

import styles from "./Table.module.scss";

export interface ITableProps<T> {
	columns: TTableColumn<T>[];
	items: T[];
	getItemKey: (item: T) => string | number;
	onRowClick?: (item: T) => void;
	onRowContextMenu?: (item: T, event: React.MouseEvent) => void;
	onGlobalContextMenu?: (
		selectedKeys: Set<string | number>,
		event: React.MouseEvent
	) => void;
	rowActions?: TTableItemAction<T>[];
	onSort?: (key: keyof T & string, direction: TSortDirection) => void;
	onSelectionChange?: (keys: Set<string | number>) => void;
	rowHeight?: number;
	/** Content shown in place of rows when `items` is empty. Defaults to "No data" (or `Table.noDataMessage` from the nearest AmphoreProvider — see useAmphoreLabels). No commonKey — deliberately not shared with any other "no results"-style message elsewhere, even a similar-looking one. */
	noDataMessage?: TLabel;
	className?: string;
	rowClassName?: string | ((item: T) => string);
	selectable?: boolean;
	/** Renders the checkbox column when selectable. Set `false` for row-click-only selection with no visible checkbox — pair with `selectOnClick`, otherwise there's no way to select anything. Defaults to true. */
	showCheckbox?: boolean;
	selectedKeys?: Set<string | number>;
	setSelectedKeys?: React.Dispatch<
		React.SetStateAction<Set<string | number>>
	>;
	onColumnVisibilityChange?: (
		key: TTableColumn<T>["key"],
		visible: boolean
	) => void;
	initialVisibleColumns?: string[];
	isLoading?: boolean;
	onLoadMore?: () => void;
	hasMore?: boolean;
	loadMoreThreshold?: number;
	/**
	 * Whether clicking anywhere on the row (not just the checkbox) also
	 * selects it. Defaults to false: only the checkbox selects. Ignored when
	 * `onRowClick` is set — a row click then always fires `onRowClick`,
	 * selection stays checkbox-only in that case.
	 */
	selectOnClick?: boolean;
	/**
	 * Plain-click (no modifier) selection behavior:
	 * - "toggle" (default): adds/removes just this row, keeps the rest.
	 * - "exclusive": replaces the selection with just this row.
	 * Shift+click always range-selects from the last anchor; Ctrl/Cmd+click
	 * always toggles additively, regardless of this setting.
	 */
	selectionMode?: "toggle" | "exclusive";
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TTableLabels = Pick<ITableProps<object>, "noDataMessage">;

function defaultCompare<T>(a: T, b: T, key: keyof T & string): number {
	const va = a[key];
	const vb = b[key];
	if (va == null && vb == null) return 0;
	if (va == null) return 1;
	if (vb == null) return -1;
	if (typeof va === "number" && typeof vb === "number") return va - vb;
	return String(va).localeCompare(String(vb));
}

/**
 * V2 Table — CSS Grid (not a real `<table>`, see Td/Th) + virtualized rows
 * (`@tanstack/react-virtual`), ported from v1's. Context menus (row actions,
 * column visibility) rewired from react-contexify's global id registry to
 * this lib's own `useContextMenu<T>()` controller model: `Table` owns both
 * controllers directly and passes callbacks down, rather than components
 * three levels deep reaching a menu by string id.
 */
export const Table = <T,>({
	columns: columnsProp,
	items,
	getItemKey,
	onRowClick,
	onRowContextMenu,
	onGlobalContextMenu,
	rowActions,
	onSort,
	onSelectionChange,
	rowHeight = 36,
	noDataMessage: noDataMessageProp,
	className = "",
	rowClassName,
	selectable: selectableProp,
	showCheckbox: showCheckboxProp = true,
	selectedKeys: controlledSelectedKeys,
	setSelectedKeys: setControlledSelectedKeys,
	onColumnVisibilityChange,
	initialVisibleColumns,
	isLoading = false,
	onLoadMore,
	hasMore = false,
	loadMoreThreshold = 4,
	selectOnClick = false,
	selectionMode = "toggle",
}: ITableProps<T>) => {
	const { resolve } = useAmphoreLabels("Table");
	const noDataMessage = resolve("noDataMessage", noDataMessageProp);

	const columns = useMemo(() => {
		if (
			!rowActions?.length ||
			columnsProp.some((col) => col.key === "contextMenu")
		) {
			return columnsProp;
		}
		return [
			...columnsProp,
			{ key: "contextMenu", disableHiding: true } as TTableColumn<T>,
		];
	}, [columnsProp, rowActions]);

	const containerRef = useRef<HTMLDivElement>(null);
	const anchorIndexRef = useRef<number>(-1);
	const [activeSortKey, setActiveSortKey] = useState<keyof T & string>();
	const [sortDirection, setSortDirection] = useState<TSortDirection>("asc");
	const [internalSelectedKeys, internalSetSelectedKeys] = useState<
		Set<string | number>
	>(new Set());
	const [hiddenColumns, setHiddenColumns] = useState<
		Set<TTableColumn<T>["key"]>
	>(() =>
		initialVisibleColumns
			? new Set(
					columns
						.filter(
							(col) =>
								!initialVisibleColumns.includes(String(col.key))
						)
						.map((col) => col.key)
				)
			: new Set(columns.filter((col) => col.hidden).map((col) => col.key))
	);

	useEffect(() => {
		if (initialVisibleColumns) return;
		setHiddenColumns(
			new Set(columns.filter((col) => col.hidden).map((col) => col.key))
		);
	}, [columns, initialVisibleColumns]);

	const isControlled = controlledSelectedKeys !== undefined;
	const selectedKeys = isControlled
		? controlledSelectedKeys
		: internalSelectedKeys;
	const setSelectedKeys = isControlled
		? setControlledSelectedKeys!
		: internalSetSelectedKeys;

	const selectable =
		selectableProp || setControlledSelectedKeys !== undefined;
	const showCheckbox = selectable && showCheckboxProp;

	const rowActionsMenu = useContextMenu<T>();
	const columnsMenu = useContextMenu<void>();

	const hasContextMenu = !!rowActions?.length || !!onRowContextMenu;
	const handleRowContextMenu =
		hasContextMenu || onGlobalContextMenu
			? (item: T, event: React.MouseEvent) => {
					if (rowActions?.length) {
						rowActionsMenu.show(event, item);
						return;
					}
					onRowContextMenu?.(item, event);
				}
			: undefined;

	const rowActionItems = (item: T): TMenuItem[] =>
		(rowActions ?? []).map((action) => ({
			label: action.label,
			picto: action.picto,
			disabled:
				typeof action.disabled === "function"
					? action.disabled(item)
					: !!action.disabled,
			hidden:
				typeof action.hidden === "function"
					? action.hidden(item)
					: !!action.hidden,
			onClick: () => action.onClick(item),
		}));

	const handleSort = (key: keyof T & string) => {
		const next: TSortDirection =
			activeSortKey === key && sortDirection === "asc" ? "desc" : "asc";
		setActiveSortKey(key);
		setSortDirection(next);
		onSort?.(key, next);
	};

	const sortedItems = useMemo(() => {
		if (!activeSortKey || onSort) return items;
		const sorted = [...items].sort((a, b) =>
			defaultCompare(a, b, activeSortKey)
		);
		return sortDirection === "desc" ? sorted.reverse() : sorted;
	}, [items, activeSortKey, sortDirection, onSort]);

	const toggleSelect = (key: string | number, unique = false) => {
		setSelectedKeys((prev) => {
			const next = new Set(prev);
			if (unique) next.clear();
			if (next.has(key)) next.delete(key);
			else next.add(key);
			onSelectionChange?.(next);
			return next;
		});
	};

	/**
	 * Single entry point for both the row click (when selectOnClick) and the
	 * row checkbox, so shift-range and ctrl/cmd-toggle behave identically no
	 * matter which trigger fired.
	 */
	const handleSelect = (
		index: number,
		key: string | number,
		event: React.MouseEvent
	) => {
		const previousAnchor = anchorIndexRef.current;
		anchorIndexRef.current = index;

		if (event.shiftKey && previousAnchor >= 0) {
			const start = Math.min(previousAnchor, index);
			const end = Math.max(previousAnchor, index);
			setSelectedKeys((prev) => {
				const next = new Set(prev);
				sortedItems
					.slice(start, end + 1)
					.forEach((item) => next.add(getItemKey(item)));
				onSelectionChange?.(next);
				return next;
			});
			return;
		}

		if (event.ctrlKey || event.metaKey) {
			toggleSelect(key);
			return;
		}

		toggleSelect(key, selectionMode === "exclusive");
	};

	const toggleSelectAll = () => {
		setSelectedKeys((prev) => {
			const allKeys = sortedItems.map(getItemKey);
			const next =
				prev.size === allKeys.length
					? new Set<string | number>()
					: new Set<string | number>(allKeys);
			onSelectionChange?.(next);
			return next;
		});
	};

	const virtualizer = useVirtualizer({
		count: sortedItems.length,
		getScrollElement: () => containerRef.current,
		estimateSize: () => rowHeight,
		overscan: 10,
	});

	const virtualItems = virtualizer.getVirtualItems();
	const paddingTop = virtualItems[0]?.start ?? 0;
	const paddingBottom = virtualItems.length
		? virtualizer.getTotalSize() -
			(virtualItems[virtualItems.length - 1]?.end ?? 0)
		: 0;

	useEffect(() => {
		if (!onLoadMore || !hasMore || isLoading) return;
		const lastItem = virtualItems[virtualItems.length - 1];
		if (!lastItem) return;
		if (lastItem.index >= sortedItems.length - 1 - loadMoreThreshold) {
			onLoadMore();
		}
	}, [
		virtualItems,
		hasMore,
		isLoading,
		onLoadMore,
		loadMoreThreshold,
		sortedItems.length,
	]);

	const visibleColumns = useMemo(
		() =>
			columns
				.filter((col) => !hiddenColumns.has(col.key))
				.map((col) =>
					col.key === "contextMenu"
						? {
								...col,
								width: "2rem",
								minWidth: "2rem",
								disableHiding: true,
							}
						: col
				),
		[columns, hiddenColumns]
	);

	const gridTemplateColumns = [
		...(showCheckbox ? ["2.5rem"] : []),
		...visibleColumns.map((col) => {
			const max = col.width ?? "max-content";
			return col.width
				? `max(${col.minWidth ?? "0px"}, ${max})`
				: `minmax(${col.minWidth ?? "150px"}, ${max})`;
		}),
		"1fr",
	].join(" ");

	const handleColumnToggle = (key: TTableColumn<T>["key"]) => {
		setHiddenColumns((prev) => {
			const next = new Set(prev);
			if (next.has(key)) next.delete(key);
			else next.add(key);
			onColumnVisibilityChange?.(key, !next.has(key));
			return next;
		});
	};

	const columnsMenuItems: TMenuItem[] = columns
		.filter((col) => col.disableHiding !== true)
		.map((col) => ({
			label: col.label || col.key,
			picto: hiddenColumns.has(col.key) ? undefined : "check",
			onClick: () => handleColumnToggle(col.key),
		}));

	const allSelected =
		sortedItems.length > 0 && selectedKeys.size === sortedItems.length;
	const someSelected = selectedKeys.size > 0 && !allSelected;
	const hasMultipleSelected = selectedKeys.size > 1;

	return (
		<div
			ref={containerRef}
			role="grid"
			style={{ gridTemplateColumns }}
			className={cn([styles.table, className])}
		>
			<TableHead
				columns={visibleColumns}
				activeSortKey={activeSortKey}
				sortDirection={sortDirection}
				onSort={handleSort}
				onColumnsContextMenu={(e) => columnsMenu.show(e, undefined)}
				hasContextMenuColumn={!!handleRowContextMenu}
				onGlobalContextMenu={
					onGlobalContextMenu
						? (event) => onGlobalContextMenu(selectedKeys, event)
						: undefined
				}
				selectable={showCheckbox}
				allSelected={allSelected}
				someSelected={someSelected}
				onSelectAll={toggleSelectAll}
			/>

			<ContextMenu menu={columnsMenu} items={columnsMenuItems} />
			{!!rowActions?.length && (
				<ContextMenu menu={rowActionsMenu} items={rowActionItems} />
			)}

			{isLoading ? (
				<div className={styles.centerRow}>
					<Spinner />
				</div>
			) : sortedItems.length === 0 ? (
				<div className={styles.centerRow}>{noDataMessage}</div>
			) : (
				<>
					{paddingTop > 0 && (
						<div
							style={{ height: paddingTop, gridColumn: "1 / -1" }}
						/>
					)}
					{virtualItems.map((vRow) => {
						const item = sortedItems[vRow.index];
						const key = getItemKey(item);
						return (
							<TableRow
								key={key}
								rowKey={key}
								item={item}
								columns={visibleColumns}
								onClick={
									onRowClick
										? (i) => onRowClick(i)
										: selectable && selectOnClick
											? (_, e) =>
													handleSelect(
														vRow.index,
														key,
														e
													)
											: undefined
								}
								onContextMenu={
									hasMultipleSelected && onGlobalContextMenu
										? (i, event, fromButton) => {
												if (
													selectedKeys.has(key) &&
													!fromButton
												) {
													onGlobalContextMenu(
														selectedKeys,
														event
													);
												} else {
													handleRowContextMenu?.(
														i,
														event
													);
												}
											}
										: handleRowContextMenu
								}
								className={
									typeof rowClassName === "function"
										? rowClassName(item)
										: rowClassName
								}
								selectable={showCheckbox}
								isSelected={selectedKeys.has(key)}
								onToggleSelect={
									selectable
										? (e) =>
												handleSelect(vRow.index, key, e)
										: undefined
								}
							/>
						);
					})}
					{paddingBottom > 0 && (
						<div
							style={{
								height: paddingBottom,
								gridColumn: "1 / -1",
							}}
						/>
					)}
				</>
			)}
		</div>
	);
};
