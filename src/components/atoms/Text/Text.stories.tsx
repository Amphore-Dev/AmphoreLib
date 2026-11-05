import React from "react";

import { colorArgType, sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { ITextProps, Text } from "./Text";

export default {
	title: "Components/Atoms/Text",
	component: Text,
	argTypes: {
		as: {
			control: "select",
			options: ["p", "span", "div", "label", "strong", "em", "small"],
		},
		size: sizeArgType,
		weight: {
			control: "select",
			options: ["regular", "semibold", "bold"],
		},
		color: {
			...colorArgType,
			options: ["ink", "sub", ...colorArgType.options],
		},
	},
};

const Template: StoryFn<ITextProps> = (args) => <Text {...args} />;

export const Base = Template.bind({});
Base.args = { children: "A paragraph of body copy." };

export const Secondary = Template.bind({});
Secondary.args = {
	size: "sm",
	color: "sub",
	children: "Updated two days ago",
};

export const Emphasised = Template.bind({});
Emphasised.args = {
	as: "span",
	weight: "semibold",
	color: "danger",
	children: "Payment overdue",
};

export const Sizes = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
		<Text size="sm">Small</Text>
		<Text size="md">Medium</Text>
		<Text size="lg">Large</Text>
	</div>
);

export const DefaultSizeFromConfig = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
		<AmphoreProvider config={{ defaults: { size: "sm" } }}>
			<Text>defaults.size: sm</Text>
		</AmphoreProvider>
		<AmphoreProvider config={{ defaults: { size: "lg" } }}>
			<Text>defaults.size: lg</Text>
			{/* An explicit size prop still wins over the config default. */}
			<Text size="sm">
				defaults.size: lg, size=&quot;sm&quot; explicit
			</Text>
		</AmphoreProvider>
	</div>
);
