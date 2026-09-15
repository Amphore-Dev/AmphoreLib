import React, { useState } from "react";

import { colorArgType, sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { ITimePickerProps, TimePicker } from "./TimePicker";

export default {
	title: "Components/Atoms/TimePicker",
	component: TimePicker,
	argTypes: {
		size: sizeArgType,
		color: colorArgType,
		min: { control: "text" },
		max: { control: "text" },
		hourMax: { control: { type: "number" } },
		minuteStep: { control: { type: "number" } },
		disabled: { control: { type: "boolean" } },
	},
};

const Template: StoryFn<ITimePickerProps> = (args) => {
	const [value, setValue] = useState<string | null>(args.value ?? null);
	return <TimePicker {...args} value={value} onChange={setValue} />;
};

export const Base = Template.bind({});
Base.args = { label: "Appointment time", value: "09:30" };

export const Empty = Template.bind({});
Empty.args = { label: "Time", value: null };

export const WithBounds = Template.bind({});
WithBounds.args = {
	label: "Slot (9am-6pm)",
	value: "09:00",
	min: "09:00",
	max: "18:00",
};

export const WithError = Template.bind({});
WithError.args = {
	label: "Time",
	value: "09:00",
	error: "Slot unavailable",
};

export const Disabled = Template.bind({});
Disabled.args = { label: "Time", value: "09:00", disabled: true };

export const DurationOver24h = Template.bind({});
DurationOver24h.args = {
	label: "Duration (up to 999h)",
	value: "136:00",
	hourMax: 999,
};

export const MinuteStep = Template.bind({});
MinuteStep.args = {
	label: "Time (minutes in steps of 15)",
	value: "09:00",
	minuteStep: 15,
};

export const Sizes = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
		<TimePicker label="Small" size="sm" value="09:30" onChange={() => {}} />
		<TimePicker
			label="Medium"
			size="md"
			value="09:30"
			onChange={() => {}}
		/>
		<TimePicker label="Large" size="lg" value="09:30" onChange={() => {}} />
	</div>
);

export const DefaultSizeFromConfig = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
		<AmphoreProvider config={{ defaults: { size: "sm" } }}>
			<TimePicker
				label="defaults.size: sm"
				value="09:30"
				onChange={() => {}}
			/>
		</AmphoreProvider>
		<AmphoreProvider config={{ defaults: { size: "lg" } }}>
			<TimePicker
				label="defaults.size: lg"
				value="09:30"
				onChange={() => {}}
			/>
			{/* An explicit size prop still wins over the config default. */}
			<TimePicker
				label='defaults.size: lg, size="sm" explicit'
				size="sm"
				value="09:30"
				onChange={() => {}}
			/>
		</AmphoreProvider>
	</div>
);
