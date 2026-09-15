import React from "react";

import { pictoArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { NavItem, INavItemProps } from "./NavItem";

export default {
	title: "Components/Atoms/NavItem",
	component: NavItem,
	argTypes: {
		href: { control: "text" },
		isActive: { control: "boolean" },
		isReduced: { control: "boolean" },
		picto: pictoArgType,
		children: { control: "text" },
	},
};

const Template: StoryFn<INavItemProps> = (args) => (
	<div style={{ width: 200 }}>
		<NavItem {...args} />
	</div>
);

export const Base = Template.bind({});
Base.args = {
	href: "/tasks",
	picto: "home",
	children: "Tasks",
};

export const Active = Template.bind({});
Active.args = {
	...Base.args,
	isActive: true,
};

export const Reduced = Template.bind({});
Reduced.args = {
	...Base.args,
	isReduced: true,
};

// A whole sidebar, built directly from NavItem (see NavList for the
// data-driven molecule version of the same list).
export const SidebarExample = () => (
	<div
		style={{ display: "flex", flexDirection: "column", gap: 4, width: 200 }}
	>
		<NavItem href="/home" picto="home" isActive>
			Home
		</NavItem>
		<NavItem href="/tasks" picto="calendar">
			Tasks
		</NavItem>
		<NavItem href="/reports" picto="fileText">
			Reports
		</NavItem>
	</div>
);
