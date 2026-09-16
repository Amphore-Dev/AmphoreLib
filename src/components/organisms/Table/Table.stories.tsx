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
		columnVisibilityMenu: { control: { type: "boolean" } },
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
		<Table
			columns={columns}
			items={users}
			getItemKey={(u) => u.id}
			columnVisibilityMenu
		/>
	</div>
);

// `width` takes any grid track size — fixed, percentage, fr or keyword.
// The Role column opts out of the ellipsis/tooltip wrapper: its `render`
// output is a pill, not text, so there's nothing to truncate or hover.
const sizedColumns: TTableColumn<TUser>[] = [
	{ key: "name", label: "Name (120px)", width: "120px", sortable: true },
	{
		key: "email",
		label: "Email (1fr, min 200px)",
		width: "1fr",
		minWidth: "200px",
	},
	{
		key: "role",
		label: "Role (auto, no truncate)",
		width: "auto",
		truncate: false,
		render: (u) => (
			<span
				style={{
					padding: "0 var(--amp-space-2)",
					borderRadius: "999px",
					background: "var(--amp-color-primary-tint)",
					color: "var(--amp-color-primary)",
					fontSize: "0.75rem",
					lineHeight: "1.25rem",
				}}
			>
				{u.role}
			</span>
		),
	},
	{
		key: "description",
		label: "Description (1fr, 2 lines, no tooltip)",
		width: "1fr",
		minWidth: "150px",
		truncate: false,
		render: () =>
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at ipsum eu nunc commodo posuere et sit amet ligula.",
		maxLines: 2,
	},
];

// `maxLines` clamps a cell to N lines instead of one; `rowHeight` is only
// the virtualizer's estimate, so it's bumped to roughly match.
const multiLineColumns: TTableColumn<TUser>[] = [
	{ key: "name", label: "Name", width: "120px" },
	{
		key: "email",
		label: "Bio (2 lines max)",
		width: "260px",
		maxLines: 2,
		render: (u) =>
			`${u.name} is ${u.role.toLowerCase()} number ${u.id}, reachable at ${u.email}, and this sentence keeps going long enough to wrap and get clamped.`,
	},
	{ key: "role", label: "Role" },
];

export const MultiLineCells = () => (
	<div style={{ height: 400 }}>
		<Table
			columns={multiLineColumns}
			items={users}
			getItemKey={(u) => u.id}
			rowHeight={52}
		/>
	</div>
);

export const ColumnWidths = () => (
	<div style={{ height: 400 }}>
		<Table columns={sizedColumns} items={users} getItemKey={(u) => u.id} />
	</div>
);
