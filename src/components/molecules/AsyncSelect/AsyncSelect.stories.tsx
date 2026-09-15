import React, { useState } from "react";

import { sizeArgType, pictoArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { TSelectOption } from "@interfaces/index";

import { AsyncSelect, IAsyncSelectProps } from "./AsyncSelect";

const ALL_USERS = [
	"Alice Johnson",
	"Bob Martin",
	"Charlie Brown",
	"Diane Petit",
	"Emile Ross",
	"Fatima Nasser",
];

const fakeFetch = (query: string): Promise<TSelectOption[]> =>
	new Promise((resolve) => {
		setTimeout(() => {
			const results = ALL_USERS.filter((name) =>
				name.toLowerCase().includes(query.toLowerCase())
			);
			resolve(results.map((name) => ({ value: name, label: name })));
		}, 600);
	});

export default {
	title: "Components/Molecules/AsyncSelect",
	component: AsyncSelect,
	argTypes: {
		size: sizeArgType,
		debounce: { control: "number" },
		picto: pictoArgType,
	},
};

const Template: StoryFn<IAsyncSelectProps> = (args) => {
	const [value, setValue] = useState<string | null>(null);
	return (
		<AsyncSelect
			{...args}
			value={value}
			onChange={(v) => setValue(v as string | null)}
		/>
	);
};

export const Base = Template.bind({});
Base.args = {
	label: "User",
	placeholder: "Search for a user...",
	loadOptions: fakeFetch,
};

export const SlowDebounce = Template.bind({});
SlowDebounce.args = {
	label: "User (800ms debounce)",
	loadOptions: fakeFetch,
	debounce: 800,
};

export const WithError = Template.bind({});
WithError.args = {
	label: "User",
	loadOptions: fakeFetch,
	error: "Selection required",
};
