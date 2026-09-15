import React from "react";

import { StoryFn } from "@storybook/react";

import { Button } from "../../atoms/Button/Button";

import { ISectionCardProps, SectionCard } from "./SectionCard";

export default {
	title: "Components/Molecules/SectionCard",
	component: SectionCard,
	argTypes: {
		elevation: { control: "select", options: [undefined, 1, 2, 3, 4, 5] },
		noPadding: { control: { type: "boolean" } },
	},
};

const Template: StoryFn<ISectionCardProps> = (args) => (
	<div style={{ maxWidth: 400 }}>
		<SectionCard {...args} />
	</div>
);

export const Base = Template.bind({});
Base.args = {
	title: "Personal information",
	children: "Section content.",
};

export const WithActions = Template.bind({});
WithActions.args = {
	title: "Address",
	actions: (
		<Button size="sm" variant="ghost">
			Edit
		</Button>
	),
	children: "12 Main Street, Springfield",
};

export const Elevated = Template.bind({});
Elevated.args = {
	title: "Security",
	elevation: 2,
	children: "Elevated content.",
};
