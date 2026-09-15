import React, { useState } from "react";

import { sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { Badge } from "@components/atoms";

import { TodoItem, ITodoItemProps } from "./TodoItem";

export default {
	title: "Components/Molecules/TodoItem",
	component: TodoItem,
	argTypes: {
		size: sizeArgType,
		text: { control: "text" },
		removeLabel: { control: "text" },
		multiline: { control: "boolean" },
		editable: { control: "boolean" },
		removable: { control: "boolean" },
		dragging: { control: "boolean" },
	},
};

const Template: StoryFn<ITodoItemProps> = (args) => {
	const [text, setText] = useState(args.text);
	return (
		<ul style={{ listStyle: "none", margin: 0, padding: 0, maxWidth: 420 }}>
			<TodoItem {...args} text={text} onTextChange={setText} />
		</ul>
	);
};

export const Base = Template.bind({});
Base.args = {
	text: "Fix the pricing terms form validation",
};

export const WithBeforeSlot = Template.bind({});
WithBeforeSlot.args = {
	...Base.args,
	before: <Badge color="neutral">MYD-15898</Badge>,
};

export const SingleLine = Template.bind({});
SingleLine.args = {
	text: "A long task description that gets clipped with an ellipsis instead of wrapping onto a second line",
	multiline: false,
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
	...Base.args,
	editable: false,
	removable: false,
};

export const WithDragHandle = Template.bind({});
WithDragHandle.args = {
	...Base.args,
	dragHandleProps: { "aria-label": "Move" },
};

export const Dragging = Template.bind({});
Dragging.args = {
	...WithDragHandle.args,
	dragging: true,
};
