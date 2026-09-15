import React from "react";

import { StoryFn } from "@storybook/react";

import { NavList, INavListProps, TNavItem } from "./NavList";

export default {
	title: "Components/Molecules/NavList",
	component: NavList,
	argTypes: {
		isReduced: { control: "boolean" },
		items: { control: false },
		onNavigate: { control: false },
	},
};

const items: TNavItem[] = [
	{ href: "/home", label: "Home", picto: "home", isActive: true },
	{ href: "/tasks", label: "Tasks", picto: "calendar" },
	{ href: "/reports", label: "Reports", picto: "fileText" },
	{ href: "/hidden", label: "Never shown", hidden: true },
];

const Template: StoryFn<INavListProps> = (args) => (
	<div style={{ width: 200 }}>
		<NavList {...args} />
	</div>
);

export const Base = Template.bind({});
Base.args = {
	items,
};

export const Reduced = Template.bind({});
Reduced.args = {
	items,
	isReduced: true,
};
