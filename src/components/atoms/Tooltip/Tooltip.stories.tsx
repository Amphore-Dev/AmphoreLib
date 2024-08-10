import React from "react";

import { StoryFn } from "@storybook/react/*";

import { ITooltipProps, Tooltip } from "./Tooltip";
import { Button } from "@components/atoms";

export default {
	title: "Components/Atoms/Tooltip",
	component: Tooltip,
};

const Template: StoryFn<ITooltipProps> = (args) => (
	<div className="">
		<Tooltip {...args}>
			<Button>{args.children}</Button>
		</Tooltip>
	</div>
);

export const Base = Template.bind({});

Base.args = {
	content: <div>Click Me</div>,
	children: "Children",
};

export const WithContent = Template.bind({});
WithContent.args = {
	children: "Click me",
	content: <div>Click me</div>,
};

export const Hover = Template.bind({});
Hover.args = {
	children: "Hover me",
	trigger: "hover",
	content: <div>Hover Me</div>,
};

export const HoverNoLeave = Template.bind({});
HoverNoLeave.args = {
	children: "Hover me",
	trigger: "hover",
	closeOnLeave: false,
	content: <div>Hover Me</div>,
};
