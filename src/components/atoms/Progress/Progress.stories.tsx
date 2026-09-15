import React from "react";

import { colorArgType, sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { IProgressProps, Progress } from "./Progress";

export default {
	title: "Components/Atoms/Progress",
	component: Progress,
	argTypes: {
		value: { control: { type: "range", min: 0, max: 100 } },
		size: sizeArgType,
		color: colorArgType,
		indeterminate: { control: "boolean" },
		showValue: { control: "boolean" },
	},
};

const Template: StoryFn<IProgressProps> = (args) => <Progress {...args} />;

export const Base = Template.bind({});
Base.args = { value: 60 };

export const WithValueLabel = Template.bind({});
WithValueLabel.args = { value: 72, showValue: true };

export const Indeterminate = Template.bind({});
Indeterminate.args = { indeterminate: true };

export const Colors = () => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			gap: "1rem",
			maxWidth: 320,
		}}
	>
		{(
			[
				"primary",
				"danger",
				"success",
				"warning",
				"info",
				"neutral",
				"black",
			] as const
		).map((color) => (
			<Progress key={color} color={color} value={65} />
		))}
	</div>
);

export const Sizes = () => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			gap: "1rem",
			maxWidth: 320,
		}}
	>
		<Progress size="sm" value={50} />
		<Progress size="md" value={50} />
		<Progress size="lg" value={50} />
	</div>
);

export const DefaultSizeFromConfig = () => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			gap: "1rem",
			maxWidth: 320,
		}}
	>
		<AmphoreProvider config={{ defaults: { size: "sm" } }}>
			<Progress value={50} />
		</AmphoreProvider>
		<AmphoreProvider config={{ defaults: { size: "lg" } }}>
			<Progress value={50} />
			{/* An explicit size prop still wins over the config default. */}
			<Progress size="sm" value={50} />
		</AmphoreProvider>
	</div>
);
