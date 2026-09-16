import React, { useState } from "react";

import { colorArgType, sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { DatePicker, IDatePickerProps } from "./DatePicker";

export default {
	title: "Components/Molecules/DatePicker",
	component: DatePicker,
	argTypes: {
		portal: { control: "boolean" },
		size: sizeArgType,
		color: colorArgType,
		disabled: { control: { type: "boolean" } },
	},
};

const Template: StoryFn<IDatePickerProps> = (args) => {
	const [value, setValue] = useState<Date | null>(args.value ?? null);
	return <DatePicker {...args} value={value} onChange={setValue} />;
};

export const Base = Template.bind({});
Base.args = { label: "Delivery date" };

export const WithValue = Template.bind({});
WithValue.args = { label: "Date of birth", value: new Date(1990, 5, 15) };

export const WithBounds = Template.bind({});
WithBounds.args = {
	label: "Slot (today + 30 days)",
	min: new Date(),
	max: new Date(new Date().setDate(new Date().getDate() + 30)),
};

export const WithError = Template.bind({});
WithError.args = { label: "Date", error: "Invalid date" };

export const Disabled = Template.bind({});
Disabled.args = { label: "Date", value: new Date(), disabled: true };

export const Sizes = () => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			gap: "1rem",
			maxWidth: 240,
		}}
	>
		<DatePicker label="Small" size="sm" value={null} onChange={() => {}} />
		<DatePicker label="Medium" size="md" value={null} onChange={() => {}} />
		<DatePicker label="Large" size="lg" value={null} onChange={() => {}} />
	</div>
);

export const DefaultSizeFromConfig = () => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			gap: "1rem",
			maxWidth: 240,
		}}
	>
		<AmphoreProvider config={{ defaults: { size: "sm" } }}>
			<DatePicker
				label="defaults.size: sm"
				value={null}
				onChange={() => {}}
			/>
		</AmphoreProvider>
		<AmphoreProvider config={{ defaults: { size: "lg" } }}>
			<DatePicker
				label="defaults.size: lg"
				value={null}
				onChange={() => {}}
			/>
			{/* An explicit size prop still wins over the config default. */}
			<DatePicker
				label='defaults.size: lg, size="sm" explicit'
				size="sm"
				value={null}
				onChange={() => {}}
			/>
		</AmphoreProvider>
	</div>
);

export const Portal = Template.bind({});
Portal.args = {
	...Base.args,
	portal: true,
};
