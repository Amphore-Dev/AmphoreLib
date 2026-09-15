import React from "react";

import { StoryFn } from "@storybook/react";

import { ITdProps, Td } from "./Td";

export default {
	title: "Components/Atoms/Td",
	component: Td,
	argTypes: {
		sticky: { control: "radio", options: [undefined, "left", "right"] },
	},
};

const Template: StoryFn<ITdProps> = (args) => (
	<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
		<Td>Cell 1</Td>
		<Td {...args}>Cell 2</Td>
		<Td>Cell 3</Td>
	</div>
);

export const Base = Template.bind({});
Base.args = {};

export const StickyLeft = Template.bind({});
StickyLeft.args = { sticky: "left" };
