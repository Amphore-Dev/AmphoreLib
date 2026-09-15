import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { IRadioProps, Radio } from "./Radio";

export default {
	title: "Components/Atoms/Radio",
	component: Radio,
	argTypes: {
		disabled: { control: { type: "boolean" } },
	},
};

const Template: StoryFn<IRadioProps> = (args) => {
	const [checked, setChecked] = useState(!!args.checked);
	return <Radio {...args} checked={checked} onChange={setChecked} />;
};

export const Base = Template.bind({});
Base.args = {
	label: "Day",
};

export const Checked = Template.bind({});
Checked.args = {
	label: "Week",
	checked: true,
};

export const Group = () => {
	const [value, setValue] = useState<"day" | "week" | "month">("week");

	return (
		<div
			style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
		>
			{(["day", "week", "month"] as const).map((option) => (
				<Radio
					key={option}
					name="display"
					label={
						{ day: "Day", week: "Week", month: "Month" }[option]
					}
					checked={value === option}
					onChange={() => setValue(option)}
				/>
			))}
		</div>
	);
};

export const WithError = Template.bind({});
WithError.args = {
	label: "I agree",
	error: "Selection required",
};

export const Disabled = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
		<Radio label="Disabled unchecked" onChange={() => {}} disabled />
		<Radio label="Disabled checked" checked onChange={() => {}} disabled />
	</div>
);
