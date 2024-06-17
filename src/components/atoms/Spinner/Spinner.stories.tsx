import React from "react";
import { StoryFn } from "@storybook/react";
import { ISpinner, Spinner } from "./Spinner";

export default {
	title: "Components/Atoms/Spinner",
	component: Spinner,
	argTypes: {
		size: {
			control: {
				type: "number",
			},
		},
		inline: {
			control: {
				type: "boolean",
			},
		},
	},
};

const Template: StoryFn<ISpinner> = (args) => <Spinner {...args} />;

export const Base = Template.bind({});

Base.args = {
	text: "Loading...",
	size: 2,
	inline: false,
};

export const Inline: StoryFn<ISpinner> = (args) => (
	<Template {...args} inline text="Loading..." />
);
