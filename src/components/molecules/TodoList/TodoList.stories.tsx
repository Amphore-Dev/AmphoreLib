import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { sizeArgType } from "@stories/StoriesArgs";

import { Badge } from "@components/atoms";
import { AddTodoItem } from "@components/molecules";

import { TodoList, ITodoListProps, TTodoItem } from "./TodoList";

export default {
	title: "Components/Molecules/TodoList",
	component: TodoList,
	argTypes: {
		size: sizeArgType,
		items: { control: false },
		onChange: { control: false },
		moveLabel: { control: "text" },
	},
	parameters: {
		docs: { story: { height: "320px" } },
	},
};

const seed: TTodoItem[] = [
	{
		id: "1",
		text: "Fix the pricing terms form validation",
		before: <Badge color="neutral">MYD-15898</Badge>,
	},
	{
		id: "2",
		text: "Audit dependencies and update vulnerable packages",
		before: <Badge color="neutral">MYD-15912</Badge>,
	},
	{ id: "3", text: "Security kickoff meeting with the client" },
];

const Template: StoryFn<ITodoListProps> = (args) => {
	const [items, setItems] = useState(args.items ?? seed);
	return (
		<div style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: 12 }}>
			<TodoList {...args} items={items} onChange={setItems} />
			<AddTodoItem
				onAdd={(text) =>
					setItems((prev) => [
						...prev,
						{ id: String(Date.now()), text },
					])
				}
			/>
		</div>
	);
};

export const Base = Template.bind({});
Base.args = { items: seed };

export const WithoutReorder = Template.bind({});
WithoutReorder.args = { items: seed, reorderable: false };

export const ReadOnly = Template.bind({});
ReadOnly.args = {
	items: seed,
	editable: false,
	removable: false,
	reorderable: false,
};

export const Empty = Template.bind({});
Empty.args = { items: [] };
