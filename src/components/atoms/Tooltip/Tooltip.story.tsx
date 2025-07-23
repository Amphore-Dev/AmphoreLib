import React from "react";

import { Meta, StoryFn, StoryObj } from "@storybook/react";

import { ITooltipProps, Tooltip } from "./Tooltip";

const Template: StoryFn<ITooltipProps> = (args) => (
	<div className="h-[70px]">
		<Tooltip {...args}>{args.children}</Tooltip>
	</div>
);

export default {
	title: "Components/Atoms/Tooltip",
	component: Template,
	argTypes: {
		trigger: {
			control: "radio",
			options: ["click", "hover"],
			// default is "hover"
		},
	},
	args: {
		children: "Content",
		content: <div>HoverMe</div>,
		trigger: "hover",
		closeOnLeave: true,
	},
} as Meta<ITooltipProps>;

export const Default: StoryObj<ITooltipProps> = {
	args: {
		className: "",
		children: "Content",
		content: <div>HoverMe</div>,
		closeOnLeave: false,
		closeOnClickOutside: true,
		isOpen: false,
		portal: true,
		floatingProps: undefined,
		hoverHookProps: undefined,
		clickHookProps: undefined,
	},
};

export const Click: StoryObj<ITooltipProps> = {
	name: "Click with close on leave",
	args: {
		children: "Click me",
		trigger: "click",
		content: <div>Click Me</div>,
		closeOnLeave: true,
	},
};

export const HoverNoLeave: StoryObj<ITooltipProps> = {
	name: "Hover with no close on leave",
	args: {
		children: "Hover me",
		closeOnLeave: false,
		content: <div>Hover Me</div>,
	},
};
