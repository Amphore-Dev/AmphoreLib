import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { TTableColumn } from "@interfaces/index";

import { ITableProps, Table } from "./Table";

type TUser = {
	id: number;
	name: string;
	email: string;
	role: string;
};

const ROLES = ["Admin", "Editor", "Reader"];

const users: TUser[] = Array.from({ length: 200 }, (_, i) => ({
	id: i + 1,
	name: `User ${i + 1}`,
	email: `user${i + 1}@example.com`,
	role: ROLES[i % ROLES.length],
}));

const columns: TTableColumn<TUser>[] = [
	{ key: "name", label: "Name", sortable: true },
	{ key: "email", label: "Email", sortable: true },
	{ key: "role", label: "Role" },
];

export default {
	title: "Components/Organisms/Table",
	component: Table,
	argTypes: {
		rowHeight: { control: "number" },
		isLoading: { control: { type: "boolean" } },
		noDataMessage: { control: "text" },
		selectable: { control: { type: "boolean" } },
		showCheckbox: { control: { type: "boolean" } },
		selectOnClick: { control: { type: "boolean" } },
		selectionMode: { control: "radio", options: ["toggle", "exclusive"] },
		hasMore: { control: { type: "boolean" } },
	},
	parameters: {
		// Fills its own viewport inline — same reasoning as Modal's default.
		docs: { story: { height: "420px" } },
	},
};

// Manages its own selectedKeys so `selectable`/`selectionMode`/
// `selectOnClick` are all live, interactive Storybook controls instead of
// needing a separate story per combination.
const Template: StoryFn<ITableProps<TUser>> = (args) => {
	const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(
		new Set()
	);
	return (
		<div style={{ height: 400 }}>
			<Table
				{...args}
				selectedKeys={selectedKeys}
				setSelectedKeys={setSelectedKeys}
			/>
		</div>
	);
};

export const Base = Template.bind({});
Base.args = { columns, items: users, getItemKey: (u: TUser) => u.id };

export const Loading = Template.bind({});
Loading.args = {
	columns,
	items: [],
	getItemKey: (u: TUser) => u.id,
	isLoading: true,
};

export const Empty = Template.bind({});
Empty.args = { columns, items: [], getItemKey: (u: TUser) => u.id };

export const CustomEmptyMessage = Template.bind({});
CustomEmptyMessage.args = {
	columns,
	items: [],
	getItemKey: (u: TUser) => u.id,
	noDataMessage: "Nothing to show",
};

export const SelectionToggle = Template.bind({});
SelectionToggle.args = {
	columns,
	items: users,
	getItemKey: (u: TUser) => u.id,
	selectable: true,
	selectOnClick: true,
	selectionMode: "toggle",
};

export const SelectionExclusive = Template.bind({});
SelectionExclusive.args = {
	columns,
	items: users,
	getItemKey: (u: TUser) => u.id,
	selectable: true,
	selectOnClick: true,
	selectionMode: "exclusive",
};

export const SelectionNoCheckbox = Template.bind({});
SelectionNoCheckbox.args = {
	columns,
	items: users,
	getItemKey: (u: TUser) => u.id,
	selectable: true,
	showCheckbox: false,
	selectOnClick: true,
};

// The rest need a prop that isn't a plain control (rowActions is a
// function-bearing array) — same exception as data-driven components
// elsewhere (Select/NumberInput): argTypes only cover genuinely
// controllable primitives, not `items`/`columns`/handlers.

export const WithRowActions = () => (
	<div style={{ height: 400 }}>
		<Table
			columns={columns}
			items={users}
			getItemKey={(u) => u.id}
			rowActions={[
				{
					label: "Edit",
					picto: "edit",
					onClick: (user) => alert(`Edit ${user.name}`),
				},
				{
					label: "Delete",
					picto: "trash",
					onClick: (user) => alert(`Delete ${user.name}`),
				},
			]}
		/>
	</div>
);

export const ColumnVisibility = () => (
	<div style={{ height: 400 }}>
		<p style={{ fontSize: "0.8125rem", color: "var(--amp-color-sub)" }}>
			Right-click the header to show/hide columns.
		</p>
		<Table columns={columns} items={users} getItemKey={(u) => u.id} />
	</div>
);
