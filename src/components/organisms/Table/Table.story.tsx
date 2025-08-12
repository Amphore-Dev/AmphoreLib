import React, { Children, useMemo, useState } from "react";

import { StoryFn, StoryObj } from "@storybook/react";

import { TSortDirection, TTableColumn } from "@interfaces/TTable";

import { ITableProps, Table } from "./Table";
import { genUsersDataSet } from "./TableStoryUtils";

export default {
	title: "Components/Organisms/Table",
	component: Table,
	args: {
		onRowClick: undefined,
	},
};

type TStoryExempleItem = {
	id: number;
	name: string;
	age: number;
	country: string;
	city: string;
	occupation: string;
	isNew?: boolean;
	phone?: string;
	email?: string;
	isOut?: boolean;
};

type TTableStory = StoryObj<ITableProps<TStoryExempleItem>>;

const COLUMNS: TTableColumn<TStoryExempleItem>[] = [
	{
		selectable: (item) => !item.isOut,
		value: "select",
		name: "select",
	},
	{
		value: "actions",
		name: "actions",
		itemActions: [
			{
				label: "View Details",
				icon: "info",
				onClick: (item) => alert(`Details for ${item.name}`),
				disabled: (item) => !!item.isOut,
			},
			{
				label: "Edit",
				icon: "edit",
				onClick: (item) => alert(`Edit clicked for ${item.name}`),
				hidden: (item) => !!item.isOut,
			},
			{
				label: "Delete",
				icon: "delete",
				onClick: (item) => alert(`Delete clicked for ${item.name}`),
				hidden: (item) => !!item.isOut,
			},
		],
	},
	{
		title: "Name",
		value: "name",
		name: "name",
		description: (item) =>
			item.isOut ? "This user is out of the office" : undefined,
		sortable: true,
		className: (item) => (item.isOut ? "text-red-500" : "text-neutral-900"),
		badge: (item) => {
			if (item.isNew) {
				return "New";
			}
			if (item.isOut) {
				return {
					label: "Out",
					color: "warning",
				};
			}
			return undefined;
		},
		size: 6,
	},
	{
		value: "button",
		name: "click-button",
		clickable: (item) => !item.isOut,
		button: {
			children: "View",
			onClick: (item) => alert("Button clicked for " + item.name),
			size: "s",
		},
	},
	{
		title: "Contact",
		name: "contact",
		value: (item) => item.phone || item.email,
		picto: (item) =>
			item.phone || item.email
				? item.phone
					? "phoneOutgoing"
					: "mail"
				: undefined,
		className: "text-primary-500 max-w-[150px]",
		clickable: (item) => !!item.phone || !!item.email,
		onClick: (item) => {
			const link = item.phone
				? `tel:${item.phone}`
				: `mailto:${item.email}`;
			const a = document.createElement("a");
			a.href = link;
			a.click();
			a.remove();
		},
	},
	{
		title: "Age",
		name: "age",
		value: "age",
		sortable: true,
	},
	{
		title: "Country",
		name: "country",
		value: "country",
		sortable: true,
	},
	{
		title: "City",
		name: "city",
		value: "city",
		sortable: true,
	},
	{
		title: "Occupation",
		name: "occupation",
		value: "occupation",
		sortable: true,
	},
	{
		title: "HoverMe",
		name: "hover-me",
		value: "hover me",
		showOnHover: true,
		button: {
			children: "Hover me",
			size: "s",
			onClick: (item) => alert(`Hover button clicked for ${item.name}`),
		},
	},
];

const ITEMS: TStoryExempleItem[] = genUsersDataSet(100);

const Template: StoryFn<ITableProps<TStoryExempleItem>> = (args) => {
	const [Sort, setSort] = useState<{
		sortKey: keyof TStoryExempleItem;
		sortDirection: TSortDirection;
	}>({
		sortKey: "name",
		sortDirection: "asc",
	});

	const sortedItems = useMemo(() => {
		return [...ITEMS].sort((a, b) => {
			if (a[Sort.sortKey] === b[Sort.sortKey]) {
				return 0;
			}
			const aValue = a[Sort.sortKey] || "";
			const bValue = b[Sort.sortKey] || "";

			if (aValue < bValue) {
				return Sort.sortDirection === "asc" ? -1 : 1;
			}
			if (aValue > bValue) {
				return Sort.sortDirection === "asc" ? 1 : -1;
			}
			return 0;
		});
	}, [Sort]);

	return (
		<div className="w-full h-[500px] relative overflow-hidden">
			<Table
				items={sortedItems}
				{...args}
				onSort={(key, direction) => {
					setSort({
						sortKey: key as keyof TStoryExempleItem,
						sortDirection: direction,
					});
				}}
				onSelect={(selectedItems) => {
					console.warn("PROP Selected items:", selectedItems);
				}}
				columns={args.columns ?? COLUMNS}
				getItemKey={(item) => item.id}
			/>
		</div>
	);
};

export const Default: TTableStory = Template.bind({});

export const WithRowClick = Template.bind({});
WithRowClick.args = {
	onRowClick: (item) => {
		alert(`Row clicked: ${JSON.stringify(item)}`);
	},
	items: genUsersDataSet(10),
};

export const Loading = Template.bind({});
Loading.args = {
	isLoading: true,
	loadingMessage: "Chargement des utilisateurs...",
	noDataMessage: "No data available",
	items: [],
};

export const NoData = Template.bind({});
NoData.args = {
	isLoading: false,
	noDataMessage: "No data available",
	items: [],
};

export const TwoColumns = Template.bind({});
TwoColumns.args = {
	columns: [
		{
			title: "Name",
			value: "name",
			name: "name",
			sortable: true,
		},
		{
			title: "Age",
			value: "age",
			name: "age",
			sortable: true,
		},
	],
	items: genUsersDataSet(10),
	onRowClick: (item) => {
		alert(`Row clicked: ${JSON.stringify(item)}`);
	},
};

export const LoadMore = (args: ITableProps<TStoryExempleItem>) => {
	const [items, setItems] = useState<TStoryExempleItem[]>(
		genUsersDataSet(20)
	);
	const [hasMore, setHasMore] = useState(true);

	const handleLoadMore = () => {
		console.debug("Load more items triggered");
		if (items.length >= 100) {
			setHasMore(false);
			return;
		}
		const newItems = genUsersDataSet(20);
		setItems((prev) => [...prev, ...newItems]);
	};

	return (
		<div className="w-full h-[500px] relative overflow-hidden">
			<Table
				{...args}
				items={items}
				hasMore={hasMore}
				onLoadMore={handleLoadMore}
				onRowClick={(item) => {
					alert(`Row clicked: ${JSON.stringify(item)}`);
				}}
			/>
		</div>
	);
};
LoadMore.args = {
	columns: COLUMNS,
	isLoading: false,
	loadingMessage: "Loading more items...",
	noDataMessage: "No data available",
	endOfListMessage: "End of list",
	cellSpacing: "0.5rem",
};

export const LoadMoreWithBiggerContainer = (
	args: ITableProps<TStoryExempleItem>
) => {
	const [items, setItems] = useState<TStoryExempleItem[]>(genUsersDataSet(5));
	const [hasMore, setHasMore] = useState(true);

	const handleLoadMore = () => {
		console.debug("Load more items triggered");
		if (items.length >= 100) {
			setHasMore(false);
			return;
		}
		const newItems = genUsersDataSet(20);
		setItems((prev) => [...prev, ...newItems]);
	};

	return (
		<div className="w-full h-[600px] relative overflow-hidden">
			<Table
				{...args}
				items={items}
				hasMore={hasMore}
				onLoadMore={handleLoadMore}
				onRowClick={(item) => {
					alert(`Row clicked: ${JSON.stringify(item)}`);
				}}
			/>
		</div>
	);
};

LoadMoreWithBiggerContainer.args = {
	columns: COLUMNS,
	isLoading: false,
	loadingMessage: "Loading more items...",
	noDataMessage: "No data available",
	endOfListMessage: "End of list",
	cellSpacing: "0.5rem",
};

export const GlobalHeaderClassName = Template.bind({});
GlobalHeaderClassName.args = {
	columns: COLUMNS.map((col) => ({
		...col,
		headerClassName: col.name === "name" ? "text-blue-500" : undefined,
	})),
	headerClassName:
		"text-red-500 text-lg bg-neutral-100 !font-[1000] border-2 border-red-500",
};

GlobalHeaderClassName.storyName =
	"Global headerClassName and Column headerClassName Override";

export const DynamicItemActions = Template.bind({});
DynamicItemActions.args = {
	columns: [
		{
			title: "Gen ItemActions With function",
			name: "custom-item-actions",
			description: "All actions generated from a function",
			itemActions: (item) =>
				!item.isOut && [
					{
						label: "View Details",
						icon: "info",
						onClick: (item) => alert(`Details for ${item.name}`),
						disabled: item.isOut,
					},
				],
		},
		{
			title: "Dynamic Item Actions with disabled and hidden props",
			name: "custom-item-actions",
			description: "actions displayed or hidden based on item state",
			itemActions: [
				{
					label: "View Details",
					icon: "info",
					onClick: (item) => alert(`Details for ${item.name}`),
					disabled: (item) => !!item.isOut,
				},
				{
					label: "Edit",
					icon: "edit",
					onClick: (item) => alert(`Edit clicked for ${item.name}`),
					hidden: (item) => !!item.isOut,
				},
				{
					label: "Delete",
					icon: "delete",
					onClick: (item) => alert(`Delete clicked for ${item.name}`),
					hidden: (item) => !!item.isOut,
				},
			],
		},
		{
			title: "Name",
			value: "name",
			name: "name",
			description: (item) =>
				item.isOut ? "This user is out of the office" : undefined,
			sortable: true,
			badge: (item) => {
				if (item.isNew) {
					return "New";
				}
				if (item.isOut) {
					return {
						label: "Out",
						color: "warning",
					};
				}
				return undefined;
			},
			size: 6,
		},
	],
};

export const EqualizeRowsHeight = (args: ITableProps<TStoryExempleItem>) => {
	const genUsers = (count: number, startIndex: number) => {
		return Array.from({ length: count }, (_, i) => {
			const id = startIndex + i + 1;

			const isOut = id > 20 ? Math.random() < 0.3 : false;

			return {
				id,
				name: `User ${id}`,
				age: 20 + (id % 30),
				country: ["France", "Germany", "Spain", "Italy", "Netherlands"][
					id % 5
				],
				city: ["Paris", "Berlin", "Madrid", "Rome", "Amsterdam"][
					id % 5
				],
				occupation: [
					"Engineer",
					"Designer",
					"Teacher",
					"Developer",
					"Doctor",
				][id % 5],
				isNew: id % 2 === 0,
				email: `user${id}@example.com`,
				phone: `+33 6 ${String(id).padStart(2, "0")} 00 00 00`,
				isOut,
			};
		});
	};

	const [items, setItems] = useState<TStoryExempleItem[]>(genUsers(20, 0));
	const [hasMore, setHasMore] = useState(true);

	const handleLoadMore = () => {
		if (items.length >= 100) {
			setHasMore(false);
			return;
		}

		const newItems = genUsers(20, items.length);
		setItems((prev) => [...prev, ...newItems]);
	};

	return (
		<div className="w-full h-[600px] relative overflow-hidden">
			<Table
				{...args}
				items={items}
				hasMore={hasMore}
				onLoadMore={handleLoadMore}
				onRowClick={(item) => {
					alert(`Row clicked: ${JSON.stringify(item)}`);
				}}
			/>
		</div>
	);
};

EqualizeRowsHeight.args = {
	columns: [
		{
			title: "Column",
			render: ({ item }) => {
				return item.isOut ? (
					<div className="flex flex-col">
						<span>{item.name}</span>
						<span className="text-sm text-gray-500">
							{item.email}
						</span>
					</div>
				) : (
					<div>{item.name}</div>
				);
			},
		},
	],
	equalizeRowsHeight: true,
};

export const TruncatedValue = (args: ITableProps<TStoryExempleItem>) => {
	return (
		<Table
			{...args}
			items={ITEMS}
			onRowClick={(item) => {
				alert(`Row clicked: ${JSON.stringify(item)}`);
			}}
		/>
	);
};

TruncatedValue.args = {
	columns: [
		{
			title: "Name",
			value: "name",
			className: "!w-[100px]",
		},
	],
};
