import React, { useState } from "react";

import { colorArgType, sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { INumberInputProps, NumberInput } from "./NumberInput";

export default {
	title: "Components/Atoms/NumberInput",
	component: NumberInput,
	argTypes: {
		size: sizeArgType,
		color: colorArgType,
		min: { control: { type: "number" } },
		max: { control: { type: "number" } },
		step: { control: { type: "number" } },
		decimals: { control: { type: "number" } },
		locale: { control: "text" },
		after: { control: "text" },
		increaseLabel: { control: "text" },
		decreaseLabel: { control: "text" },
		disabled: { control: { type: "boolean" } },
	},
};

const Template: StoryFn<INumberInputProps> = (args) => {
	const [value, setValue] = useState<number | null>(args.value ?? null);
	return <NumberInput {...args} value={value} onChange={setValue} />;
};

export const Base = Template.bind({});
Base.args = { label: "Quantity", value: 1 };

export const WithMinMax = Template.bind({});
WithMinMax.args = { label: "Quantity (0-10)", value: 5, min: 0, max: 10 };

export const WithStep = Template.bind({});
WithStep.args = { label: "In batches of 5", value: 10, step: 5 };

export const Empty = Template.bind({});
Empty.args = { label: "Quantity", value: null, placeholder: "0" };

export const WithUnit = Template.bind({});
WithUnit.args = { label: "Subscription length", value: 25.29, after: "d" };

export const LocaleFormatting = Template.bind({});
LocaleFormatting.args = {
	label: "Amount (en-US: comma thousands + period decimal)",
	value: 1234.5,
};

export const FixedDecimals = Template.bind({});
FixedDecimals.args = { label: "Price (2 decimals)", value: 19.9, decimals: 2 };

export const WithError = Template.bind({});
WithError.args = {
	label: "Quantity",
	value: -1,
	min: 0,
	error: "Must be positive",
};

export const Disabled = Template.bind({});
Disabled.args = { label: "Quantity", value: 3, disabled: true };

export const Sizes = () => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			gap: "1rem",
			maxWidth: 240,
		}}
	>
		<NumberInput label="Small" size="sm" value={1} onChange={() => {}} />
		<NumberInput label="Medium" size="md" value={1} onChange={() => {}} />
		<NumberInput label="Large" size="lg" value={1} onChange={() => {}} />
	</div>
);

export const DefaultSizeFromConfig = () => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			gap: "1rem",
			maxWidth: 240,
		}}
	>
		<AmphoreProvider config={{ defaults: { size: "sm" } }}>
			<NumberInput
				label="defaults.size: sm"
				value={1}
				onChange={() => {}}
			/>
		</AmphoreProvider>
		<AmphoreProvider config={{ defaults: { size: "lg" } }}>
			<NumberInput
				label="defaults.size: lg"
				value={1}
				onChange={() => {}}
			/>
			{/* An explicit size prop still wins over the config default. */}
			<NumberInput
				label='defaults.size: lg, size="sm" explicit'
				size="sm"
				value={1}
				onChange={() => {}}
			/>
		</AmphoreProvider>
	</div>
);
