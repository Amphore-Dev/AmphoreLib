import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { ColorPicker, IColorPickerProps } from "./ColorPicker";

export default {
	title: "Components/Atoms/ColorPicker",
	component: ColorPicker,
	argTypes: {
		format: { control: "select", options: ["hex", "rgb", "hsl"] },
		showAlpha: { control: { type: "boolean" } },
		gradient: { control: { type: "boolean" } },
		solid: { control: { type: "boolean" } },
		noPadding: { control: { type: "boolean" } },
		noElevation: { control: { type: "boolean" } },
	},
};

const Template: StoryFn<IColorPickerProps> = (args) => {
	const [value, setValue] = useState(args.value ?? "#3663DD");
	return <ColorPicker {...args} value={value} onChange={setValue} />;
};

export const Base = Template.bind({});
Base.args = {};

export const WithAlpha = Template.bind({});
WithAlpha.args = { showAlpha: true };

export const SolidOnly = Template.bind({});
SolidOnly.args = { gradient: false, solid: true };

export const Flush = Template.bind({});
Flush.args = { noPadding: true, noElevation: true };
