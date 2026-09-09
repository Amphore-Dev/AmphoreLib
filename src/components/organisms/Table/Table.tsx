import React, { useEffect, useMemo, useRef, useState } from "react";

import { useVirtualizer } from "@tanstack/react-virtual";

import { TSortDirection, TTableColumn, TTableItemAction } from "@interfaces/TTable";

import { Spinner } from "@components/atoms";
import { ContextMenu } from "@components/molecules/ContextMenu/ContextMenu";
import { TableHead } from "@components/molecules/TableHead/TableHead";
import { TableHeadContextMenu } from "@components/molecules/TableHead/TableHeadContextMenu";
import { TableRow } from "@components/molecules/TableRow/TableRow";

import { useRowActionsMenu } from "@hooks/useRowActionsMenu";

import { cn } from "@utils/cn";

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
	noDataMessage?: React.ReactNode;
	className?: string;
	rowClassName?: string | ((item: T) => string);
	selectable?: boolean;
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
	tableId?: string;
	onLoadMore?: () => void;
	hasMore?: boolean;
	loadMoreThreshold?: number;
	/**
	 * Whether clicking anywhere on the row (not just the checkbox) also
	 * selects it. Defaults to false: only the checkbox selects. Ignored when
	 * `onRowClick` is set — a row click then always navigates/fires
	 * `onRowClick`, selection stays checkbox-only in that case.
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

function defaultCompare<T>(a: T, b: T, key: keyof T & string): number {
	const va = a[key];
	const vb = b[key];
	if (va == null && vb == null) return 0;
	if (va == null) return 1;
	if (vb == null) return -1;
	if (typeof va === "number" && typeof vb === "number") return va - vb;
	return String(va).localeCompare(String(vb));
}

export const Table = <T,>({
	columns: _columns,
	items,
	getItemKey,
	onRowClick,
	onRowContextMenu,
	onGlobalContextMenu,
	rowActions,
	onSort,
	onSelectionChange,
	rowHeight = 36,
	noDataMessage = "No data available",
	className,
	rowClassName,
	selectable: _selectable,
	selectedKeys: controlledSelectedKeys,
	setSelectedKeys: setControlledSelectedKeys,
	onColumnVisibilityChange,
	initialVisibleColumns,
	isLoading,
	tableId = "al__table",
	onLoadMore,
	hasMore = false,
	loadMoreThreshold = 4,
	selectOnClick = false,
	selectionMode = "toggle",
}: ITableProps<T>) => {
	const columns = useMemo(() => {
		if (
			!rowActions?.length ||
			_columns.some((col) => col.key === "contextMenu")
		) {
			return _columns;
		}
		return [
			..._columns,
			{ key: "contextMenu", disableHiding: true } as TTableColumn<T>,
		];
	}, [_columns, rowActions]);

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

	const selectable = _selectable || setControlledSelectedKeys !== undefined;

	const rowActionsMenuId = `${tableId}-row-actions`;
	const columnsMenuId = `${tableId}-columns`;
	const { items: rowActionItems, showFor: showRowActions } =
		useRowActionsMenu<T>(rowActionsMenuId, rowActions);

	const hasContextMenu = !!rowActions?.length || !!onRowContextMenu;
	const handleRowContextMenu =
		hasContextMenu || onGlobalContextMenu
			? (item: T, event: React.MouseEvent) => {
					if (rowActions?.length) {
						showRowActions(item, event);
						return;
					}
					onRowContextMenu?.(item, event);
				}
			: undefined;

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
		// Every click — shift or not — becomes the anchor for the *next*
		// click, so a click-then-shift-click-then-shift-click chain keeps
		// extending/shrinking from the last row touched, not the first.
		const previousAnchor = anchorIndexRef.current;
		anchorIndexRef.current = index;

		if (event.shiftKey && previousAnchor >= 0) {
			const start = Math.min(previousAnchor, index);
			const end = Math.max(previousAnchor, index);
			setSelectedKeys((prev) => {
				// Adds the range to whatever was already selected — a
				// shift-click extends the existing selection, it doesn't
				// replace it.
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

	// eslint-disable-next-line react-hooks/incompatible-library
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
	}, [virtualItems, hasMore, isLoading, onLoadMore, loadMoreThreshold, sortedItems.length]);

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
		...(selectable ? ["2.5rem"] : []),
		...visibleColumns.map((col) => {
			const max = col.width ?? "max-content";
			return col.width
				? `max(${col.minWidth ?? "0px"}, ${max})`
				: `minmax(${col.minWidth ?? "150px"}, ${max})`;
		}),
		"1fr",
	].join(" ");

	const contextMenuColumns = columns.map((col) =>
		col.key === "contextMenu"
			? { ...col, width: "2rem", minWidth: "2rem", disableHiding: true }
			: { ...col, hidden: hiddenColumns.has(col.key) }
	);

	const allSelected =
		sortedItems.length > 0 && selectedKeys.size === sortedItems.length;
	const someSelected = selectedKeys.size > 0 && !allSelected;
	const hasMultipleSelected = selectedKeys.size > 1;

	const handleColumnToggle = (
		key: TTableColumn<T>["key"] & (string | number | symbol)
	) => {
		setHiddenColumns((prev) => {
			const next = new Set(prev);
			if (next.has(key)) next.delete(key);
			else next.add(key);
			onColumnVisibilityChange?.(key, !next.has(key));
			return next;
		});
	};

	return (
		<div
			ref={containerRef}
			role="grid"
			style={{ gridTemplateColumns }}
			className={cn(["al__table grid h-full w-full overflow-auto content-start", className])}
		>
			<TableHead
				columns={visibleColumns}
				activeSortKey={activeSortKey}
				sortDirection={sortDirection}
				onSort={handleSort}
				columnsMenuId={columnsMenuId}
				onContextMenu={handleRowContextMenu}
				onGlobalContextMenu={
					onGlobalContextMenu
						? (event) => onGlobalContextMenu(selectedKeys, event)
						: undefined
				}
				selectable={selectable}
				allSelected={allSelected}
				someSelected={someSelected}
				onSelectAll={toggleSelectAll}
			/>
			<TableHeadContextMenu
				id={columnsMenuId}
				columns={contextMenuColumns}
				key={gridTemplateColumns}
				onClick={handleColumnToggle}
			/>
			{!!rowActions?.length && (
				<ContextMenu id={rowActionsMenuId} items={rowActionItems} />
			)}
			{isLoading ? (
				<div className="col-span-full mt-4 flex justify-center">
					<Spinner />
				</div>
			) : sortedItems.length === 0 ? (
				<div
					style={{ gridColumn: "1 / -1" }}
					className="px-3 py-8 text-center text-sm text-neutral-400"
				>
					{noDataMessage}
				</div>
			) : (
				<>
					{paddingTop > 0 && (
						<div style={{ height: paddingTop, gridColumn: "1 / -1" }} />
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
										? (_item, _e) => onRowClick(item)
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
										? (_item, event, fromButton) => {
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
														item,
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
								selectable={selectable}
								isSelected={selectedKeys.has(key)}
								onToggleSelect={
									selectable
										? (e) =>
												handleSelect(
													vRow.index,
													key,
													e
												)
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
