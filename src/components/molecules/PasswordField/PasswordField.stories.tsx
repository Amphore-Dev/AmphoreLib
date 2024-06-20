import React from "react";

import { StoryFn } from "@storybook/react";
import { Formik } from "formik";
import * as yup from "yup";

import { PasswordField, IPasswordFieldProps } from "./PasswordField";

export default {
	title: "Components/Molecules/PasswordField",
	component: PasswordField,
	argTypes: {
		label: {
			control: {
				type: "text",
			},
		},
		autoHide: {
			control: {
				type: "boolean",
			},
		},
		autoHideTimeout: {
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
		required: {
			control: {
				type: "boolean",
			},
		},
		"...": {
			description: "All default TextField props",
			control: {
				disable: true,
			},
		},
	},
	parameters: {
		controls: {
			include: [
				"label",
				"autoHide",
				"autoHideTimeout",
				"name",
				"placeholder",
				"value",
				"required",
				"...",
			],
		},
	},
};

const Template: StoryFn<IPasswordFieldProps> = ({ ...args }) => {
	return <PasswordField {...args} />;
};

const TemplateWithFormik: StoryFn<IPasswordFieldProps> = ({ ...args }) => {
	return (
		<Formik
			initialValues={{}}
			validationSchema={() =>
				yup.object().shape({
					password: yup.string().required(),
				})
			}
			onSubmit={() => {}}
		>
			<PasswordField {...args} />
		</Formik>
	);
};

export const Base = Template.bind({});
Base.args = {
	label: "Password",
};

export const WithAutoHide = Template.bind({});
WithAutoHide.args = {
	label: "Password",

	autoHide: true,
	autoHideTimeout: 5,
};

export const Formiked = TemplateWithFormik.bind({});
Formiked.args = {
	label: "Password",
	name: "password",
};
