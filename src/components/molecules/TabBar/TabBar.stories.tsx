import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { TabBar, ITabBarProps, ITabItem } from "./TabBar";

export default {
	title: "Components/Molecules/TabBar",
	component: TabBar,
	argTypes: {
		stretch: {
			control: { type: "boolean" },
			description:
				"Tabs take equal width across the full container (min: fit-content).",
		},
		size: {
			control: "radio",
			options: ["s", "m", "l"],
		},
		border: {
			control: { type: "boolean" },
			description: "Removes the bottom border of the TabBar.",
		},
	},
};

const baseTabs: ITabItem[] = [
	{ id: "overview", label: "Overview" },
	{ id: "details", label: "Details" },
	{ id: "settings", label: "Settings" },
	{ id: "history", label: "History" },
	{ id: "history2", label: "History" },
	{ id: "history3", label: "History" },
];

const Template: StoryFn<ITabBarProps> = (args) => {
	const [active, setActive] = useState(args.activeTab ?? baseTabs[0].id);
	return <TabBar {...args} activeTab={active} onChange={setActive} />;
};

export const Base = Template.bind({});
Base.args = {
	tabs: baseTabs,
	activeTab: "overview",
};

export const WithPictos = () => {
	const [active, setActive] = useState("dashboard");

	const tabs: ITabItem[] = [
		{ id: "dashboard", label: "Dashboard", picto: "home" },
		{ id: "users", label: "Users", picto: "users" },
		{ id: "settings", label: "Settings", picto: "settings" },
		{ id: "analytics", label: "Analytics", picto: "barChart" },
	];

	return <TabBar tabs={tabs} activeTab={active} onChange={setActive} />;
};

export const WithDisabled = () => {
	const [active, setActive] = useState("active");

	const tabs: ITabItem[] = [
		{ id: "active", label: "Active" },
		{ id: "disabled", label: "Disabled", disabled: true },
		{ id: "other", label: "Other" },
	];

	return <TabBar tabs={tabs} activeTab={active} onChange={setActive} />;
};

export const Stretch = () => {
	const [active, setActive] = useState("overview");

	const tabs: ITabItem[] = [
		{ id: "overview", label: "Overview" },
		{ id: "details", label: "Details" },
		{ id: "settings", label: "Settings" },
	];

	return (
		<TabBar tabs={tabs} activeTab={active} onChange={setActive} stretch />
	);
};

export const Scrollable = () => {
	const [active, setActive] = useState("tab1");

	const tabs: ITabItem[] = [
		{ id: "tab1", label: "Overview", picto: "home" },
		{ id: "tab2", label: "Details", picto: "file" },
		{ id: "tab3", label: "Users", picto: "users" },
		{ id: "tab4", label: "Settings", picto: "settings" },
		{ id: "tab5", label: "Analytics", picto: "barChart" },
		{ id: "tab6", label: "History", picto: "clock" },
		{ id: "tab7", label: "Reports", picto: "pieChart" },
		{ id: "tab8", label: "Notifications", picto: "bell" },
		{ id: "tab9", label: "Logs", picto: "terminal" },
		{ id: "tab10", label: "Archive", picto: "archive" },
	];

	return (
		<div style={{ width: 400 }}>
			<TabBar tabs={tabs} activeTab={active} onChange={setActive} />
		</div>
	);
};
