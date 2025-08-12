import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

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
	cellSpacing?: "1rem" | "0.5rem" | "0.25rem" | "0";
	canClickToLoadMore?: boolean;
	itemsActionsStrategy?: UseFloatingOptions["strategy"];
	equalizeRowsHeight?: boolean;
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
	cellSpacing = "1rem",
	headerClassName,
	canClickToLoadMore = false,
	itemsActionsStrategy,
	equalizeRowsHeight = false,
}: ITableProps<T>) => {
	const [sortDirection, setSortDirection] = useState<TSortDirection>();
	const [sortKey, setSortKey] = useState("");
	const containerRef = useRef<HTMLDivElement>(null);
	const [SelectedItems, setSelectedItems] = useState<T[]>([]);

	const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
	const [maxRowHeight, setMaxRowHeight] = useState<number | undefined>(
		undefined
	);

	const getItemId = (item: T) => {
		if (getItemKey) {
			return getItemKey(item);
		}
		return item["id" as keyof T] as string | number;
	};

	const handleSelect = useCallback(
		(item: T) => {
			if (onSelect) {
				setSelectedItems((prevSelectedItems) => {
					let newSelectedItems = [...prevSelectedItems];

					const isAlreadySelected = newSelectedItems.some(
						(selectedItem) =>
							getItemId(selectedItem) === getItemId(item)
					);

					if (isAlreadySelected) {
						newSelectedItems = newSelectedItems.filter(
							(selectedItem) =>
								getItemId(selectedItem) !== getItemId(item)
						);
					} else {
						newSelectedItems.push(item);
					}

					onSelect(newSelectedItems, item);
					return newSelectedItems;
				});
			}
		},
		[onSelect, getItemKey]
	);

	const handleMultipleSelect = useCallback(
		(items: T[]) => {
			setSelectedItems(items);
			if (onSelect) {
				onSelect(items, items[0]);
			}
		},
		[onSelect]
	);

	useEffect(() => {
		const container = containerRef.current;
		if (!onLoadMore || !container) return;

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = container;
			const threshold = 1 - loadMoreThreshold;

			// Scroll visible bottom
			const scrollBottom = scrollTop + clientHeight;
			const triggerPoint = scrollHeight - clientHeight * threshold;

			if (scrollBottom >= triggerPoint && hasMore && !isLoading) {
				onLoadMore();
			}
		};

		container.addEventListener("scroll", handleScroll);
		return () => container.removeEventListener("scroll", handleScroll);
	}, [onLoadMore, loadMoreThreshold, isLoading, hasMore]);

	useEffect(() => {
		if (onSelect) {
			setSelectedItems(selected || []);
		}
	}, [selected, onSelect]);

	useEffect(() => {
		if (!equalizeRowsHeight) return;

		const rowsHeights = rowRefs.current.map(
			(ref) => ref?.offsetHeight || 0
		);

		if (!rowsHeights.length) return;

		const tallestHeight = Math.max(...rowsHeights);
		setMaxRowHeight(tallestHeight);
	}, [items, equalizeRowsHeight]);

	const columnsWithResolvedSize = useMemo(() => columns, [columns]);

	return (
		<div ref={containerRef} data-ras-table>
			<table>
				<TableHeader
					columns={columnsWithResolvedSize}
					sortKey={sortKey}
					sortDirection={sortDirection}
					onSort={(key: string, direction: TSortDirection) => {
						setSortKey(key);
						setSortDirection(direction);
						onSort?.(key, direction);
					}}
					items={items}
					cellsClassName={headerClassName}
					onSelect={handleMultipleSelect}
					selectedItems={SelectedItems}
					getItemId={getItemId}
				/>
				<tbody>
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

						const isSelected = !!SelectedItems?.find(
							(selectedItem) => {
								if (getItemKey) {
									return getItemKey(selectedItem) === key;
								}
							}
						);
						return (
							<TableRow
								ref={(el) => (rowRefs.current[index] = el)}
								key={key}
								item={item}
								columns={columnsWithResolvedSize}
								onClick={isClickable ? onRowClick : undefined}
								isClickable={isClickable}
								isDisabled={isDisabled}
								className={
									typeof rowClassName === "function"
										? cn([rowClassName(item)])
										: (rowClassName as string)
								}
								selected={isSelected}
								onSelect={(item: T) => handleSelect(item)}
								cellSpacing={cellSpacing}
								itemsActionsStrategy={itemsActionsStrategy}
								style={
									equalizeRowsHeight && maxRowHeight
										? { height: maxRowHeight }
										: undefined
								}
							/>
						);
					})}

					<tr>
						<td colSpan={columns.length} className="footer">
							{!isLoading &&
								!hasMore &&
								!items?.length &&
								noDataMessage}
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
							{!hasMore &&
								!isLoading &&
								!!items?.length &&
								endOfListMessage}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};
