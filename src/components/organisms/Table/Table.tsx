import React, { useCallback, useEffect, useRef, useState } from "react";

import { UseFloatingOptions } from "@floating-ui/react";

import { TSortDirection, TTableColumn } from "@interfaces/TTable";

import { Spinner } from "@components/atoms";
import { TableHeader, TableRow } from "@components/molecules";

import { cn } from "@utils/cn";

import "./Table.scss";

export interface ITableProps<T = unknown> {
	columns: TTableColumn<T>[];
	items?: T[];
	isRowDisabled?: (item: T) => boolean;
	headerClassName?: string;
	rowClassName?: string | ((item: T) => string | undefined | false);
	onRowClick?: (item: T) => void;
	isRowClickable?: (item: T) => boolean;
	onSort?: (key: string, direction: TSortDirection) => void;
	getItemKey?: (item: T) => string | number;
	onLoadMore?: () => void;
	loadMoreThreshold?: number;
	isLoading?: boolean;
	loadingMessage?: React.ReactNode;
	noDataMessage?: React.ReactNode;
	endOfListMessage?: React.ReactNode;
	clickToLoadMoreMessage?: string;
	hasMore?: boolean;
	onSelect?: (items: T[], item: T) => void;
	selected?: T[];
	canClickToLoadMore?: boolean;
	itemsActionsStrategy?: UseFloatingOptions["strategy"];
}

export const Table = <T,>({
	columns = [],
	items = [],
	onRowClick,
	isRowClickable,
	isRowDisabled,
	rowClassName,
	onSort,
	onLoadMore,
	loadMoreThreshold = 0.8,
	isLoading = false,
	loadingMessage = "Loading...",
	noDataMessage = "No data available",
	endOfListMessage = "End of list",
	clickToLoadMoreMessage = "Click to load more",
	hasMore = false,
	getItemKey,
	onSelect,
	selected,
	headerClassName,
	canClickToLoadMore = false,
	itemsActionsStrategy,
}: ITableProps<T>) => {
	const [sortDirection, setSortDirection] = useState<TSortDirection>();
	const [sortKey, setSortKey] = useState("");
	const containerRef = useRef<HTMLDivElement>(null);
	const [selectedItems, setSelectedItems] = useState<T[]>([]);

	const getItemId = (item: T): string | number =>
		getItemKey
			? getItemKey(item)
			: (item["id" as keyof T] as string | number);

	const handleSelect = useCallback(
		(item: T) => {
			if (!onSelect) return;
			setSelectedItems((prev) => {
				const id = getItemId(item);
				const exists = prev.some((s) => getItemId(s) === id);
				const next = exists
					? prev.filter((s) => getItemId(s) !== id)
					: [...prev, item];
				onSelect(next, item);
				return next;
			});
		},
		[onSelect, getItemKey]
	);

	const handleMultipleSelect = useCallback(
		(items: T[]) => {
			setSelectedItems(items);
			onSelect?.(items, items[0]);
		},
		[onSelect]
	);

	useEffect(() => {
		const container = containerRef.current;
		if (!onLoadMore || !container) return;

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = container;
			const triggerPoint =
				scrollHeight - clientHeight * (1 - loadMoreThreshold);
			if (
				scrollTop + clientHeight >= triggerPoint &&
				hasMore &&
				!isLoading
			) {
				onLoadMore();
			}
		};

		container.addEventListener("scroll", handleScroll);
		return () => container.removeEventListener("scroll", handleScroll);
	}, [onLoadMore, loadMoreThreshold, isLoading, hasMore]);

	useEffect(() => {
		if (onSelect) setSelectedItems(selected ?? []);
	}, [selected, onSelect]);

	const gridTemplateColumns = [
		...columns.map((col) => col.width ?? "auto"),
		"1fr",
	].join(" ");

	return (
		<div
			ref={containerRef}
			data-ras-table
			role="grid"
			style={{ gridTemplateColumns }}
		>
			<TableHeader
				columns={columns}
				sortKey={sortKey}
				sortDirection={sortDirection}
				onSort={(key, direction) => {
					setSortKey(key);
					setSortDirection(direction);
					onSort?.(key, direction);
				}}
				items={items}
				cellsClassName={headerClassName}
				onSelect={handleMultipleSelect}
				selectedItems={selectedItems}
				getItemId={getItemId}
			/>
			{items.map((item, index) => {
				const key = getItemKey ? getItemKey(item) : index;
				const isClickable =
					typeof isRowClickable === "function"
						? isRowClickable(item)
						: !!onRowClick;
				const isDisabled =
					typeof isRowDisabled === "function"
						? isRowDisabled(item)
						: false;
				const isSelected = selectedItems.some(
					(s) => getItemId(s) === getItemId(item)
				);

				return (
					<TableRow
						key={key}
						item={item}
						columns={columns}
						onClick={isClickable ? onRowClick : undefined}
						isClickable={isClickable}
						isDisabled={isDisabled}
						className={
							typeof rowClassName === "function"
								? cn([rowClassName(item)])
								: (rowClassName as string)
						}
						selected={isSelected}
						onSelect={handleSelect}
						itemsActionsStrategy={itemsActionsStrategy}
					/>
				);
			})}
			<div data-ras-table-footer>
				{!isLoading && !hasMore && !items?.length && noDataMessage}
				{!isLoading && canClickToLoadMore && hasMore && (
					<button
						className="load-more"
						onClick={onLoadMore}
						disabled={!hasMore}
					>
						{clickToLoadMoreMessage}
					</button>
				)}
				{isLoading && <Spinner text={loadingMessage} />}
				{!hasMore && !isLoading && !!items?.length && endOfListMessage}
			</div>
		</div>
	);
};
