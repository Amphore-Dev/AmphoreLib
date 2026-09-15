import React, { useState } from "react";

import { colorArgType, pictoArgType, sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { ISelectProps, Select } from "./Select";

const OPTIONS = [
	{ value: "day", label: "Day" },
	{ value: "week", label: "Week" },
	{ value: "month", label: "Month" },
	{ value: "quarter", label: "Quarter", disabled: true },
	{ value: "year", label: "Year" },
];

export default {
	title: "Components/Molecules/Select",
	component: Select,
	argTypes: {
		size: sizeArgType,
		color: colorArgType,
		picto: pictoArgType,
		disabled: { control: { type: "boolean" } },
		searchable: { control: { type: "boolean" } },
		isClearable: { control: { type: "boolean" } },
		isLoading: { control: { type: "boolean" } },
		loadingMessage: { control: "text" },
		clearLabel: { control: "text" },
	},
};

// Single-value template — used by every story below except Multiple, whose
// value type (T[]) differs enough to warrant its own small template.
const Template: StoryFn<ISelectProps<string>> = (args) => {
	const [value, setValue] = useState<string | null>(
		(args.value as string) ?? null
	);
	return (
		<Select
			{...args}
			options={args.options ?? OPTIONS}
			value={value}
			onChange={(v) => setValue(v as string | null)}
		/>
	);
};

export const Base = Template.bind({});
Base.args = {
	label: "Display",
	placeholder: "Choose a period",
};

export const Searchable = Template.bind({});
Searchable.args = {
	label: "Display",
	value: "week",
	searchable: true,
};

export const WithPicto = Template.bind({});
WithPicto.args = {
	label: "Display",
	placeholder: "Choose a period",
	picto: "calendar",
};

export const Clearable = Template.bind({});
Clearable.args = {
	label: "Display",
	value: "month",
	isClearable: true,
};

const MultiTemplate: StoryFn<ISelectProps<string>> = (args) => {
	const [value, setValue] = useState<string[]>(
		(args.value as string[]) ?? []
	);
	return (
		<Select
			{...args}
			options={args.options ?? OPTIONS}
			value={value}
			onChange={(v) => setValue(v as string[])}
			multiple
		/>
	);
};

export const Multiple = MultiTemplate.bind({});
Multiple.args = {
	label: "Business days",
	value: ["day", "week"],
	isClearable: true,
};

export const Loading = Template.bind({});
Loading.args = {
	label: "Display",
	searchable: true,
	isLoading: true,
};

export const WithError = Template.bind({});
WithError.args = {
	label: "Display",
	error: "This field is required",
};

export const Disabled = Template.bind({});
Disabled.args = {
	label: "Display",
	value: "week",
	disabled: true,
};

type TCompany = { id: string; name: string; color: string };

const COMPANIES: TCompany[] = [
	{ id: "1", name: "Acme Corp", color: "#e2673f" },
	{ id: "2", name: "Globex", color: "#3f7fe2" },
	{ id: "3", name: "Initech", color: "#3fe293" },
];

const companyOptions = COMPANIES.map((company) => ({
	value: company,
	label: company.name,
}));

// T doesn't have to be a bare primitive — the option's `value` can be the
// whole underlying object, which `renderOption` then has full access to
// (here, a color swatch alongside the name) beyond the plain string label
// every other story uses.
export const WithRenderOption: StoryFn = () => {
	const [value, setValue] = useState<TCompany | null>(COMPANIES[0]);
	return (
		<Select
			label="Company"
			options={companyOptions}
			value={value}
			onChange={(v) => setValue(v as TCompany | null)}
			renderOption={(option) => (
				<span
					style={{
						display: "flex",
						alignItems: "center",
						gap: "0.5rem",
					}}
				>
					<span
						style={{
							display: "inline-block",
							width: "0.75rem",
							height: "0.75rem",
							borderRadius: "50%",
							background: option.value.color,
							flexShrink: 0,
						}}
					/>
					{option.label}
				</span>
			)}
		/>
	);
};

// The current value is a DIFFERENT object reference than its matching
// option (simulating a value that came from elsewhere — a form's initial
// state, say — rather than from this Select's own options) — click
// "Replay with a new reference" to see it still resolve correctly.
// Without getOptionValue, this reference mismatch would show as no value
// selected at all, even though it's "the same" company by id.
export const WithGetOptionValue: StoryFn = () => {
	const [value, setValue] = useState<TCompany>({ ...COMPANIES[0] });
	return (
		<div
			style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
		>
			<Select
				label="Company"
				options={companyOptions}
				value={value}
				onChange={(v) => setValue(v as TCompany)}
				getOptionValue={(company) => company.id}
			/>
			<button
				type="button"
				onClick={() => setValue({ ...COMPANIES[0] })}
				style={{ alignSelf: "flex-start" }}
			>
				Replay with a new reference (same id)
			</button>
		</div>
	);
};

const GROUPED_OPTIONS = [
	{
		label: "Calendars",
		options: [
			{ value: "cal-1", label: "Personal calendar" },
			{ value: "cal-2", label: "Team calendar" },
		],
	},
	{
		label: "Projects",
		options: [
			{ value: "proj-1", label: "Marketing site" },
			{ value: "proj-2", label: "Mobile app" },
		],
	},
];

// A grouped search-like result list — each group gets a heading (here
// showing a count via renderGroupHeader), and a "see more" footer sits
// once at the very end of the listbox, outside any group and never part
// of keyboard navigation/selection.
export const GroupedWithFooter: StoryFn = () => {
	const [value, setValue] = useState<string | null>(null);
	return (
		<Select
			label="Search"
			searchable
			options={GROUPED_OPTIONS}
			value={value}
			onChange={(v) => setValue(v as string | null)}
			renderGroupHeader={(group) => (
				<span
					style={{
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					{group.label}
					<span>{group.options.length}</span>
				</span>
			)}
			footer={
				<div style={{ padding: "0.5rem 0.75rem" }}>
					<a href="#">See all results</a>
				</div>
			}
		/>
	);
};

// The "search and act" pattern (a global search bar, say): `value` stays
// permanently null — picking a result navigates/acts instead of being
// "kept selected" — and clearInputOnSelect resets the typed query so
// reopening (without retyping) shows every option again, not still
// filtered by whatever was last searched.
export const SearchAndAct: StoryFn = () => {
	const [picked, setPicked] = useState<string | null>(null);
	return (
		<div
			style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
		>
			<Select<string>
				label="Search"
				placeholder="Search..."
				searchable
				clearInputOnSelect
				options={OPTIONS}
				value={null}
				onChange={(v) => setPicked(v as string | null)}
			/>
			{picked && <p>Last result picked: {picked}</p>}
		</div>
	);
};

export const DefaultSizeFromConfig = () => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			gap: "1rem",
			maxWidth: 280,
		}}
	>
		<AmphoreProvider config={{ defaults: { size: "sm" } }}>
			<Select
				label="defaults.size: sm (no size)"
				options={OPTIONS}
				onChange={() => {}}
			/>
		</AmphoreProvider>
		<AmphoreProvider config={{ defaults: { size: "lg" } }}>
			<Select
				label="defaults.size: lg (no size)"
				options={OPTIONS}
				onChange={() => {}}
			/>
			{/* An explicit size prop still wins over the config default. */}
			<Select
				label='defaults.size: lg, size="sm" explicit'
				options={OPTIONS}
				size="sm"
				onChange={() => {}}
			/>
		</AmphoreProvider>
	</div>
);
