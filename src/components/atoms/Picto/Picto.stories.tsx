import React from "react";

import { StoryFn } from "@storybook/react";

import { Picto, IPictoProps } from "./Picto";
import { Pictos } from "@constants/index";

export default {
	title: "Components/Atoms/Picto",
	component: Picto,
	argTypes: {
		icon: {
			type: "radio",
			options: Object.keys(Pictos),
		},
		className: {
			control: {
				type: "text",
			},
		},
	},
};

interface IStoryProps extends IPictoProps {
	color: string;
}

const Template: StoryFn<IStoryProps> = (args) => (
	<Picto {...args} className="w-32 h-32" />
);

export const Base = Template.bind({});

Base.args = {
	icon: "info",
};
