import React from "react";

import { StoryFn } from "@storybook/react/*";

import { CountDown, ICountDownProps } from "./CountDown";

export default {
	title: "Components/Atoms/CountDown",
	component: CountDown,
	argTypes: {
		time: {
			control: {
				type: "number",
				min: 0,
			},
		},
		text: {
			control: {
				type: "text",
			},
		},
		handleEnd: {
			control: {
				disable: true,
			},
		},
	},
	parameters: {
		controls: {
			include: ["time", "text", "handleEnd"],
		},
	},
};

const Template: StoryFn<ICountDownProps> = (args) => <CountDown {...args} />;

export const Default = Template.bind({});

Default.args = {
	time: 15,
	text: "Time left: {time} seconds",
	handleEnd: () => {
		alert("Time's up!");
	},
};
