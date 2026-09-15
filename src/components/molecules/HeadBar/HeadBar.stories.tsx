import React from "react";

import { StoryFn } from "@storybook/react";

import { HeadBar, IHeadBarProps } from "./HeadBar";

export default {
	title: "Components/Molecules/HeadBar",
	component: HeadBar,
};

const Template: StoryFn<IHeadBarProps> = (args) => <HeadBar {...args} />;

export const Base = Template.bind({});
Base.args = {
	leftContent: <strong>Amphore</strong>,
	rightContent: <span>Profile</span>,
};

export const WithMenuButton = Template.bind({});
WithMenuButton.args = {
	onMenuClick: () => alert("Menu clicked"),
	leftContent: <strong>Amphore</strong>,
	rightContent: <span>Profile</span>,
};
