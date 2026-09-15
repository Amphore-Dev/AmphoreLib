import React, { useState } from "react";

import { colorArgType, sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { ColorPickerField, IColorPickerFieldProps } from "./ColorPickerField";

export default {
	title: "Components/Molecules/ColorPickerField",
	component: ColorPickerField,
	argTypes: {
		size: sizeArgType,
		color: colorArgType,
		disabled: { control: { type: "boolean" } },
		hideValue: { control: { type: "boolean" } },
		noPadding: { control: { type: "boolean" } },
		noElevation: { control: { type: "boolean" } },
	},
};

const Template: StoryFn<IColorPickerFieldProps> = (args) => {
	const [value, setValue] = useState(args.value ?? "#3663DD");
	return <ColorPickerField {...args} value={value} onChange={setValue} />;
};

export const Base = Template.bind({});
Base.args = { label: "Color" };

export const WithError = Template.bind({});
WithError.args = { label: "Color", error: "Invalid color" };

export const Disabled = Template.bind({});
Disabled.args = { label: "Color", disabled: true };

export const NoValueText = Template.bind({});
NoValueText.args = { label: "Color", hideValue: true };

export const Sizes = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
		<ColorPickerField
			label="Small"
			size="sm"
			value="#3663DD"
			onChange={() => {}}
		/>
		<ColorPickerField
			label="Medium"
			size="md"
			value="#3663DD"
			onChange={() => {}}
		/>
		<ColorPickerField
			label="Large"
			size="lg"
			value="#3663DD"
			onChange={() => {}}
		/>
	</div>
);

export const DefaultSizeFromConfig = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
		<AmphoreProvider config={{ defaults: { size: "sm" } }}>
			<ColorPickerField
				label="defaults.size: sm"
				value="#3663DD"
				onChange={() => {}}
			/>
		</AmphoreProvider>
		<AmphoreProvider config={{ defaults: { size: "lg" } }}>
			<ColorPickerField
				label="defaults.size: lg"
				value="#3663DD"
				onChange={() => {}}
			/>
			{/* An explicit size prop still wins over the config default. */}
			<ColorPickerField
				label='defaults.size: lg, size="sm" explicit'
				size="sm"
				value="#3663DD"
				onChange={() => {}}
			/>
		</AmphoreProvider>
	</div>
);
