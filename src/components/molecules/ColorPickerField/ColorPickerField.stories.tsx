import React from "react";

import { StoryFn } from "@storybook/react/*";

import { ColorPickerField, IColorPickerFieldProps } from "./ColorPickerField";

export default {
	title: "Components/Molecules/ColorPickerField",
	component: ColorPickerField,
};

const Template: StoryFn<IColorPickerFieldProps> = (args) => {
	const [Value, setValue] = React.useState<string>("#000000");
	return (
		<div className="h-96">
			<ColorPickerField {...args} value={Value} onChange={setValue} />
		</div>
	);
};

export const Base = Template.bind({});

Base.args = {};
