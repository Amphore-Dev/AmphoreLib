import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { IUseFiltersContext, TFiltersModalGroup } from "@interfaces/index";

import { ActiveFilters, IActiveFiltersProps } from "./ActiveFilters";

export default {
	title: "Components/Organisms/ActiveFilters",
	component: ActiveFilters,
	argTypes: {
		className: { control: "text" },
		resetLabel: { control: "text" },
		showMoreLabel: { control: "text" },
		showLessLabel: { control: "text" },
		// Data-driven/complex props — the Template drives filters/filtersContext
		// itself, and clearFieldsOnReset/countLabel/periodLabel/rightContent
		// aren't meaningfully editable as Storybook controls.
		filters: { control: false },
		filtersContext: { control: false },
		clearFieldsOnReset: { control: false },
		rightContent: { control: false },
		countLabel: { control: false },
		periodLabel: { control: false },
	},
};

type TSlice = {
	status?: string | null;
	tags?: string[];
	from?: string | null;
	to?: string | null;
};
type T = { list: TSlice };

const filterGroups: TFiltersModalGroup[] = [
	{
		fields: [
			{ name: "status", type: "select", label: "Status", options: [] },
			{ name: "tags", type: "checkbox", label: "Tags", options: [] },
		],
	},
];

const Template: StoryFn<IActiveFiltersProps<T, "list", TSlice>> = (args) => {
	const [filters, setFiltersState] = useState<TSlice>({
		status: "open",
		tags: ["urgent", "review"],
	});

	const filtersContext: IUseFiltersContext<T, "list", TSlice> = {
		filters,
		filtersKey: "list",
		setFilters: (next) => setFiltersState(next),
		setFilter: (key, value) =>
			setFiltersState((prev) => ({ ...prev, [key]: value })),
		getPagination: () => ({}),
		setPagination: () => {},
		count: Object.keys(filters).length,
		setCount: () => {},
		getParams: () => ({}),
		getQueryKeys: () => [],
		options: {
			countCallback: (f) =>
				Object.values(f).filter((v) =>
					Array.isArray(v) ? v.length : !!v
				).length,
			defaultValues: {},
		},
	};

	return (
		<ActiveFilters
			{...args}
			filters={filterGroups}
			filtersContext={filtersContext}
		/>
	);
};

export const Default = Template.bind({});
Default.args = {};

export const WithRightContent = Template.bind({});
WithRightContent.args = {
	rightContent: <span>Actions on the right</span>,
};

export const Empty: StoryFn<IActiveFiltersProps<T, "list", TSlice>> = (
	args
) => {
	const filtersContext: IUseFiltersContext<T, "list", TSlice> = {
		filters: {},
		filtersKey: "list",
		setFilters: () => {},
		setFilter: () => {},
		getPagination: () => ({}),
		setPagination: () => {},
		count: 0,
		setCount: () => {},
		getParams: () => ({}),
		getQueryKeys: () => [],
		options: { countCallback: () => 0 },
	};
	// Renders nothing (no active filter, no rightContent) — confirms the
	// component doesn't leave an empty wrapper behind.
	return (
		<ActiveFilters
			{...args}
			filters={filterGroups}
			filtersContext={filtersContext}
		/>
	);
};

export const WithPeriodFilter: StoryFn<
	IActiveFiltersProps<T, "list", TSlice>
> = (args) => {
	// `period` gets its own chip-rendering branch in ActiveFilters (see
	// `filtersMap.period`): a single removable chip for the whole from/to
	// pair instead of one chip per raw key.
	const periodGroups: TFiltersModalGroup[] = [
		{
			fields: [
				{
					name: "status",
					type: "select",
					label: "Status",
					options: [],
				},
				{ name: "createdPeriod", type: "period", label: "Created" },
			],
		},
	];
	const [filters, setFiltersState] = useState<TSlice>({
		status: "open",
		from: "01/03/2026",
		to: "15/03/2026",
	});

	const filtersContext: IUseFiltersContext<T, "list", TSlice> = {
		filters,
		filtersKey: "list",
		setFilters: (next) => setFiltersState(next),
		setFilter: (key, value) =>
			setFiltersState((prev) => ({ ...prev, [key]: value })),
		getPagination: () => ({}),
		setPagination: () => {},
		count: 2,
		setCount: () => {},
		getParams: () => ({}),
		getQueryKeys: () => [],
		options: { countCallback: () => 2, defaultValues: {} },
	};

	return (
		<ActiveFilters
			{...args}
			filters={periodGroups}
			filtersContext={filtersContext}
		/>
	);
};

export const ManyFiltersOverflow: StoryFn<
	IActiveFiltersProps<T, "list", TSlice>
> = (args) => {
	const manyTags = Array.from({ length: 15 }, (_, i) => `tag-${i + 1}`);
	const [filters, setFiltersState] = useState<TSlice>({
		status: "open",
		tags: manyTags,
	});

	const filtersContext: IUseFiltersContext<T, "list", TSlice> = {
		filters,
		filtersKey: "list",
		setFilters: (next) => setFiltersState(next),
		setFilter: (key, value) =>
			setFiltersState((prev) => ({ ...prev, [key]: value })),
		getPagination: () => ({}),
		setPagination: () => {},
		count: 1 + manyTags.length,
		setCount: () => {},
		getParams: () => ({}),
		getQueryKeys: () => [],
		options: {
			countCallback: (f) =>
				Object.values(f).filter((v) =>
					Array.isArray(v) ? v.length : !!v
				).length,
			defaultValues: {},
		},
	};

	return (
		<div style={{ maxWidth: 500 }}>
			<ActiveFilters
				{...args}
				filters={filterGroups}
				filtersContext={filtersContext}
			/>
		</div>
	);
};
