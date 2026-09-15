import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { IUseFiltersContext, TField } from "@interfaces/index";

import { FiltersModal, IFiltersModalProps } from "./FiltersModal";

export default {
	title: "Components/Organisms/FiltersModal",
	component: FiltersModal,
	argTypes: {
		title: { control: "text" },
		displayGroupTitles: { control: { type: "boolean" } },
		columns: { control: "number" },
		modalSize: { control: "radio", options: ["sm", "md", "lg"] },
		buttonLabel: { control: "text" },
		applyLabel: { control: "text" },
		resetLabel: { control: "text" },
		// Data-driven/complex props — the Template drives filters/
		// filtersContext itself.
		filters: { control: false },
		filtersContext: { control: false },
		onReset: { control: false },
		onApply: { control: false },
		fieldsRenderers: { control: false },
		defaultValues: { control: false },
		buttonProps: { control: false },
	},
};

type TSlice = {
	status?: string | null;
	search?: string;
	isUrgent?: boolean;
	tags?: string[];
	createdFrom?: Date | null;
	createdTo?: Date | null;
};
type T = { list: TSlice };

// One of each field type, not just `input` — a filters modal is the most
// common place FieldRenderer's full type -> component map gets exercised
// in a real app.
const filterFields: TField[] = [
	{
		name: "status",
		type: "select",
		label: "Status",
		options: [
			{ label: "Open", value: "open" },
			{ label: "Closed", value: "closed" },
		],
	},
	{ name: "search", type: "input", label: "Search" },
	{ name: "isUrgent", type: "toggle", label: "Urgent only" },
	{
		name: "tags",
		type: "checkbox",
		label: "Tags",
		options: [
			{ label: "Urgent", value: "urgent" },
			{ label: "Follow-up", value: "review" },
		],
	},
	{
		name: "createdPeriod",
		type: "period",
		label: "Created between",
		from: { name: "createdFrom" },
		to: { name: "createdTo" },
	},
];

const makeFiltersContext = (
	filters: TSlice,
	setFiltersState: React.Dispatch<React.SetStateAction<TSlice>>
): IUseFiltersContext<T, "list", TSlice> => ({
	filters,
	filtersKey: "list",
	setFilters: (next) => setFiltersState(next),
	setFilter: (key, value) =>
		setFiltersState((prev) => ({ ...prev, [key]: value })),
	getPagination: () => ({}),
	setPagination: () => {},
	count: Object.values(filters).filter((v) =>
		Array.isArray(v) ? v.length : !!v
	).length,
	setCount: () => {},
	getParams: () => ({}),
	getQueryKeys: () => [],
	options: {
		countCallback: (f) =>
			Object.values(f).filter((v) => (Array.isArray(v) ? v.length : !!v))
				.length,
		defaultValues: {},
	},
});

const Template: StoryFn<IFiltersModalProps<T, "list", TSlice>> = (args) => {
	const [filters, setFiltersState] = useState<TSlice>({});

	return (
		<FiltersModal
			{...args}
			filtersContext={makeFiltersContext(filters, setFiltersState)}
			filters={filterFields}
		/>
	);
};

export const Default = Template.bind({});
Default.args = {};

export const TwoColumns = Template.bind({});
TwoColumns.args = { columns: 2 };

export const CustomLabels = Template.bind({});
CustomLabels.args = {
	title: "Filter orders",
	buttonLabel: "Filters",
	applyLabel: "Search",
	resetLabel: "Clear all",
};

export const PrefilledFilters: StoryFn<
	IFiltersModalProps<T, "list", TSlice>
> = (args) => {
	const [filters, setFiltersState] = useState<TSlice>({
		status: "open",
		search: "order",
		isUrgent: true,
		tags: ["urgent"],
	});

	return (
		<FiltersModal
			{...args}
			filtersContext={makeFiltersContext(filters, setFiltersState)}
			filters={filterFields}
			columns={2}
		/>
	);
};
