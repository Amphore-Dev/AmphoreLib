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
		mode: { control: "select", options: ["single", "week"] },
		weekStartsOn: { control: "select", options: [0, 1, 6] },
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

/** `mode="week"`: a click selects the whole week of that day, hovering previews it. */
export const Week = Template.bind({});
Week.args = {
	label: "Planning week",
	mode: "week",
	value: new Date(2026, 2, 4),
};

/** The first day of the week comes from `locale`, unless `weekStartsOn` says otherwise. */
export const WeekStartingOnSunday = Template.bind({});
WeekStartingOnSunday.args = {
	label: "Planning week",
	mode: "week",
	weekStartsOn: 0,
	value: new Date(2026, 2, 4),
};

/** `markers`: a bar under the number; `label` joins the day's name and tooltip. */
export const WithMarkers = Template.bind({});
WithMarkers.args = {
	label: "Timesheet",
	value: new Date(2026, 2, 4),
	markers: [
		{ date: new Date(2026, 2, 2), label: "2 entries to fill in" },
		{ date: new Date(2026, 2, 4), label: "1 entry to fill in" },
		{ date: new Date(2026, 2, 12) },
	],
};

export const WeekWithMarkers = Template.bind({});
WeekWithMarkers.args = { ...WithMarkers.args, mode: "week" };

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
