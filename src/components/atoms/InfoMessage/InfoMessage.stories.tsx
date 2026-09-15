import React from "react";

import { colorArgType, pictoArgType, sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { IInfoMessageProps, InfoMessage } from "./InfoMessage";

export default {
	title: "Components/Atoms/InfoMessage",
	component: InfoMessage,
	argTypes: {
		color: colorArgType,
		variant: { control: "radio", options: ["tint", "outline", "solid"] },
		size: sizeArgType,
		picto: pictoArgType,
		hideIcon: { control: { type: "boolean" } },
	},
};

const Template: StoryFn<IInfoMessageProps> = (args) => (
	<InfoMessage {...args} />
);

export const Base = Template.bind({});
Base.args = { children: "This is some information." };

export const AllColors = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
		<InfoMessage color="info">Information</InfoMessage>
		<InfoMessage color="success">Operation successful.</InfoMessage>
		<InfoMessage color="warning">Warning, check this field.</InfoMessage>
		<InfoMessage color="danger">An error occurred.</InfoMessage>
	</div>
);

export const Variants = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
		<InfoMessage color="warning" variant="tint">
			Tint (default)
		</InfoMessage>
		<InfoMessage color="warning" variant="outline">
			Outline
		</InfoMessage>
		<InfoMessage color="warning" variant="solid">
			Solid
		</InfoMessage>
	</div>
);

export const CustomIcon = Template.bind({});
CustomIcon.args = {
	color: "success",
	picto: "star",
	children: "Custom icon.",
};

export const WithoutIcon = Template.bind({});
WithoutIcon.args = { children: "Message without an icon.", hideIcon: true };

export const Sizes = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
		<InfoMessage size="sm">Small</InfoMessage>
		<InfoMessage size="md">Medium</InfoMessage>
		<InfoMessage size="lg">Large</InfoMessage>
	</div>
);

export const DefaultSizeFromConfig = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
		<AmphoreProvider config={{ defaults: { size: "sm" } }}>
			<InfoMessage>defaults.size: sm</InfoMessage>
		</AmphoreProvider>
		<AmphoreProvider config={{ defaults: { size: "lg" } }}>
			<InfoMessage>defaults.size: lg</InfoMessage>
			{/* An explicit size prop still wins over the config default. */}
			<InfoMessage size="sm">
				defaults.size: lg, size="sm" explicit
			</InfoMessage>
		</AmphoreProvider>
	</div>
);

export const LongText = Template.bind({});
LongText.args = {
	color: "info",
	children:
		"This message is deliberately much longer than the other examples, to check that the text wraps correctly, that the icon stays aligned to the top without getting squashed, and that the message keeps a reasonable width instead of stretching across the full available width with no limit at all.",
};
