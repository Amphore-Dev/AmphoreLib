// stories for FiltersModal component
import React, { useState } from "react";

import { Meta, StoryFn } from "@storybook/react";
import { TFilterModalFilter } from "types";

import { FiltersModal } from "./FiltersModal";
import {
	MOCKED_FILTERMODAL_FILTERS,
	MockedFiltersContextOptions,
	multiColumnFilters,
	sampleFilters,
	TMockedFilters,
} from "@components/Mocks/FiltersModal/MFiltersModal";
import { createFiltersContext } from "@contexts/index";

export default {
	title: "Components/Organisms/FiltersModal",
	component: FiltersModal,
} as Meta<typeof FiltersModal>;

const { Provider: FiltersProvider, useFiltersContext } =
	createFiltersContext<TMockedFilters>();

const CustomFilterRenderer = ({ value, label }: TFilterModalFilter) => (
	<div>
		<strong>{label}:</strong> {value || "N/A"}
	</div>
);

const Template: StoryFn = (args) => {
	return (
		<FiltersProvider
			defaultFilters={MOCKED_FILTERMODAL_FILTERS}
			fieldRenderers={{
				custom: CustomFilterRenderer,
			}}
		>
			<StoryBody {...args} />
		</FiltersProvider>
	);
};

const StoryBody = (args) => {
	const context = useFiltersContext("users", MockedFiltersContextOptions);

	return (
		<div className="p-4 bg-neutral-50">
			<FiltersModal
				filters={sampleFilters}
				filtersContext={context}
				{...args}
			/>
		</div>
	);
};

export const Default = Template.bind({});
Default.args = {
	displayGroupTitles: false,
	filters: sampleFilters,
};

export const MultiColumn = Template.bind({});
MultiColumn.args = {
	filters: multiColumnFilters,
	columns: 2,
};

export const AsyncSubmission = Template.bind({});
AsyncSubmission.args = {
	onApply: (filters) =>
		new Promise((resolve) => {
			setTimeout(() => {
				resolve(true);
			}, 2000);
		}),
};

export const WithDefaultValuesOnReset = Template.bind({});
WithDefaultValuesOnReset.args = {
	defaultValues: {
		status: {
			label: "Active",
			value: "active",
		},
		isOut: false,
		mobility: ["remote"],
	},
};

export const WithCustomModalSize = Template.bind({});
WithCustomModalSize.args = {
	modalSize: "l",
};
