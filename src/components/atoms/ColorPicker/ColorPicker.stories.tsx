import React from "react";

import { StoryFn } from "@storybook/react/*";

import { IColorPickerProps, ColorPicker } from "./ColorPicker";

export default {
	title: "Components/Atoms/ColorPicker",
	component: ColorPicker,
};

const Template: StoryFn<IColorPickerProps> = (args) => {
	const [color, setColor] = React.useState<string>("#000000");
	return (
		<div className="flex flex-col items-center gap-4">
			<div className="max-w-[350px] ">
				<ColorPicker {...args} value={color} onChange={setColor} />
			</div>
			<div className="text-neutral-400">SELECTED</div>
			<div
				style={{
					backgroundColor: color,
				}}
				className="rounded-md w-8 h-8 border"
			/>
		</div>
	);
};

export const Base = Template.bind({});

Base.args = {};
