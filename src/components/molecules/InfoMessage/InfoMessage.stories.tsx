import React from "react";

import { StoryFn } from "@storybook/react";

import { InfoMessage, IInfoMessageProps } from "./InfoMessage";
import { LoremIpsum } from "@components/atoms";

export default {
	title: "Components/Molecules/InfoMessage",
	component: InfoMessage,
	argTypes: {
		type: {
			control: "radio",
			options: ["info", "success", "warning", "error"],
		},
		children: {
			control: {
				type: "text",
			},
		},
		withIcon: {
			control: {
				type: "boolean",
			},
		},
		icon: {
			control: {
				type: "text",
			},
		},
		outlined: {
			control: {
				type: "boolean",
			},
		},
	},
	parameters: {
		controls: {
			include: ["type", "children", "withIcon", "icon", "outlined"],
		},
	},
};

const Template: StoryFn<IInfoMessageProps> = (args) => (
	<InfoMessage {...args} />
);

export const Base = Template.bind({});

Base.args = {
	type: "info",
	children: <LoremIpsum units={"paragraph"} />,
	outlined: true,
};

export const Success = Template.bind({});
Success.args = {
	type: "success",
	children: "Success message",
};

export const Warning = Template.bind({});

Warning.args = {
	type: "warning",
	children: "Warning message",
};

export const Error = Template.bind({});

Error.args = {
	type: "error",
	children: "Error message",
};

export const Outlined = Template.bind({});
Outlined.args = {
	type: "info",
	children: "Outlined message",
	outlined: true,
};
