import React from "react";

import { StoryFn } from "@storybook/react";

import { Radio, IRadioProps } from "./Radio";

export default {
	title: "Components/Atoms/Radio",
	component: Radio,
	argTypes: {
		checked: {
			control: "boolean",
		},
		disabled: {
			control: "boolean",
		},

		label: {
			control: "text",
		},
		"...": {
			description: "All default checkbox props",
			control: {
				disable: true,
			},
		},
	},
	parameters: {
		controls: {
			include: ["checked", "disabled", "label", "..."],
		},
	},
};

const Template: StoryFn<IRadioProps> = (args) => {
	const [checked, setChecked] = React.useState("1");

	return (
		<>
			<Radio
				{...args}
				checked={checked === "1"}
				onChange={() => {
					setChecked("1");
				}}
				label={args.label?.length ? args.label : "Option 1"}
			/>
			<Radio
				{...args}
				checked={checked === "2"}
				onChange={() => {
					setChecked("2");
				}}
				label="Option 2"
			/>
			<Radio
				{...args}
				checked={checked === "3"}
				onChange={() => {
					setChecked("3");
				}}
				label="Option 3"
			/>
		</>
	);
};

export const Base = Template.bind({});

Base.args = {
	disabled: false,
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
