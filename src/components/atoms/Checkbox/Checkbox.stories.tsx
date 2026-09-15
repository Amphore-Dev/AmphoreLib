import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { Checkbox, ICheckboxProps } from "./Checkbox";

export default {
	title: "Components/Atoms/Checkbox",
	component: Checkbox,
	argTypes: {
		disabled: { control: { type: "boolean" } },
		indeterminate: { control: { type: "boolean" } },
	},
};

const Template: StoryFn<ICheckboxProps> = (args) => {
	const [checked, setChecked] = useState(!!args.checked);
	return <Checkbox {...args} checked={checked} onChange={setChecked} />;
};

export const Base = Template.bind({});
Base.args = {
	label: "Invoice sent",
};

export const Checked = Template.bind({});
Checked.args = {
	label: "Active",
	checked: true,
};

export const Indeterminate = Template.bind({});
Indeterminate.args = {
	label: "Partial selection",
	indeterminate: true,
};

export const WithError = Template.bind({});
WithError.args = {
	label: "I accept the terms",
	error: "You must accept the terms to continue",
};

export const Disabled = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
		<Checkbox label="Disabled unchecked" onChange={() => {}} disabled />
		<Checkbox
			label="Disabled checked"
			checked
			onChange={() => {}}
			disabled
		/>
	</div>
);
