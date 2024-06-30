import React from "react";

import { StoryFn } from "@storybook/react";

import { DatePicker, IDatePickerProps } from "./DatePicker";

export default {
	title: "Components/Molecules/DatePicker",
	component: DatePicker,
	argTypes: {
		onChange: {
			action: "onChange",
		},
		onMonthChange: {
			action: "onMonthChange",
		},
	},
	parameters: { docs: { iframeHeight: 400 } },
};

const Template: StoryFn<IDatePickerProps> = (args) => {
	return (
		<div className="min-h-[300px] text-center ">
			<DatePicker
				{...args}
				className="border-2 text-center"
				placeholderText="Click to pick a date"
			/>
		</div>
	);
};

export const Base = Template.bind({});

Base.args = {
	onChange: (date) => {
		alert(`Date changed to ${date}`);
	},
};

Base.parameters = {
	docs: {
		iframeHeight: 400,
	},
};

export const WeekPicker = Template.bind({});
WeekPicker.args = {
	weekPicker: true,
	onChange: (date) => {
		alert(`Week changed to ${JSON.stringify(date)}`);
	},
};

export const WithSelected = Template.bind({});
WithSelected.args = {
	selected: new Date(),
	onChange: (date) => {
		alert(`Date changed to ${date}`);
	},
};
