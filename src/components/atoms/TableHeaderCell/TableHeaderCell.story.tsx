import React, { useEffect, useState } from "react";

import type { StoryFn, Meta, StoryObj } from "@storybook/react";

import { TableHeaderCell, ITableHeaderCellProps } from "./TableHeaderCell";

const Template: StoryFn<ITableHeaderCellProps> = (args) => {
	const [direction, setDirection] = useState(args.sortDirection || undefined);

	const handleSort = () => {
		if (!args.sortable) return;
		setDirection((prev) =>
			prev === "asc" ? "desc" : prev === "desc" ? "asc" : "asc"
		);
	};

	useEffect(() => {
		setDirection(args.sortDirection);
	}, [args.sortDirection]);

	return (
		<tr className="w-full">
			<TableHeaderCell
				{...args}
				sortDirection={direction}
				onSort={handleSort}
			/>
		</tr>
	);
};

const meta: Meta<ITableHeaderCellProps> = {
	title: "Components/Atoms/TableHeaderCell",
	component: TableHeaderCell,
	argTypes: {
		sortable: { control: "boolean" },
		sortDirection: {
			control: "select",
			options: ["asc", "desc", undefined],
		},
		size: {
			control: "select",
			options: Array.from({ length: 12 }, (_, i) => `${i + 1}`),
		},
		title: { control: "text" },
	},
	args: {
		sortable: true,
		sortDirection: undefined,
		size: 3,
		title: "Column Header",
	},
	render: Template, // ✅ injecte le template
};

export default meta;

type Story = StoryObj<ITableHeaderCellProps>;

export const Default: Story = {
	name: "Default",
	args: {
		title: "Name",
		sortable: true,
	},
};

export const Sortable: Story = {
	name: "Sortable",
	args: {
		title: "Name",
		sortable: true,
	},
};

export const SortedAsc: Story = {
	name: "Sorted Ascending",
	args: {
		title: "Name",
		sortable: true,
		sortDirection: "asc",
	},
};

export const SortedDesc: Story = {
	name: "Sorted Descending",
	args: {
		title: "Name",
		sortable: true,
		sortDirection: "desc",
	},
};

export const FullWidth: Story = {
	name: "Full Width",
	args: {
		title: "Full Width Header",
		size: 12,
		sortable: true,
	},
};
