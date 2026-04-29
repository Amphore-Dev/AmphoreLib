import React from "react";

import { StoryFn } from "@storybook/react";

import { Card, ICardProps } from "./Card";

const Template: StoryFn<ICardProps> = (args) => (
	<div className="flex items-center bg-primary-100 p-xl h-60">
		<Card {...args} />
	</div>
);

export default {
	title: "Components/Atoms/Card",
	component: Template,
	argTypes: {
		children: {
			control: "text",
		},
		color: {
			control: "radio",
			options: ["white", "grey"],
			description: "Card color",
			defaultValue: "white",
		},
		hasBorder: {
			control: "boolean",
		},
	},
};

export const Default = Template.bind({});

Default.args = {
	children: "Card",
	className: "w-1/2 h-full flex items-center justify-center",
	color: "white",
};

export const WithHeader = Template.bind({});

WithHeader.args = {
	...Default.args,
	color: "white",
	hasBorder: true,
	className: "w-1/2 h-full",
	header: {
		title: "Titre",
		info: {
			picto: "warning",
			text: "Information",
		},
	},
};

export const WithHeaderTitleOnly = Template.bind({});

WithHeaderTitleOnly.args = {
	...WithHeader.args,
	header: {
		title: "Titre",
	},
};
