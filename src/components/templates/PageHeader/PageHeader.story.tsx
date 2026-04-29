// stories for PageHeader component
import React from "react";

import { createFiltersContext } from "@contexts/FiltersContext/FiltersContext";
import type { Meta, StoryObj } from "@storybook/react";
import { FormikProps } from "formik";

import { TFiltersModalGroup } from "@interfaces/TFiltersModal";

import { IPageHeaderProps, PageHeader } from "./PageHeader";
import {
	MOCKED_FILTERMODAL_FILTERS,
	MockedFiltersContextOptions,
	sampleFilters,
	TMockedFilters,
} from "@components/Mocks/FiltersModal/MFiltersModal";
import { Tag } from "@components/atoms";

export default {
	title: "Components/Templates/PageHeader",
	component: PageHeader,
	args: {
		onBackLabel: undefined,
	},
} as Meta<typeof PageHeader>;

const ESTABLISHMENT_TYPE_OPTIONS = [
	{ label: "Type A", value: "type_a" },
	{ label: "Type B", value: "type_b" },
];

const establishmentSampleFilters = (
	ctx: FormikProps<any>
): TFiltersModalGroup[] => [
	{
		fields: [
			{
				name: "name",
				type: "input",
				label: "Establishment Name",
			},
			{
				name: "type",
				type: "select",
				label: "Establishment Type",
				options: ESTABLISHMENT_TYPE_OPTIONS,
				value:
					ESTABLISHMENT_TYPE_OPTIONS.find(
						(option) => option.value === ctx.values?.type
					) || null,
			},
		],
	},
];

const { Provider: FiltersProvider, useFiltersContext } =
	createFiltersContext<TMockedFilters>();

/**
 * Wrapper: ne fait que fournir le Provider
 */
const withFiltersProvider =
	(render: (args: IPageHeaderProps) => React.ReactElement) =>
	(args: IPageHeaderProps) => (
		<FiltersProvider defaultFilters={MOCKED_FILTERMODAL_FILTERS}>
			<div className="p-4 rounded-xl bg-[#f9f9f9]">{render(args)}</div>
		</FiltersProvider>
	);

export const Default: StoryObj<IPageHeaderProps> = {
	render: withFiltersProvider((args) => <PageHeader {...args} />),
	args: {
		title: "Page Title",
		totalCount: 42,
		isLoading: false,
		buttons: [
			{
				label: "Add New",
				onClick: () => alert("Add New clicked"),
			},
		],
		secondaryButtons: [
			{
				label: "Secondary Action",
				onClick: () => alert("Secondary Action clicked"),
				color: "white",
			},
		],
		searchValue: "",
		onSearchChange: (value) => console.info("Search changed:", value),
	},
};

const WithFilterComponent = (args: IPageHeaderProps) => {
	const filtersContext = useFiltersContext(
		"users",
		MockedFiltersContextOptions
	);

	return (
		<PageHeader
			{...args}
			filtersContext={filtersContext}
			filters={sampleFilters}
			// 	onBack: () => alert("Back clicked"),
			// onBackLabel: undefined,
			onBack={() => alert("Back clicked")}
		/>
	);
};

export const WithFilters: StoryObj<IPageHeaderProps> = {
	render: withFiltersProvider((args) => {
		// ✅ hook appelé dans un composant rendu sous le Provider
		return <WithFilterComponent {...args} />;
	}),
	args: {
		title: "Page Title with Filters",
		totalCount: 100,
		isLoading: false,
		buttons: [
			{
				label: "Add New",
				onClick: () => alert("Add New clicked"),
			},
		],
		secondaryButtons: [
			{
				label: "Secondary Action",
				onClick: () => alert("Secondary Action clicked"),
				color: "white",
			},
		],
		searchValue: "",
		onSearchChange: (value) => console.info("Search changed:", value),
	},
};

export const WithAsyncFiltersSubmission: StoryObj<IPageHeaderProps> = {
	render: withFiltersProvider((args) => {
		// ✅ hook appelé dans un composant rendu sous le Provider
		return <WithFilterComponent {...args} />;
	}),
	args: {
		title: "Page Title with Filters",
		totalCount: 100,
		isLoading: false,
		buttons: [
			{
				label: "Add New",
				onClick: () => alert("Add New clicked"),
			},
		],
		searchValue: "",
		onSearchChange: (value) => console.info("Search changed:", value),
		onFiltersChange: (filters) =>
			new Promise((resolve) => {
				setTimeout(() => {
					resolve(true);
				}, 2000);
			}),
	},
};

export const WithTabs: StoryObj<IPageHeaderProps> = {
	render: withFiltersProvider((args) => {
		const [ActiveTab, setActiveTab] = React.useState<any>();
		return (
			<WithFilterComponent
				{...args}
				onSelectTab={setActiveTab}
				selectedTabId={ActiveTab}
			/>
		);
	}),
	args: {
		title: "Page Title with Tabs and commons Filters",
		totalCount: 75,
		isLoading: false,
		buttons: [
			{
				label: "Add New",
				onClick: () => alert("Add New clicked"),
			},
		],
		searchValue: "",
		onSearchChange: (value) => console.info("Search changed:", value),
		tabs: [
			{ id: "tab1", label: "Tab One" },
			{ id: "tab2", label: "Tab Two" },
			{ id: "tab3", label: "Tab Three", hidden: true },
		],
	},
};

const WithFilterAndTabComponent = (args: IPageHeaderProps) => {
	const usersFiltersContext = useFiltersContext("users", {
		defaultValues: {
			search: "",
		},
		countCallback: (filters) => {
			let count = 0;
			if (filters.status) count++;
			if (filters.location) count++;
			if (filters.createdFrom || filters.createdTo) count++;

			return count;
		},
	});

	const establishmentFiltersContext = useFiltersContext("establishments", {
		defaultValues: {
			name: null,
			type: null,
		},
		countCallback: (filters) => {
			let count = 0;
			if (filters.name) count++;
			if (filters.type) count++;

			return count;
		},
	});

	return (
		<PageHeader
			{...args}
			tabs={[
				{
					id: "users",
					label: "Users",
					filtersContext: usersFiltersContext,
					filters: sampleFilters,
					searchValue: usersFiltersContext.filters.search,
					onSearchChange: (value) => {
						usersFiltersContext.setFilter("search", value || "");
					},
					buttons: [
						{
							label: "Export Users",
							onClick: () => alert("Export Users clicked"),
						},
					],
				},
				{
					id: "establishments",
					label: "Establishments",
					filtersContext: establishmentFiltersContext,
					filters: establishmentSampleFilters,
					searchValue: establishmentFiltersContext.filters.search,
					onSearchChange: (value) => {
						establishmentFiltersContext.setFilter(
							"search",
							value || ""
						);
					},
					buttons: [
						{
							label: "Export Establishments",
							onClick: () =>
								alert("Export Establishments clicked"),
						},
					],
				},
			]}
		/>
	);
};

export const WithTabsAndFilters: StoryObj<IPageHeaderProps> = {
	render: withFiltersProvider((args) => {
		const [ActiveTab, setActiveTab] = React.useState<any>();

		return (
			<WithFilterAndTabComponent
				{...args}
				onSelectTab={setActiveTab}
				selectedTabId={ActiveTab}
			/>
		);
	}),
	args: {
		title: "Page Title with Tabs and Filters",
		totalCount: 150,
		isLoading: false,
	},
};

export const CustomSearchProps: StoryObj<IPageHeaderProps> = {
	render: withFiltersProvider((args) => <PageHeader {...args} />),
	args: {
		title: "Page Title with Custom Search Props",
		totalCount: 42,
		isLoading: false,
		searchValue: "",
		onSearchChange: (value) => console.info("Search changed:", value),
		searchInputProps: {
			placeholder: "Custom placeholder...",
			debounced: true,
			delay: 300,
			minLength: 2,
		},
	},
};

export const WithTabsButNoFilters: StoryObj<IPageHeaderProps> = {
	render: withFiltersProvider((args) => {
		const [ActiveTab, setActiveTab] = React.useState<any>();
		return (
			<PageHeader
				{...args}
				onSearchChange={undefined}
				onSelectTab={setActiveTab}
				selectedTabId={ActiveTab}
			/>
		);
	}),
	args: {
		title: "Page Title with Tabs but no Filters",
		totalCount: 75,
		isLoading: false,
		tabs: [
			{ id: "tab1", label: "Tab One" },
			{ id: "tab2", label: "Tab Two" },
			{ id: "tab3", label: "Tab Three" },
		],
	},
};

export const WWithTabsAndButtonsButNoFilters: StoryObj<IPageHeaderProps> = {
	render: withFiltersProvider((args) => {
		const [ActiveTab, setActiveTab] = React.useState<any>();
		return (
			<PageHeader
				{...args}
				onSearchChange={undefined}
				onSelectTab={setActiveTab}
				selectedTabId={ActiveTab}
			/>
		);
	}),
	args: {
		title: "Page Title with Tabs, Buttons but no Filters",
		totalCount: 75,
		isLoading: false,
		tabs: [
			{
				id: "tab1",
				label: "Tab One",
				buttons: [
					{
						label: "Button 1",
						onClick: () => alert("Button 1 clicked"),
					},
				],
			},
			{
				id: "tab2",
				label: "Tab Two",
				buttons: [
					{
						label: "Button 2",
						onClick: () => alert("Button 2 clicked"),
					},
				],
			},
			{
				id: "tab3",
				label: "Tab Three",
				buttons: [
					{
						label: "Button 3",
						onClick: () => alert("Button 3 clicked"),
					},
				],
			},
		],
	},
};

export const WithButtons = {
	render: withFiltersProvider((args) => <PageHeader {...args} />),
	args: {
		title: "Page Title with Buttons",
		totalCount: 42,
		isLoading: false,
		secondaryButtons: [
			{
				label: "Secondary Action",
				onClick: () => alert("Secondary Action clicked"),
				color: "white",
			},
		],
		buttons: [
			{
				label: "Add New User sheet",
				onClick: () => alert("Add New clicked"),
			},
			{
				label: "Export",
				onClick: () => alert("Export clicked"),
			},
		],
		filters: sampleFilters,
	},
};

export const WithCustomTitle = {
	render: withFiltersProvider((args) => <PageHeader {...args} />),
	args: {
		title: (
			<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
				<span>Custom Title</span>
				<span role="img" aria-label="star">
					⭐
				</span>
			</div>
		),
		totalCount: 42,
		isLoading: false,
	},
};

export const WithTitleAfter = {
	render: withFiltersProvider((args) => <PageHeader {...args} />),
	args: {
		title: "Page Title",
		titleAfter: (
			<Tag size="medium" picto="heritage">
				Tag After Title
			</Tag>
		),
		totalCount: 42,
		isLoading: false,
	},
};
