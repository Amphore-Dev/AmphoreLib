import React from "react";

import { StoryFn } from "@storybook/react/*";
import { ITooltipProps, Tooltip } from "./Tooltip";

export default {
	title: "Components/Atoms/Tooltip",
	component: Tooltip,
};

const Template: StoryFn<ITooltipProps> = (args) => <Tooltip {...args} />;

export const Base = Template.bind({});

Base.args = {
	children: "Hover me",
	title: "Hello, world!",
};

export const WithContent = Template.bind({});
WithContent.args = {
	children: "Hover me",
	content: <div>Content</div>,
};
