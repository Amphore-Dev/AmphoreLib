import React from "react";

import { Popover } from "./Popover";
import { StoryFn } from "@storybook/react/*";
import { ITooltipProps } from "../Tooltip/Tooltip";

export default {
	title: "Components/Atoms/Popover",
	component: Popover,
};

const Template: StoryFn<ITooltipProps> = (args) => <Popover {...args} />;

export const Base = Template.bind({});

Base.args = {
	children: "Click Me",
	title: "Hello, world!",
};

export const WithContent = Template.bind({});

WithContent.args = {
	children: "Click Me",
	content: <div>Content</div>,
};
