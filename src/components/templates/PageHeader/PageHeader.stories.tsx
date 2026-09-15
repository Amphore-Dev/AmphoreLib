import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { IUseFiltersContext } from "@interfaces/index";

import { IPageHeaderProps, PageHeader } from "./PageHeader";

export default {
	title: "Components/Templates/PageHeader",
	component: PageHeader,
	argTypes: {
		title: { control: "text" },
		titleAfter: { control: false },
		isLoading: { control: { type: "boolean" } },
		totalCount: { control: "number" },
		countMessage: { control: "text" },
		loadingLabel: { control: "text" },
		onBackLabel: { control: "text" },
		actionsPosition: {
			control: "radio",
			options: ["aboveTabs", "underTabs"],
		},
		selectedTabId: { control: "text" },
		initialTabId: { control: "text" },
		className: { control: "text" },
		// Data-driven/complex/callback props — no meaningful Storybook control.
		actions: { control: false },
		buttons: { control: false },
		secondaryButtons: { control: false },
		tabs: { control: false },
		filters: { control: false },
		filtersContext: { control: false },
		fieldsRenderers: { control: false },
		onFiltersChange: { control: false },
		searchInputProps: { control: false },
		searchValue: { control: false },
		onSearchChange: { control: false },
		onBack: { control: false },
		onSelectTab: { control: false },
	},
};

const Template: StoryFn<IPageHeaderProps> = (args) => {
	const [search, setSearch] = useState("");
	return (
		<PageHeader
			{...args}
			searchValue={search}
			onSearchChange={setSearch}
			onBackLabel="Back"
		/>
	);
};

export const Default = Template.bind({});
Default.args = {
	title: "Orders",
	totalCount: 128,
	buttons: [{ label: "New order", color: "primary" }],
};

export const WithBackAndLoading = Template.bind({});
WithBackAndLoading.args = {
	title: "Order #1234",
	onBack: () => {},
	isLoading: true,
};

export const WithTabs: StoryFn<IPageHeaderProps> = (args) => {
	const [tab, setTab] = useState("open");
	return (
		<PageHeader
			{...args}
			tabs={[
				{ value: "open", label: "Open" },
				{ value: "closed", label: "Closed" },
			]}
			selectedTabId={tab}
			onSelectTab={setTab}
		/>
	);
};
WithTabs.args = { title: "Orders", totalCount: 42 };

export const TabsWithSharedActionsAbove: StoryFn<IPageHeaderProps> = (args) => {
	const [tab, setTab] = useState("open");
	return (
		<PageHeader
			{...args}
			actionsPosition="aboveTabs"
			tabs={[
				{ value: "open", label: "Open" },
				{ value: "closed", label: "Closed" },
			]}
			selectedTabId={tab}
			onSelectTab={setTab}
			buttons={[{ label: "New order", color: "primary" }]}
		/>
	);
};
TabsWithSharedActionsAbove.args = { title: "Orders", totalCount: 42 };

export const TabsWithPerTabActions: StoryFn<IPageHeaderProps> = (args) => {
	const [tab, setTab] = useState("open");
	return (
		<PageHeader
			{...args}
			tabs={[
				{
					value: "open",
					label: "Open",
					buttons: [{ label: "Follow up", color: "warning" }],
				},
				{
					value: "closed",
					label: "Closed",
					buttons: [{ label: "Archive", color: "neutral" }],
				},
			]}
			selectedTabId={tab}
			onSelectTab={setTab}
		/>
	);
};
TabsWithPerTabActions.args = { title: "Orders" };

type TSlice = { status?: string | null; isUrgent?: boolean };
type TFilters = { list: TSlice };

export const WithFiltersModal: StoryFn<IPageHeaderProps> = (args) => {
	const [filters, setFiltersState] = useState<TSlice>({});

	const filtersContext: IUseFiltersContext<TFilters, "list", TSlice> = {
		filters,
		filtersKey: "list",
		setFilters: (next) => setFiltersState(next),
		setFilter: (key, value) =>
			setFiltersState((prev) => ({ ...prev, [key]: value })),
		getPagination: () => ({}),
		setPagination: () => {},
		count: Object.values(filters).filter(Boolean).length,
		setCount: () => {},
		getParams: () => ({}),
		getQueryKeys: () => [],
		options: {
			countCallback: (f) => Object.values(f).filter(Boolean).length,
			defaultValues: {},
		},
	};

	return (
		<PageHeader
			{...args}
			filters={[
				{
					name: "status",
					type: "select",
					label: "Status",
					options: [
						{ label: "Open", value: "open" },
						{ label: "Closed", value: "closed" },
					],
				},
				{
					name: "isUrgent",
					type: "toggle",
					label: "Urgent only",
				},
			]}
			filtersContext={filtersContext}
		/>
	);
};
WithFiltersModal.args = { title: "Orders", totalCount: 12 };
