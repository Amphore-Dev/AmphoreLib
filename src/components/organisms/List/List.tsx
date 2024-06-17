import React from "react";

import { t } from "i18next";

import { Picto, Popover, PaginationV2 } from "@zolteam/react-ras-library";
import { ActionsList, ConfirmModal, ListHeader } from "components/molecules";
import { Table } from "components/molecules";


import { cn, scrollToTop } from "utils";
import { IListProps } from "@interfaces/list";

export const List: React.FC<IListProps> = ({
	children,
	columns,
	selectable = true,
	className,
	header,
	footer,
	tableHeader,
	items = [],
	paginated,
	onPageChange,
	rowProps,
	scrollParentSelector = "#AdminLayout",
	useListHook,
	itemIdKey = "id",
	sortableHeader = false,
	...props
}) => {
	const [ShowPageChangeConfirm, setShowPageChangeConfirm] = React.useState<
		Number | undefined
	>(undefined);

	const pagination = props.pagination ?? useListHook?.Pagination;
	const isPaginated = pagination && paginated !== false;
	const canSelect = selectable !== false;

	const getPaginatedItems = () => {
		if (!pagination || !isPaginated) return items;
		if (items?.length <= pagination.pageSize) return items;
		const { currentPage, pageSize } = pagination;
		const start = (currentPage - 1) * pageSize;
		const end = start + pageSize;
		return items?.slice ? items?.slice(start, end) : items;
	};

	const displayedItems = getPaginatedItems();

	const handleSelect = (selected: any[], state: boolean) => {
		if (props.onSelected) return props.onSelected(selected, state);
		if (useListHook) {
			const { Selected, setSelected } = useListHook;
			if (selected?.length > 1) return setSelected(state ? selected : []);
			if (state) return setSelected([...Selected, ...selected]);
			setSelected(
				Selected.filter(
					(item: any) =>
						!selected.find((i) => i[itemIdKey] === item[itemIdKey])
				)
			);
		}
	};

	const handlePageChange = (page: number) => {
		if (
			pagination &&
			props.preventPageChange !== false &&
			props.selected?.length &&
			!ShowPageChangeConfirm
		)
			return setShowPageChangeConfirm(page);
		if (onPageChange) {
			onPageChange(page);
		} else if (useListHook) useListHook.handlePageChange(page);
		handleSelect(props.selected ?? useListHook?.Selected ?? [], false);
		// the timeout is needed to wait for the page to be rendered after the state change
		setTimeout(() => {
			scrollParentSelector && scrollToTop(scrollParentSelector);
		}, 0);
	};

	const genItemActions = (item: any) => {
		if (!props.itemActions) return;

		const actions =
			typeof props.itemActions === "function"
				? props.itemActions(item)
				: props.itemActions;

		return (
			<td
				className={cn([
					canSelect ? "pl-3" : "pl-6",
					"pr-3 ml-auto w-10",
				])}
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				{!!actions?.length && (
					<Popover
						clickInside
						placement="bottom-end"
						animation="perspective"
						offset={[25, -25]}
						content={<ActionsList actions={actions} item={item} />}
					>
						<button
							type="button"
							className="px-1 text-neutral-700 dark:text-neutral-300"
						>
							<Picto icon="more" />
						</button>
					</Popover>
				)}
			</td>
		);
	};

	const isSelected = (item: any) => {
		if (props.isSelected) return props.isSelected(item);
		if (useListHook) {
			const { Selected } = useListHook;
			return Selected.find((s) => s[itemIdKey] === item[itemIdKey])
				? true
				: false;
		}
		if (props.selected) return props.selected.includes(item);
		return false;
	};

	const handleFilterChange = (option: any) => {
		if (props.handleFilter) return props.handleFilter(option);
		if (useListHook) useListHook.changeFilters({ sortType: option?.value });
	};

	return (
		<div className={cn(["w-full", className])}>
			{!!props.filters && (
				<div className="px-4 pb-8 pr-0 sm:px-8 pt">{props.filters}</div>
			)}
			{header !== false && (
				<ListHeader
					disabled={header === "disabled"}
					selectable={selectable}
					columns={columns}
					items={items}
					onSelected={handleSelect}
					selected={props.selected ?? useListHook?.Selected ?? []}
					{...props}
					sortBy={props.sortBy ?? useListHook?.Filters?.sortType}
					handleFilter={handleFilterChange}
				/>
			)}
			<div className={cn(["w-full overflow-auto", props.tableClassName])}>
				{children ? (
					<div className="first:border-none ">
						{displayedItems?.map((item, key) => {
							const ChildComponent = children as any;
							return (
								<div
									key={item.id ?? key}
									className="flex items-center px-8 py-6 bg-white border-b dark:bg-black border-neutral-150 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700"
								>
									<ChildComponent {...item} />
								</div>
							);
						})}
					</div>
				) : (
					<Table
						columns={columns ?? []}
						className={cn([
							"w-full max-w-full table-auto whitespace-nowrap",
							items?.length && "min-w-[1000px]",
						])}
						selectable
						selected={props.selected}
						header={
							tableHeader
								? tableHeader
								: tableHeader === false
								? false
								: {
										before: (
											<>
												{selectable && <th />}
												{props.itemActions && <th />}
											</>
										),
								  }
						}
						rowProps={{ ...rowProps, items: displayedItems }}
						row={{
							before: (item) => {
								const isSelectable =
									typeof selectable === "function"
										? selectable(item)
										: selectable;
								const isItemSelected =
									isSelectable && isSelected(item);

								const isDisabled = isSelectable
									? typeof props.isSelectionDisabled ===
									  "function"
										? props.isSelectionDisabled?.(item)
										: props.isSelectionDisabled ?? false
									: true;

								return (
									<>
										{canSelect && (
											<td className="w-10 pl-8 pr-3">
												<input
													disabled={isDisabled}
													type="checkbox"
													checked={isItemSelected}
													onClick={(e) => {
														e.stopPropagation();
													}}
													onChange={(e) =>
														handleSelect(
															[item],
															e.target.checked
														)
													}
												/>
											</td>
										)}
										{genItemActions(item)}
									</>
								);
							},
						}}
						items={displayedItems}
						onRowClick={props.onItemClick}
						onColumnClick={
							sortableHeader && props.onColumnClick
								? props.onColumnClick
								: undefined
						}
						sortableHeader={sortableHeader}
						sortOptions={props.sortOptions}
					/>
				)}
			</div>
			{footer}
			{!!pagination && !!items?.length && (
				<>
					<div className="flex justify-center w-full py-4">
						<PaginationV2
							previousLabel={<Picto icon="chevronLeft" />}
							nextLabel={<Picto icon="chevronRight" />}
							breakLine="..."
							currentPage={pagination.currentPage}
							totalCount={
								pagination.totalCount || items?.length || 0
							}
							pageSize={pagination.pageSize}
							onPageChange={handlePageChange}
						/>
					</div>
					<ConfirmModal
						size="s"
						title={t("global.warning")}
						isOpen={ShowPageChangeConfirm !== undefined}
						onClose={() => {
							setShowPageChangeConfirm(undefined);
						}}
						text={t("global.pageChangeSelectionConfirm")}
						onConfirm={() => {
							handlePageChange(ShowPageChangeConfirm as number);
						}}
						onCancel={() => {
							setShowPageChangeConfirm(undefined);
						}}
					/>
				</>
			)}
		</div>
	);
};
