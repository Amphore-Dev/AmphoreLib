import React from "react";

import { StoryFn } from "@storybook/react";

import { Chip, IChipProps } from "./Chip";

const Template: StoryFn<IChipProps> = (args) => (
	<div className="flex items-center">
		<Chip {...args} />
	</div>
);

export default {
	title: "Components/Atoms/Chip",
	component: Template,
	argTypes: {
		disabled: {
			control: "boolean",
			defaultValue: false,
		},
	},
};

export const Default = Template.bind({});

Default.args = {
	label: "Chips filter",
	onDelete: () => alert("onDelete called"),
};
