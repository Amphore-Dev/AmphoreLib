import React, { useEffect } from "react";
import { StoryFn } from "@storybook/react";
import { Checkbox, ICheckboxProps } from "./Checkbox";
import { loremIpsum } from "@components/atoms";

export default {
	title: "Components/Atoms/Checkbox",
	component: Checkbox,
	argTypes: {
		checked: {
			control: "boolean",
		},
		disabled: {
			control: "boolean",
		},
		indeterminate: {
			control: "boolean",
		},
		label: {
			control: "text",
		},
	},
};

const Template: StoryFn<ICheckboxProps> = (args) => {
	const [checked, setChecked] = React.useState(args.checked);

	useEffect(() => {
		setChecked(args.checked);
	}, [args.checked]);

	return (
		<Checkbox
			{...args}
			checked={checked}
			onChange={() => {
				setChecked(!checked);
			}}
		/>
	);
};

export const Base = Template.bind({});

Base.args = {
	checked: false,
	disabled: false,
	indeterminate: false,
	label: loremIpsum({
		count: 2,
		units: "words",
	}),
};

export const Checked = Template.bind({});

Checked.args = {
	checked: true,
};

export const Disabled = Template.bind({});

Disabled.args = {
	checked: false,
	disabled: true,
};

export const CheckedDisabled = Template.bind({});

CheckedDisabled.args = {
	checked: true,
	disabled: true,
};

export const Indeterminate = Template.bind({});

Indeterminate.args = {
	indeterminate: true,
};

export const CheckedIndeterminate = Template.bind({});

CheckedIndeterminate.args = {
	checked: true,
	indeterminate: true,
};

export const DisabledIndeterminate = Template.bind({});

DisabledIndeterminate.args = {
	indeterminate: true,
	disabled: true,
};

export const CheckedDisabledIndeterminate = Template.bind({});

CheckedDisabledIndeterminate.args = {
	checked: true,
	indeterminate: true,
	disabled: true,
};
