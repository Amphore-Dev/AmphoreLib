import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { makeSampleImageFile } from "@components/atoms/DocumentPreview/sampleImageFile";

import { EditableCard, IEditableCardProps } from "./EditableCard";

export default {
	title: "Components/Organisms/EditableCard",
	component: EditableCard,
	argTypes: {
		title: { control: "text" },
		readOnly: { control: { type: "boolean" } },
		hideEditButton: { control: { type: "boolean" } },
		editInModal: { control: { type: "boolean" } },
		defaultIsEditing: { control: { type: "boolean" } },
		disableFields: { control: { type: "boolean" } },
		addOnEmptyValue: { control: { type: "boolean" } },
		formikWrapper: { control: { type: "boolean" } },
		mergeGroupsForDisplay: { control: { type: "boolean" } },
		displayRequiredAsterisk: { control: { type: "boolean" } },
		columns: { control: "number" },
		editColumns: { control: "number" },
		editItemsColumns: { control: "number" },
		editLabel: { control: "text" },
		addLabel: { control: "text" },
		showResetFieldButton: { control: { type: "boolean" } },
		showFieldLabels: { control: { type: "boolean" } },
		// Data-driven/callback props — same convention as Select/Table: no
		// control for `fields`/`values`/`onSubmit`/etc, only the genuinely
		// controllable primitives above get one.
		fields: { control: false },
		values: { control: false },
		onSubmit: { control: false },
		onCancel: { control: false },
		onClickOnEdit: { control: false },
		formikCtx: { control: false },
		setFieldValue: { control: false },
		defaultValues: { control: false },
		validationSchema: { control: false },
		modalProps: { control: false },
		displayGridProps: { control: false },
		wrapperGridProps: { control: false },
		actions: { control: false },
	},
};

const fields = [
	{ name: "name", type: "input" as const, label: "Name" },
	{ name: "email", type: "input" as const, label: "Email" },
	{ name: "bio", type: "textarea" as const, label: "Bio" },
];

const Template: StoryFn<IEditableCardProps> = (args) => {
	const [values, setValues] = useState(args.values ?? {});
	return (
		<EditableCard
			{...args}
			values={values}
			onSubmit={(next) => setValues(next)}
		/>
	);
};

export const Default = Template.bind({});
Default.args = {
	title: "Profile",
	fields,
	values: { name: "Jane Doe", email: "jane@example.com", bio: "" },
};

export const InlineEditing = Template.bind({});
InlineEditing.args = {
	title: "Profile (inline editing)",
	fields,
	values: { name: "Jane Doe", email: "" },
	editInModal: false,
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
	title: "Profile (read-only)",
	fields,
	values: { name: "Jane Doe", email: "", bio: "" },
	readOnly: true,
};

export const MultiColumnDisplay = Template.bind({});
MultiColumnDisplay.args = {
	title: "Record (3 columns)",
	fields: [
		{ name: "name", type: "input", label: "Name" },
		{ name: "email", type: "input", label: "Email" },
		{ name: "phone", type: "input", label: "Phone" },
		{ name: "city", type: "input", label: "City" },
		{ name: "role", type: "input", label: "Role" },
		{ name: "team", type: "input", label: "Team" },
	],
	values: {
		name: "Jane Doe",
		email: "jane@example.com",
		phone: "(555) 123-4567",
		city: "Portland",
		role: "Developer",
		team: "Platform",
	},
};

export const WithGroups = Template.bind({});
WithGroups.args = {
	title: "Profile (grouped)",
	fields: [
		{
			title: "Identity",
			fields: [
				{ name: "name", type: "input", label: "Name" },
				{ name: "email", type: "input", label: "Email" },
			],
		},
		{
			title: "Details",
			fields: [{ name: "bio", type: "textarea", label: "Bio" }],
		},
	],
	values: { name: "Jane Doe", email: "jane@example.com", bio: "" },
	mergeGroupsForDisplay: false,
	editColumns: 2,
};

// Realistic multi-group case (mirrors a real caller: company info split
// into identity/address/legal blocks) with enough fields per group and a
// low column count to make the *shape* of `mergeGroupsForDisplay={false}`
// obvious — each group should read as its own horizontal block (one row
// per field, wrapping at `columns`), not get squeezed into its own
// vertical column next to the others.
const companyLikeGroups = [
	{
		title: "Identity",
		fields: [
			{ name: "name", type: "input" as const, label: "Name" },
			{ name: "email", type: "input" as const, label: "Email" },
			{ name: "phone", type: "input" as const, label: "Phone" },
			{ name: "website", type: "input" as const, label: "Website" },
		],
	},
	{
		title: "Address",
		fields: [
			{ name: "address", type: "input" as const, label: "Address" },
			{
				name: "addressExtra",
				type: "input" as const,
				label: "Address line 2",
			},
			{
				name: "postalCode",
				type: "input" as const,
				label: "ZIP code",
			},
			{ name: "city", type: "input" as const, label: "City" },
			{ name: "country", type: "input" as const, label: "Country" },
		],
	},
	{
		title: "Legal",
		fields: [
			{ name: "ein", type: "input" as const, label: "EIN" },
			{
				name: "vatNumber",
				type: "input" as const,
				label: "VAT number",
			},
		],
	},
];

const companyLikeValues = {
	name: "Acme Studio",
	email: "contact@acme.example.com",
	phone: "+1 555 123 4567",
	website: "https://acme.example.com",
	address: "1 Peace Street",
	addressExtra: "Building B",
	postalCode: "10002",
	city: "New York",
	country: "United States",
	ein: "123456789",
	vatNumber: "US12345678901",
};

export const GroupsSeparated = Template.bind({});
GroupsSeparated.args = {
	title: "Company (separate groups)",
	fields: companyLikeGroups,
	values: companyLikeValues,
	mergeGroupsForDisplay: false,
	editColumns: 2,
};

export const GroupsMerged = Template.bind({});
GroupsMerged.args = {
	...GroupsSeparated.args,
	title: "Company (merged groups)",
	mergeGroupsForDisplay: true,
};

// Both side by side, same data/columns, only `mergeGroupsForDisplay`
// differs — the two should NOT look alike. If they do (or if
// GroupsSeparated reads as 3 vertical columns instead of 3 horizontal
// blocks stacked one under another), that's the display-mode grouping bug.
export const GroupsMergedVsSeparated: StoryFn<IEditableCardProps> = (args) => {
	const [merged, setMerged] = useState(companyLikeValues);
	const [separated, setSeparated] = useState(companyLikeValues);
	return (
		<>
			<div>
				<p>
					<strong>mergeGroupsForDisplay: true</strong>
				</p>
				<EditableCard
					{...args}
					title="Merged"
					fields={companyLikeGroups}
					values={merged}
					onSubmit={(next) => setMerged(next)}
					mergeGroupsForDisplay
				/>
			</div>
			<div>
				<p>
					<strong>mergeGroupsForDisplay: false</strong>
				</p>
				<EditableCard
					{...args}
					title="Separated"
					fields={companyLikeGroups}
					values={separated}
					onSubmit={(next) => setSeparated(next)}
					mergeGroupsForDisplay={false}
				/>
			</div>
		</>
	);
};

// Many single-field groups (one field each) at a few different `columns`
// values — the extreme case for spotting whether a group ever leaks into
// its neighbour's row/column, or whether one field per group still wraps
// correctly instead of forcing one group per column.
export const ManySingleFieldGroups = Template.bind({});
ManySingleFieldGroups.args = {
	title: "Many small groups",
	fields: Array.from({ length: 8 }, (_, i) => ({
		title: `Group ${i + 1}`,
		fields: [
			{
				name: `field${i}`,
				type: "input" as const,
				label: `Field ${i + 1}`,
			},
		],
	})),
	values: Object.fromEntries(
		Array.from({ length: 8 }, (_, i) => [`field${i}`, `Value ${i + 1}`])
	),
	mergeGroupsForDisplay: false,
};

export const WithFieldResetButtons = Template.bind({});
WithFieldResetButtons.args = {
	title: "Profile (per-field reset)",
	fields,
	values: { name: "Jane Doe", email: "jane@example.com", bio: "" },
	defaultValues: { name: "", email: "", bio: "" },
	editInModal: false,
	showResetFieldButton: true,
};

// One of each field type not already covered above (input/textarea) — a
// broader smoke test of both EditableCard's display mode (SummaryListItem
// per type) and its edit form (FieldRenderer per type).
export const AllFieldTypes = Template.bind({});
AllFieldTypes.args = {
	title: "Contract (all types)",
	fields: [
		{
			name: "name",
			type: "input",
			label: "Name",
		},
		{
			name: "role",
			type: "select",
			label: "Role",
			options: [
				{ label: "Developer", value: "dev" },
				{ label: "Designer", value: "design" },
			],
		},
		// date/toggle/checkbox/file below have no `valueDisplay` of their
		// own — EditableCard now has a sane per-type default display for
		// exactly these (see getDefaultValueDisplay in UFormGroups.ts):
		// without it, `startDate`'s raw `Date` would crash the display mode
		// (not a valid React child at all), and `remote`'s raw boolean
		// would silently render as nothing.
		{ name: "startDate", type: "date", label: "Start date" },
		{ name: "weeklyHours", type: "number", label: "Hours / week" },
		{ name: "remote", type: "toggle", label: "Remote" },
		{
			name: "contractType",
			type: "radio",
			label: "Contract type",
			options: [
				{ label: "Permanent", value: "permanent" },
				{ label: "Fixed-term", value: "fixed-term" },
			],
		},
		{
			name: "benefits",
			type: "checkbox",
			label: "Benefits",
			options: [
				{ label: "Health insurance", value: "health" },
				{ label: "Meal vouchers", value: "meal" },
			],
		},
		{ name: "contract", type: "file", label: "Signed contract" },
		{ name: "favoriteColor", type: "color", label: "Favorite color" },
	],
	values: {
		role: "dev",
		startDate: new Date(2026, 2, 1),
		weeklyHours: 35,
		remote: true,
		contractType: "permanent",
		benefits: ["health"],
		contract: [makeSampleImageFile("signed-contract.jpg")],
		favoriteColor: "#ff0000",
	},
};
