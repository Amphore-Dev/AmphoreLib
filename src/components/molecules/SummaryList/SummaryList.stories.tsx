import React from "react";

import { StoryFn } from "@storybook/react";

import { SummaryList, ISummaryListProps } from "./SummaryList";

export default {
	title: "Components/Molecules/SummaryList",
	component: SummaryList,
	argTypes: {
		layout: {
			control: "radio",
			options: ["vertical", "horizontal", "grid"],
		},
		divider: { control: { type: "boolean" } },
	},
};

const Template: StoryFn<ISummaryListProps> = (args) => (
	<div>
		<SummaryList {...args} />
	</div>
);

export const Base = Template.bind({});
Base.args = {
	items: [
		{ label: "Name", value: "Alice Johnson" },
		{ label: "Email", value: "alice.johnson@example.com" },
		{ label: "Role", value: "Administrator" },
	],
};

export const Horizontal = Template.bind({});
Horizontal.args = {
	layout: "horizontal",
	items: [
		{ label: "Name", value: "Alice Johnson" },
		{ label: "Email", value: "alice.johnson@example.com" },
		{ label: "Role", value: "Administrator" },
	],
};

export const Grid = Template.bind({});
Grid.args = {
	layout: "grid",
	gridConfig: { columns: 2 },
	items: [
		{ label: "Name", value: "Alice Johnson" },
		{ label: "Email", value: "alice.johnson@example.com" },
		{ label: "Role", value: "Administrator" },
		{ label: "Status", value: "Active" },
	],
};

export const WithDivider = Template.bind({});
WithDivider.args = {
	divider: true,
	items: [
		{ label: "Name", value: "Alice Johnson" },
		{ label: "Email", value: "alice.johnson@example.com" },
		{ label: "Role", value: "Administrator" },
	],
};

export const WithLinkAndAction = Template.bind({});
WithLinkAndAction.args = {
	items: [
		{
			label: "Website",
			value: "example.com",
			href: "https://example.com",
			picto: "externalLink",
		},
		{
			label: "Password",
			value: "••••••••",
			action: {
				label: "Edit",
				picto: "edit",
				onClick: () => alert("Edit"),
			},
		},
		{
			label: "Reference",
			value: "ORD-2024-00123",
			onClick: () => alert("Copied!"),
			picto: "copy",
		},
	],
};

export const WithTruncation = Template.bind({});
WithTruncation.args = {
	items: [
		{
			label: "Description",
			value: "A deliberately long piece of text to show truncation on a single line with a tooltip revealing the full text on hover.",
			maxLines: 1,
		},
		{ label: "Name", value: "Alice" },
	],
};

export const Required = Template.bind({});
Required.args = {
	items: [
		{ label: "Name", value: "", required: true },
		{ label: "Email", value: "alice@example.com", required: true },
	],
};
