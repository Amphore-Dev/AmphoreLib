import React from "react";

import { StoryFn } from "@storybook/react";

import { TField, TFieldsGroup } from "@interfaces/index";

import {
	FormRendererWithFormik,
	IFormRendererWithFormikProps,
} from "./FormRenderer";

export default {
	title: "Components/Organisms/FormRenderer",
	component: FormRendererWithFormik,
	argTypes: {
		title: { control: "text" },
		displayGroupTitles: { control: { type: "boolean" } },
		groupBackground: { control: { type: "boolean" } },
		showResetFieldButton: { control: { type: "boolean" } },
		showFieldLabels: { control: { type: "boolean" } },
		disableFields: { control: { type: "boolean" } },
		resetFormButton: { control: { type: "boolean" } },
		columns: { control: "number" },
		inModal: { control: { type: "boolean" } },
		submitLabel: { control: "text" },
		cancelLabel: { control: "text" },
		resetLabel: { control: "text" },
		resetFormLabel: { control: "text" },
		// Data-driven/complex props — no meaningful Storybook control.
		fields: { control: false },
		initialValues: { control: false },
		defaultValues: { control: false },
		onSubmit: { control: false },
		onReset: { control: false },
		onClose: { control: false },
		formikCtx: { control: false },
		validationSchema: { control: false },
		modalProps: { control: false },
		wrapperGridProps: { control: false },
		fieldsRenderers: { control: false },
		setFieldValue: { control: false },
		disableSubmit: { control: false },
	},
};

const basicFields: TField[] = [
	{ name: "name", type: "input", label: "Name", required: true },
	{ name: "email", type: "input", label: "Email" },
	{ name: "bio", type: "textarea", label: "Bio" },
];

const groupedFields: TFieldsGroup[] = [
	{
		title: "Identity",
		fields: [
			{ name: "name", type: "input", label: "Name", required: true },
			{ name: "email", type: "input", label: "Email" },
		],
	},
	{
		title: "Preferences",
		columns: 2,
		fields: [
			{ name: "newsletter", type: "toggle", label: "Newsletter" },
			{ name: "brand", type: "color", label: "Brand colour" },
			{
				name: "role",
				type: "select",
				label: "Role",
				options: [
					{ label: "Admin", value: "admin" },
					{ label: "Reader", value: "reader" },
				],
			},
		],
	},
];

const Template: StoryFn<IFormRendererWithFormikProps> = (args) => (
	<FormRendererWithFormik {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
	fields: basicFields,
	initialValues: { name: "", email: "", bio: "" },
	onSubmit: () => {},
};

export const Groups = Template.bind({});
Groups.args = {
	fields: groupedFields,
	initialValues: {
		name: "",
		email: "",
		newsletter: false,
		brand: "#3663DD",
		role: "reader",
	},
	displayGroupTitles: true,
	groupBackground: true,
	columns: 2,
	onSubmit: () => {},
};

export const WithFieldResetButtons = Template.bind({});
WithFieldResetButtons.args = {
	fields: basicFields,
	initialValues: { name: "Jane Doe", email: "", bio: "" },
	defaultValues: { name: "", email: "", bio: "" },
	showResetFieldButton: true,
	onSubmit: () => {},
};

export const InModal = Template.bind({});
InModal.args = {
	fields: basicFields,
	initialValues: { name: "", email: "", bio: "" },
	inModal: true,
	open: false,
	title: "New contact",
	resetFormButton: true,
	onSubmit: () => {},
	onClose: () => {},
};

export const DisabledFields = Template.bind({});
DisabledFields.args = {
	fields: basicFields,
	initialValues: {
		name: "Jane Doe",
		email: "jane@example.com",
		bio: "",
	},
	disableFields: true,
	onSubmit: () => {},
};

// One of each field type not already covered by Basic/Groups
// (input/textarea/toggle/select) — a broader smoke test of FieldRenderer's
// type -> component map running through the real form machinery
// (reset buttons, groups, dirty-check) rather than in isolation.
const allTypeFields: TFieldsGroup[] = [
	{
		title: "Text & numbers",
		columns: 2,
		fields: [
			{ name: "quantity", type: "number", label: "Quantity" },
			{
				name: "priority",
				type: "radio",
				label: "Priority",
				options: [
					{ label: "Low", value: "low" },
					{ label: "High", value: "high" },
				],
			},
		],
	},
	{
		title: "Dates & times",
		columns: 2,
		fields: [
			{ name: "dueDate", type: "date", label: "Due date" },
			{ name: "reminderTime", type: "time", label: "Reminder" },
			// `period`/`timeRange` write into `from`/`to` (or whatever
			// `from.name`/`to.name` say) rather than this field's own
			// `name` — both need distinct names here so the two don't
			// collide on the same "from"/"to" keys.
			{
				name: "period",
				type: "period",
				label: "Period",
				from: { name: "periodFrom" },
				to: { name: "periodTo" },
			},
			{
				name: "workingHours",
				type: "timeRange",
				label: "Hours",
				from: { name: "workStart" },
				to: { name: "workEnd" },
			},
		],
	},
	{
		title: "Selections & files",
		fields: [
			{
				name: "tags",
				type: "checkbox",
				label: "Tags",
				options: [
					{ label: "Urgent", value: "urgent" },
					{ label: "Follow-up", value: "review" },
				],
			},
			{ name: "attachment", type: "file", label: "Attachment" },
		],
	},
];

export const AllFieldTypes = Template.bind({});
AllFieldTypes.args = {
	title: "All field types",
	fields: allTypeFields,
	initialValues: {
		quantity: null,
		priority: "low",
		dueDate: null,
		reminderTime: null,
		periodFrom: null,
		periodTo: null,
		workStart: null,
		workEnd: null,
		tags: [],
		attachment: [],
	},
	displayGroupTitles: true,
	groupBackground: true,
	onSubmit: () => {},
};
