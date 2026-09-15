import React, { useState } from "react";

import { colorArgType, sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { ISliderProps, Slider } from "./Slider";

export default {
	title: "Components/Atoms/Slider",
	component: Slider,
	argTypes: {
		size: sizeArgType,
		color: colorArgType,
		min: { control: "number" },
		max: { control: "number" },
		step: { control: "number" },
		disabled: { control: { type: "boolean" } },
		showThumb: { control: { type: "boolean" } },
	},
};

const Template: StoryFn<ISliderProps> = (args) => {
	const [value, setValue] = useState(args.value ?? 0);
	return <Slider {...args} value={value} onChange={setValue} />;
};

export const Base = Template.bind({});
Base.args = { label: "Volume", value: 40 };

export const WithoutValueDisplay = Template.bind({});
WithoutValueDisplay.args = { label: "Volume", value: 40, showValue: false };

export const CustomRange = Template.bind({});
CustomRange.args = { label: "Price ($)", value: 50, min: 0, max: 500, step: 10 };

export const WithThumb = Template.bind({});
WithThumb.args = { label: "Volume", value: 40, showThumb: true };

export const Centered = Template.bind({});
Centered.args = {
	label: "Balance",
	value: 25,
	min: -50,
	max: 50,
	showThumb: true,
	centered: true,
};

export const WithError = Template.bind({});
WithError.args = { label: "Volume", value: 40, error: "Invalid value" };

export const Disabled = Template.bind({});
Disabled.args = { label: "Volume", value: 40, disabled: true };

export const Sizes = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
		<Slider label="Small" size="sm" value={30} onChange={() => {}} />
		<Slider label="Medium" size="md" value={30} onChange={() => {}} />
		<Slider label="Large" size="lg" value={30} onChange={() => {}} />
	</div>
);

export const DefaultSizeFromConfig = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
		<AmphoreProvider config={{ defaults: { size: "sm" } }}>
			<Slider label="defaults.size: sm" value={30} onChange={() => {}} />
		</AmphoreProvider>
		<AmphoreProvider config={{ defaults: { size: "lg" } }}>
			<Slider label="defaults.size: lg" value={30} onChange={() => {}} />
			{/* An explicit size prop still wins over the config default. */}
			<Slider
				label='defaults.size: lg, size="sm" explicit'
				size="sm"
				value={30}
				onChange={() => {}}
			/>
		</AmphoreProvider>
	</div>
);
