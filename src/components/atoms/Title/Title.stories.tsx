import React from "react";

import { colorArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { ITitleProps, Title } from "./Title";

export default {
	title: "Components/Atoms/Title",
	component: Title,
	argTypes: {
		as: {
			control: "select",
			options: ["h1", "h2", "h3", "h4", "h5", "h6"],
		},
		size: {
			control: "select",
			options: ["h1", "h2", "h3", "h4", "h5", "h6"],
		},
		color: colorArgType,
	},
};

const Template: StoryFn<ITitleProps> = (args) => <Title {...args} />;

export const Base = Template.bind({});
Base.args = { children: "Page title" };

export const AllLevels = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
		<Title as="h1">Heading h1</Title>
		<Title as="h2">Heading h2</Title>
		<Title as="h3">Heading h3</Title>
		<Title as="h4">Heading h4</Title>
		<Title as="h5">Heading h5</Title>
		<Title as="h6">Heading h6</Title>
	</div>
);

export const DecoupledSize = Template.bind({});
DecoupledSize.args = {
	as: "h2",
	size: "h5",
	children: "Semantic h2, visual size h5",
};

export const Colored = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
		<Title as="h3" color="primary">
			Primary
		</Title>
		<Title as="h3" color="danger">
			Danger
		</Title>
		<Title as="h3" color="success">
			Success
		</Title>
	</div>
);
