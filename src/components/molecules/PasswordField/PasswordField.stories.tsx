import React, { useState } from "react";

import { StoryFn } from "@storybook/react";
import { Form, Formik } from "formik";
import * as yup from "yup";

import { Button } from "../../atoms";
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

const Template: StoryFn<IPasswordFieldProps> = ({ value, ...args }) => {
	const [localValue, setLocalValue] = useState(value ?? "");
	return (
		<PasswordField
			{...args}
			value={localValue}
			onChange={(newValue) => setLocalValue(newValue ?? "")}
		/>
	);
};

const TemplateWithFormik: StoryFn<IPasswordFieldProps> = ({ ...args }) => {
	return (
		<Formik
			initialValues={{
				password: "",
			}}
			validationSchema={() =>
				yup.object().shape({
					password: yup
						.string()
						.min(
							6,
							"Password must be at least 6 characters\nAt least one uppercase letter\nAt least one lowercase letter\nAt least one number"
						)
						.required("Password is required"),
				})
			}
			onSubmit={() => {}}
		>
			{() => {
				return (
					<Form>
						<PasswordField {...args} name="password" />
						<Button type="submit" className="mt-2">
							Submit
						</Button>
					</Form>
				);
			}}
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
