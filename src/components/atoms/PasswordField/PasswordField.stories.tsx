import React, { useState } from "react";

import { sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { IPasswordFieldProps, PasswordField } from "./PasswordField";

export default {
	title: "Components/Atoms/PasswordField",
	component: PasswordField,
	argTypes: {
		size: sizeArgType,
		autoHide: { control: { type: "boolean" } },
		autoHideSeconds: { control: "number" },
		disabled: { control: { type: "boolean" } },
		isClearable: { control: { type: "boolean" } },
		hidePasswordLabel: { control: "text" },
		showPasswordLabel: { control: "text" },
	},
};

const Template: StoryFn<IPasswordFieldProps> = (args) => {
	const [value, setValue] = useState(args.value ?? "");
	return (
		<PasswordField
			placeholder="Enter your password"
			{...args}
			value={value}
			onChange={setValue}
		/>
	);
};

export const Base = Template.bind({});
Base.args = { label: "Password", value: "hunter2" };

export const NoAutoHide = Template.bind({});
NoAutoHide.args = {
	label: "Password",
	value: "hunter2",
	autoHide: false,
};

export const FastAutoHide = Template.bind({});
FastAutoHide.args = {
	label: "Password (auto-hides after 2s)",
	value: "hunter2",
	autoHideSeconds: 2,
};

export const WithError = Template.bind({});
WithError.args = {
	label: "Password",
	value: "abc",
	error: "8 characters minimum",
};

export const Disabled = Template.bind({});
Disabled.args = { label: "Password", value: "hunter2", disabled: true };
