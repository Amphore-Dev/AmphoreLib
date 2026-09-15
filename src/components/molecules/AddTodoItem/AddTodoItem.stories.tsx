import React from "react";

import { StoryFn } from "@storybook/react";

import { sizeArgType } from "@stories/StoriesArgs";

import { AddTodoItem, IAddTodoItemProps } from "./AddTodoItem";

export default {
	title: "Components/Molecules/AddTodoItem",
	component: AddTodoItem,
	argTypes: {
		size: sizeArgType,
	},
};

const Template: StoryFn<IAddTodoItemProps> = (args) => (
	<div style={{ maxWidth: 420 }}>
		<AddTodoItem {...args} />
	</div>
);

export const Base = Template.bind({});
Base.args = {
	onAdd: (text: string) => console.log("onAdd", text),
};

export const CustomLabels = Template.bind({});
CustomLabels.args = {
	...Base.args,
	placeholder: "New task…",
	buttonLabel: "+",
};
