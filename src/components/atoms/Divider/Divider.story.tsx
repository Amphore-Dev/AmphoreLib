import React from "react";

import { StoryFn } from "@storybook/react";

import { Divider, IDivider } from "./Divider";

const Template: StoryFn<IDivider> = (args) => (
	<div className="flex items-center gap-6">
		<Divider {...args} />
	</div>
);

export default {
	title: "Components/Atoms/Divider",
	component: Template,
	argTypes: {
		color: {
			control: "radio",
			options: ["primary", "warning"],
		},
		value: {
			control: {
				type: "number",
			},
		},
	},
	parameters: {
		controls: {
			include: ["color", "value"],
		},
	},
};

export const Default = Template.bind({});

Default.args = {};
