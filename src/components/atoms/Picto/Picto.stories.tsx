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
		rotation: {
			control: {
				type: "number",
			},
		},
		className: {
			control: {
				type: "text",
			},
		},
		currentColor: {
			description: "If true, the picto will take the current color",
			control: {
				type: "boolean",
			},
		},
		src: {
			description: "If you want to use a custom svg",
			control: {
				type: "text",
			},
		},
		color: {
			control: {
				type: "color",
			},
		},
	},
	args: {
		icon: "logo",
		rotation: 0,
		className: "",
		currentColor: true,
		color: "#741b8c",
	},
};

export const Template: StoryFn<IPictoProps> = (args) => (
	<div
		style={{
			color: args.color,
		}}
	>
		<Picto {...args} className="w-32 h-32" />
	</div>
);
