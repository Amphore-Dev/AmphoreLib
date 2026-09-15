import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { IToggleProps, Toggle } from "./Toggle";

export default {
	title: "Components/Atoms/Toggle",
	component: Toggle,
	argTypes: {
		disabled: { control: { type: "boolean" } },
	},
};

const Template: StoryFn<IToggleProps> = (args) => {
	const [checked, setChecked] = useState(!!args.checked);
	return <Toggle {...args} checked={checked} onChange={setChecked} />;
};

export const Base = Template.bind({});
Base.args = {
	label: "Notifications",
};

export const Checked = Template.bind({});
Checked.args = {
	label: "Auto-retry",
	checked: true,
};

export const WithError = Template.bind({});
WithError.args = {
	label: "I agree",
	error: "You must agree",
};

/** Track and thumb both follow the theme's radius preset — sharp squares off both, not just the track. */
export const Themed = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
		<AmphoreProvider config={{ style: "sharp" }}>
			<Toggle label="Sharp" checked onChange={() => {}} />
		</AmphoreProvider>
		<AmphoreProvider config={{ style: "round" }}>
			<Toggle label="Round" checked onChange={() => {}} />
		</AmphoreProvider>
	</div>
);

export const Disabled = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
		<Toggle label="Disabled unchecked" onChange={() => {}} disabled />
		<Toggle label="Disabled checked" checked onChange={() => {}} disabled />
	</div>
);
