import React from "react";

import { StoryFn } from "@storybook/react";

import { Button, ITooltipProps } from "../";
import { Popover } from "./Popover";

const Template: StoryFn<ITooltipProps> = (args) => (
	<div className="h-[70px]">
		<Popover {...args}>
			<Button>{args.children}</Button>
		</Popover>
	</div>
);

export default {
	title: "Components/Atoms/Popover",
	component: Template,
};

export const Default = {
	name: "Default",
	tags: ["!dev"],
	args: {
		children: "Content",
		content: <div>Click Me</div>,
	},
};

export const ClickWithCloseOnLeave = {
	name: "Click with close on leave",
	args: {
		children: "Content",
		content: <div>Click Me</div>,
		closeOnLeave: true,
	},
};

export const WithContainer = {
	args: {
		children: "Content",
		content: <div>Content</div>,
		container: true,
		closeOnLeave: false,
	},
};

export const Hover = {
	name: "Hover with no close on leave",
	args: {
		trigger: "hover",
		children: "Hover Me",
		content: <div>Content</div>,
		closeOnLeave: false,
	},
};
