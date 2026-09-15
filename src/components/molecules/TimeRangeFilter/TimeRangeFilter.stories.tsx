import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { ITimeRangeFilterProps, TimeRangeFilter } from "./TimeRangeFilter";

export default {
	title: "Components/Molecules/TimeRangeFilter",
	component: TimeRangeFilter,
	argTypes: {
		minuteStep: { control: "number" },
		hourMax: { control: "number" },
		disabled: { control: { type: "boolean" } },
		// The Template drives from/to/onChange itself — no control for those.
		from: { control: false },
		to: { control: false },
		onChange: { control: false },
	},
};

const Template: StoryFn<ITimeRangeFilterProps> = (args) => {
	const [from, setFrom] = useState<string | null>(null);
	const [to, setTo] = useState<string | null>(null);
	return (
		<TimeRangeFilter
			{...args}
			from={{ value: from }}
			to={{ value: to }}
			onChange={(field, value) =>
				field === "from" ? setFrom(value) : setTo(value)
			}
		/>
	);
};

export const Default = Template.bind({});
Default.args = {};

export const Disabled = Template.bind({});
Disabled.args = { disabled: true };

export const CustomInterval = Template.bind({});
CustomInterval.args = { minuteStep: 15 };

export const Prefilled: StoryFn<ITimeRangeFilterProps> = (args) => {
	const [from, setFrom] = useState<string | null>("09:00");
	const [to, setTo] = useState<string | null>("18:00");
	return (
		<TimeRangeFilter
			{...args}
			from={{ value: from }}
			to={{ value: to }}
			onChange={(field, value) =>
				field === "from" ? setFrom(value) : setTo(value)
			}
		/>
	);
};

export const WithPerSideBounds: StoryFn<ITimeRangeFilterProps> = (args) => {
	const [from, setFrom] = useState<string | null>(null);
	const [to, setTo] = useState<string | null>(null);
	return (
		<TimeRangeFilter
			{...args}
			from={{ value: from, min: "08:00", max: "12:00" }}
			to={{ value: to, min: "12:00", max: "20:00" }}
			onChange={(field, value) =>
				field === "from" ? setFrom(value) : setTo(value)
			}
		/>
	);
};
