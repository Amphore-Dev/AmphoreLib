import React, { useState } from "react";

import { sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { IInputSearchProps, InputSearch } from "./InputSearch";

export default {
	title: "Components/Molecules/InputSearch",
	component: InputSearch,
	argTypes: {
		size: sizeArgType,
		delay: { control: "number" },
		debounced: { control: { type: "boolean" } },
		minLength: { control: "number" },
		disabled: { control: { type: "boolean" } },
	},
};

const Template: StoryFn<IInputSearchProps> = (args) => {
	const [value, setValue] = useState(args.value ?? "");
	return <InputSearch {...args} value={value} onChange={setValue} />;
};

export const Base = Template.bind({});
Base.args = { label: "Search", placeholder: "Search..." };

export const NoDebounce = Template.bind({});
NoDebounce.args = {
	label: "Search (instant)",
	placeholder: "Search...",
	debounced: false,
};

export const MinLength = Template.bind({});
MinLength.args = {
	label: "Search (3 chars min)",
	placeholder: "Search...",
	minLength: 3,
};

export const Disabled = Template.bind({});
Disabled.args = { label: "Search", value: "read only", disabled: true };
