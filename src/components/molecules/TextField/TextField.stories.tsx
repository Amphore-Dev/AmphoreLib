import React, { useState } from "react";

import { StoryFn } from "@storybook/react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import { ITextFieldProps, TextField } from "./TextField";
import { Button } from "@components/atoms";

const formikValidationSchema = Yup.object().shape({
	firstname: Yup.string().required("Required field"),
});

const Template: StoryFn<ITextFieldProps> = (args) => {
	const [value, setValue] = useState<string | null>("");

	return (
		<div className="flex flex-row gap-12 mr-auto">
			<TextField
				info="Rentrez votre prénom"
				label="Prénom"
				{...args}
				value={value}
				onChange={(val) => {
					setValue(val);
				}}
				wrapperClassName="flex flex-col mr-auto"
			/>
		</div>
	);
};

export default {
	title: "Components/Molecules/TextField",
	component: TextField,
	argTypes: {
		info: {
			control: {
				type: "text",
			},
		},
		label: {
			control: {
				type: "text",
			},
		},
		disabled: {
			control: {
				type: "boolean",
			},
		},
		required: {
			control: {
				type: "boolean",
			},
		},
		name: {
			control: {
				type: "text",
			},
		},
		error: {
			control: {
				type: "text",
			},
		},
		maxLength: {
			control: {
				type: "number",
			},
		},
		allowedCharacters: {
			control: {
				type: "RegExp",
			},
		},
		wrapperClassName: {
			control: {
				type: "text",
			},
		},
		className: {
			control: {
				type: "text",
			},
		},
	},
	parameters: {
		controls: {
			include: [
				"info",
				"label",
				"disabled",
				"required",
				"name",
				"error",
				"maxLength",
				"allowedCharacters",
				"...",
			],
		},
	},
};

export const Base = Template.bind({});

Base.args = {};

export const Disabled = Template.bind({});
Disabled.args = {
	label: "Disabled",
	disabled: true,
	wrapperClassName: "flex flex-col mr-auto",
};

export const MaxLength = Template.bind({});
MaxLength.args = {
	label: "MaxLength",
	maxLength: 30,
	showCharCounter: true,
	required: true,
	wrapperClassName: "flex flex-col mr-auto",
};

export const Error = Template.bind({});
Error.args = {
	label: "Error",
	error: "Error message",
	wrapperClassName: "flex flex-col mr-auto",
};

export const HideError = Template.bind({});
HideError.args = {
	...Error.args,
	hideError: true,
};

export const Required = Template.bind({});
Required.args = {
	label: "Required",
	wrapperClassName: "flex flex-col mr-auto",
	required: true,
	info: undefined,
};

export const Info = Template.bind({});
Info.args = {
	label: "Info",
	wrapperClassName: "flex flex-col mr-auto",
};

const FormikTemplate: StoryFn<ITextFieldProps> = (args) => {
	return (
		<Formik
			initialValues={{ firstname: "Bonjour" }}
			onSubmit={() => {}}
			validateOnBlur
			validationSchema={formikValidationSchema}
		>
			{() => {
				return (
					<Form className="flex mr-auto">
						<TextField
							{...args}
							label="Prénom"
							name="firstname"
							required
						/>
					</Form>
				);
			}}
		</Formik>
	);
};

export const Formiked = FormikTemplate.bind({});
Formiked.args = {};

export const FormikedWithPassedError = FormikTemplate.bind({});
FormikedWithPassedError.args = {
	error: "This is a passed error",
};

export const Controlled: StoryFn = () => {
	const [value, setValue] = useState<string | null>("");

	return (
		<div className="flex flex-col items-start gap-2 mr-auto">
			<Button picto="trash" onClick={() => setValue(null)}>
				Remove value
			</Button>
			<TextField
				label="Date de naissance"
				value={value}
				onChange={(value) => setValue(value)}
				error={"Champ requis"}
				errorInputProps={{
					className: "text-end",
				}}
			/>
		</div>
	);
};

export const NotClearable: StoryFn = () => {
	const [value, setValue] = useState<string | null>("");

	return (
		<div className="flex flex-col items-start gap-2 mr-auto">
			<TextField
				label="Phone"
				value={value}
				onChange={(value) => setValue(value)}
				picto={{
					icon: "phone",
					onClick: () => alert("Calling..."),
					className: "!text-blue-600",
				}}
				isClearable={false}
			/>
		</div>
	);
};

export const DisabledWithInfo: StoryFn<ITextFieldProps> = (args) => {
	const [value, setValue] = useState<string | null>("Text");

	return (
		<div className="flex flex-col items-start gap-2 mr-auto">
			<TextField
				label="Disabled with info"
				value={value}
				onChange={(value) => setValue(value)}
				disabled
				info="This is some information about the input"
			/>
		</div>
	);
};

export const WithLongLabel: StoryFn<ITextFieldProps> = (args) => {
	const [value, setValue] = useState<string | null>("Text");

	return (
		<div className="flex flex-col items-start gap-2 mr-auto">
			<TextField
				label="This is a very long label that should be truncated"
				value={value}
				onChange={(value) => setValue(value)}
				info="This is some information about the input"
			/>
		</div>
	);
};
