import React from "react";

import { pictoArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";
import { Formik } from "formik";

import { FieldRenderer, IFieldRendererProps } from "./FieldRenderer";

export default {
	title: "Components/Molecules/FieldRenderer",
	component: FieldRenderer,
	argTypes: {
		value: { control: "text" },
		disabled: { control: "boolean" },
		required: { control: "boolean" },
		picto: pictoArgType,
		hidden: { control: "boolean" },
		showFieldLabel: { control: "boolean" },
		showResetButton: { control: "boolean" },
		resetOnApply: { control: "boolean" },
	},
};

const Template: StoryFn<IFieldRendererProps> = (args) => (
	<Formik initialValues={{ [args.name]: args.value }} onSubmit={() => {}}>
		{() => <FieldRenderer {...args} />}
	</Formik>
);

export const InputField = Template.bind({});
InputField.args = { name: "title", type: "input", label: "Title" };

export const SelectField = Template.bind({});
SelectField.args = {
	name: "status",
	type: "select",
	label: "Status",
	options: [
		{ label: "Open", value: "open" },
		{ label: "Closed", value: "closed" },
	],
};

export const ToggleField = Template.bind({});
ToggleField.args = {
	name: "active",
	type: "toggle",
	label: "Active",
	value: true,
};

export const CheckboxField = Template.bind({});
CheckboxField.args = {
	name: "days",
	type: "checkbox",
	label: "Days",
	options: [
		{ label: "Monday", value: "mon" },
		{ label: "Tuesday", value: "tue" },
	],
	value: ["mon"],
};

export const RadioField = Template.bind({});
RadioField.args = {
	name: "sort",
	type: "radio",
	label: "Sort",
	options: [
		{ label: "Ascending", value: "asc" },
		{ label: "Descending", value: "desc" },
	],
	value: "asc",
};

export const TextareaField = Template.bind({});
TextareaField.args = { name: "bio", type: "textarea", label: "Bio" };

export const NumberField = Template.bind({});
NumberField.args = { name: "quantity", type: "number", label: "Quantity" };

export const DateField = Template.bind({});
DateField.args = {
	name: "birthDate",
	type: "date",
	label: "Date of birth",
};

export const TimeField = Template.bind({});
TimeField.args = { name: "startTime", type: "time", label: "Start time" };

export const PeriodField = Template.bind({});
PeriodField.args = { name: "period", type: "period", label: "Period" };

export const TimeRangeField = Template.bind({});
TimeRangeField.args = {
	name: "timeRange",
	type: "timeRange",
	label: "Time range",
};

export const FileField = Template.bind({});
FileField.args = { name: "attachment", type: "file", label: "Attachment" };
