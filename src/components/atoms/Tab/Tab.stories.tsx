import React from "react";

import { Pictos } from "@constants/CPictos";
import { StoryFn } from "@storybook/react";

import { Tab, ITabProps } from "./Tab";

export default {
	title: "Components/Atoms/Tab",
	component: Tab,
	argTypes: {
		label: {
			control: { type: "text" },
		},
		isActive: {
			control: { type: "boolean" },
		},
		disabled: {
			control: { type: "boolean" },
		},
		picto: {
			control: { type: "select" },
			options: [undefined, ...Object.keys(Pictos)],
			description: "Optional icon to display in the tab.",
		},
		size: {
			control: "radio",
			options: ["s", "m", "l"],
		},
	},
};

const Template: StoryFn<ITabProps> = (args) => <Tab {...args} />;

export const Base = Template.bind({});
Base.args = {
	label: "Tab",
	isActive: false,
	disabled: false,
};

export const States = () => (
	<div className="flex border-b border-neutral-200">
		<Tab label="Default" />
		<Tab label="Active" isActive />
		<Tab label="Disabled" disabled />
	</div>
);

export const WithPicto = () => (
	<div className="flex border-b border-neutral-200">
		<Tab label="Home" picto="home" />
		<Tab label="Settings" picto="settings" isActive />
		<Tab label="Users" picto="users" />
	</div>
);
