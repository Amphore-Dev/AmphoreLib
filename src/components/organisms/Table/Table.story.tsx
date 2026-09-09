// stories for Table component
import React from "react";

import { StoryFn } from "@storybook/react";

import { TTableColumn } from "@interfaces/TTable";

import { Table } from "./Table";

export default {
	title: "Components/Organisms/Table",
	component: Table,
};

type TUser = {
	id: number;
	name: string;
	email: string;
	role: "admin" | "member";
};

const USERS: TUser[] = Array.from({ length: 40 }).map((_, index) => ({
	id: index + 1,
	name: `User ${index + 1}`,
	email: `user${index + 1}@amphore.dev`,
	role: index % 5 === 0 ? "admin" : "member",
}));

const columns: TTableColumn<TUser>[] = [
	{ key: "name", label: "Name", sortable: true },
	{ key: "email", label: "Email", sortable: true },
	{ key: "role", label: "Role", sortable: true },
];

export const Base: StoryFn = () => (
	<div className="h-96">
		<Table columns={columns} items={USERS} getItemKey={(item) => item.id} />
	</div>
);

export const Loading: StoryFn = () => (
	<div className="h-96">
		<Table
			columns={columns}
			items={[]}
			getItemKey={(item) => item.id}
			isLoading
		/>
	</div>
);

export const Empty: StoryFn = () => (
	<div className="h-96">
		<Table columns={columns} items={[]} getItemKey={(item) => item.id} />
	</div>
);

export const Selectable: StoryFn = () => {
	const [selectedKeys, setSelectedKeys] = React.useState<
		Set<string | number>
	>(new Set());

	return (
		<div className="h-96">
			<p className="mb-2 text-sm">
				{selectedKeys.size} selected — checkbox only, shift/ctrl-click
				range & toggle work from the checkbox too
			</p>
			<Table
				columns={columns}
				items={USERS}
				getItemKey={(item) => item.id}
				selectable
				selectedKeys={selectedKeys}
				setSelectedKeys={setSelectedKeys}
			/>
		</div>
	);
};

export const SelectOnClickToggle: StoryFn = () => {
	const [selectedKeys, setSelectedKeys] = React.useState<
		Set<string | number>
	>(new Set());

	return (
		<div className="h-96">
			<p className="mb-2 text-sm">
				{selectedKeys.size} selected — clicking anywhere on the row
				toggles it, keeps the rest (selectionMode=&quot;toggle&quot;,
				the default)
			</p>
			<Table
				columns={columns}
				items={USERS}
				getItemKey={(item) => item.id}
				selectable
				selectOnClick
				selectedKeys={selectedKeys}
				setSelectedKeys={setSelectedKeys}
			/>
		</div>
	);
};

export const SelectOnClickExclusive: StoryFn = () => {
	const [selectedKeys, setSelectedKeys] = React.useState<
		Set<string | number>
	>(new Set());

	return (
		<div className="h-96">
			<p className="mb-2 text-sm">
				{selectedKeys.size} selected — plain click replaces the
				selection, Ctrl/Cmd-click toggles additively, Shift-click
				range-selects (selectionMode=&quot;exclusive&quot;)
			</p>
			<Table
				columns={columns}
				items={USERS}
				getItemKey={(item) => item.id}
				selectable
				selectOnClick
				selectionMode="exclusive"
				selectedKeys={selectedKeys}
				setSelectedKeys={setSelectedKeys}
			/>
		</div>
	);
};

export const WithRowActions: StoryFn = () => (
	<div className="h-96">
		<Table
			columns={columns}
			items={USERS}
			getItemKey={(item) => item.id}
			rowActions={[
				{
					label: "Edit",
					icon: "edit",
					onClick: (item) => alert(`Editing ${item.name}`),
				},
				{
					label: "Delete",
					icon: "trash",
					onClick: (item) => alert(`Deleting ${item.name}`),
					disabled: (item) => item.role === "admin",
				},
			]}
		/>
	</div>
);

export const HidableColumns: StoryFn = () => {
	const withHiding: TTableColumn<TUser>[] = [
		{ key: "name", label: "Name", sortable: true },
		{ key: "email", label: "Email", sortable: true },
		{ key: "role", label: "Role", sortable: true, hidden: true },
	];

	return (
		<div className="h-96">
			<p className="mb-2 text-sm">
				Right-click any column header to toggle visibility
			</p>
			<Table
				columns={withHiding}
				items={USERS}
				getItemKey={(item) => item.id}
			/>
		</div>
	);
};
