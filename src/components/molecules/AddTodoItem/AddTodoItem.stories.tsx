import React from "react";

import { sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { AddTodoItem, IAddTodoItemProps } from "./AddTodoItem";

export default {
	title: "Components/Molecules/AddTodoItem",
	component: AddTodoItem,
	argTypes: {
		size: sizeArgType,
		multiline: { control: "boolean" },
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

export const Multiline = Template.bind({});
Multiline.args = {
	...Base.args,
	multiline: true,
	placeholder: "Add… (Shift+Enter for a new line)",
};

export const CustomLabels = Template.bind({});
CustomLabels.args = {
	...Base.args,
	placeholder: "New task…",
	buttonLabel: "+",
};
