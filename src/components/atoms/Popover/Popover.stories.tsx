import React from "react";

import { StoryFn } from "@storybook/react/*";

import { Popover } from "./Popover";
import { Button } from "@components/atoms";
import { ITooltipProps } from "@components/atoms";

export default {
	title: "Components/Atoms/Popover",
	component: Popover,
};

const Template: StoryFn<ITooltipProps> = (args) => (
	<Popover {...args}>
		<Button>{args.children}</Button>
	</Popover>
);

export const Base = Template.bind({});

Base.args = {
	children: "Click Me",
};

export const WithContent = Template.bind({});

WithContent.args = {
	children: "Click Me",
	content: <div>Content</div>,
};
