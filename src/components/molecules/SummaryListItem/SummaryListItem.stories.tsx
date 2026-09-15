import React from "react";

import { pictoArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { SummaryListItem, ISummaryListItemProps } from "./SummaryListItem";

export default {
	title: "Components/Molecules/SummaryListItem",
	component: SummaryListItem,
	argTypes: {
		direction: { control: "radio", options: ["vertical", "horizontal"] },
		picto: pictoArgType,
	},
};

const Template: StoryFn<ISummaryListItemProps> = (args) => (
	<div style={{ maxWidth: 400 }}>
		<SummaryListItem {...args} />
	</div>
);

export const Base = Template.bind({});
Base.args = { label: "Name", value: "Alice Johnson" };

export const WithLink = Template.bind({});
WithLink.args = {
	label: "Website",
	value: "example.com",
	href: "https://example.com",
	picto: "externalLink",
};

export const WithAction = Template.bind({});
WithAction.args = {
	label: "Password",
	value: "••••••••",
	action: {
		label: "Edit",
		picto: "edit",
		onClick: () => alert("Edit"),
	},
};

export const Truncated = Template.bind({});
Truncated.args = {
	label: "Description",
	value: "A deliberately long piece of text to show truncation on a single line with a tooltip revealing the full text on hover.",
	maxLines: 1,
};
