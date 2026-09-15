import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { IRadioFilterProps, RadioFilter } from "./RadioFilter";

export default {
	title: "Components/Molecules/RadioFilter",
	component: RadioFilter,
	argTypes: {
		label: { control: "text" },
		error: { control: "text" },
		hideError: { control: { type: "boolean" } },
		disabled: { control: { type: "boolean" } },
		required: { control: { type: "boolean" } },
		name: { control: "text" },
		// Data-driven — no control for options/value/onChange.
		options: { control: false },
		value: { control: false },
		onChange: { control: false },
	},
};

const options = [
	{ label: "Ascending", value: "asc" },
	{ label: "Descending", value: "desc" },
	{ label: "Random (unavailable)", value: "random", disabled: true },
];

const Template: StoryFn<IRadioFilterProps> = (args) => (
	<RadioFilter {...args} />
);

export const Default = Template.bind({});
Default.args = {
	label: "Sort",
	options,
	value: "asc",
};

export const WithError = Template.bind({});
WithError.args = {
	label: "Sort",
	options,
	required: true,
	error: "Select a sort order",
};

export const Disabled = Template.bind({});
Disabled.args = {
	label: "Sort",
	options,
	value: "asc",
	disabled: true,
};

export const Interactive: StoryFn<IRadioFilterProps> = (args) => {
	const [value, setValue] = useState("asc");
	return <RadioFilter {...args} value={value} onChange={setValue} />;
};
Interactive.args = { label: "Sort", options };

export const NoSelection = Template.bind({});
NoSelection.args = { label: "Sort", options, value: null };
