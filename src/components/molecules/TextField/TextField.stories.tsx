import React from "react";

import { StoryFn } from "@storybook/react/*";
import { Form, Formik } from "formik";
import * as yup from "yup";

import { TextField, ITextFieldProps } from "./TextField";

export default {
	title: "Components/Atoms/TextField",
	component: TextField,
	argTypes: {
		disabled: {
			control: {
				type: "boolean",
			},
		},
		maxLength: {
			control: {
				type: "number",
			},
		},
		name: {
			control: {
				type: "text",
			},
		},
		placeholder: {
			control: {
				type: "text",
			},
		},
		value: {
			control: {
				type: "text",
			},
		},
		label: {
			control: {
				type: "text",
			},
		},
		formiked: {
			control: {
				type: "boolean",
			},
		},
		required: {
			control: {
				type: "boolean",
			},
		},
		"...": {
			description: "All default input props",
			control: {
				disable: true,
			},
		},
	},
	parameters: {
		controls: {
			include: [
				"name",
				"disabled",
				"maxLength",
				"placeholder",
				"value",
				"label",
				"required",
				"...",
			],
		},
	},
};

interface ITextFieldStoryProps extends ITextFieldProps {
	formiked?: boolean;
}

const Template: StoryFn<ITextFieldStoryProps> = ({ ...args }) => {
	if (!args.isInForm) return <TextField {...args} />;

	return (
		<Formik
			initialValues={{}}
			validationSchema={() =>
				yup.object().shape({
					field: yup.string().required(),
				})
			}
			onSubmit={() => {}}
		>
			{({ values }) => {
				console.log(values);
				return (
					<Form>
						<TextField {...args} name="field" />
					</Form>
				);
			}}
		</Formik>
	);
};

export const Base = Template.bind({});

Base.args = {
	label: "Field Label",
	placeholder: "Enter text here",
	isInForm: false,
};

export const Formiked = Template.bind({});
Formiked.args = {
	label: "With Formik",
	name: "field",
	required: true,
	isInForm: true,
};

export const Required = Template.bind({});
Required.args = {
	label: "Required",
	name: "field",
	required: true,
	isInForm: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
	label: "Disabled",
	name: "field",
	disabled: true,
	isInForm: false,
};

export const MaxLength = Template.bind({});

MaxLength.args = {
	label: "Max Length",
	name: "field",
	maxLength: 1000,
	isInForm: false,
};
