import React from "react";

import { StoryFn } from "@storybook/react";

import { Title, ITitleProps } from "./Title";

export default {
	title: "Components/Atoms/Title",
	component: Title,
	argTypes: {
		tag: {
			control: {
				disable: true,
			},
		},
		children: {
			type: "text",
		},
		"...": {
			description: "All default title props",
			control: {
				disable: true,
			},
		},
	},

	parameters: {
		controls: {
			include: ["tag", "children", "..."],
		},
	},
};

const Template: StoryFn<ITitleProps> = (args) => {
	return (
		<>
			<Title {...args} tag="h1">
				H1 Title
			</Title>
			<Title {...args} tag="h2">
				H2 Title
			</Title>
			<Title {...args} tag="h3">
				H3 Title
			</Title>
			<Title {...args} tag="h4">
				H4 Title
			</Title>
			<Title {...args} tag="h5">
				H5 Title
			</Title>
			<Title {...args} tag="h6">
				H6 Title
			</Title>
		</>
	);
};

export const Base = Template.bind({});
