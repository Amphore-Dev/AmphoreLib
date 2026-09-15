import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { CheckboxFilter, ICheckboxesFilterProps } from "./CheckboxFilter";

export default {
	title: "Components/Molecules/CheckboxFilter",
	component: CheckboxFilter,
	argTypes: {
		label: { control: "text" },
		error: { control: "text" },
		hideError: { control: { type: "boolean" } },
		disabled: { control: { type: "boolean" } },
		required: { control: { type: "boolean" } },
		// Data-driven — same convention as Select: no control for options/value/onChange.
		options: { control: false },
		value: { control: false },
		onChange: { control: false },
	},
};

const options = [
	{ label: "Monday", value: "mon" },
	{ label: "Tuesday", value: "tue" },
	{ label: "Wednesday", value: "wed" },
	{ label: "Thursday (unavailable)", value: "thu", disabled: true },
];

const Template: StoryFn<ICheckboxesFilterProps> = (args) => (
	<CheckboxFilter {...args} />
);

export const Default = Template.bind({});
Default.args = {
	label: "Days",
	options,
	value: ["tue"],
};

export const WithError = Template.bind({});
WithError.args = {
	label: "Days",
	options,
	value: [],
	required: true,
	error: "Select at least one day",
};

export const Disabled = Template.bind({});
Disabled.args = {
	label: "Days",
	options,
	value: ["mon", "wed"],
	disabled: true,
};

export const Interactive: StoryFn<ICheckboxesFilterProps> = (args) => {
	const [value, setValue] = useState<string[]>(["tue"]);
	return <CheckboxFilter {...args} value={value} onChange={setValue} />;
};
Interactive.args = { label: "Days", options };

export const NoLabel = Template.bind({});
NoLabel.args = { options, value: [] };

export const ManyOptions = Template.bind({});
ManyOptions.args = {
	label: "Skills",
	options: Array.from({ length: 12 }, (_, i) => ({
		label: `Skill ${i + 1}`,
		value: `skill-${i + 1}`,
	})),
	value: ["skill-2", "skill-5"],
};
