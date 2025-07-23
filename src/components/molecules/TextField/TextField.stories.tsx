import React from "react";

import { StoryFn } from "@storybook/react/*";
import { Form, Formik } from "formik";
import * as yup from "yup";

import { TextField, ITextFieldProps } from "./TextField";

export default {
	title: "Components/Molecules/TextField",
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
		picto: {
			control: {
				type: "text",
			},
		},
		isLoading: {
			control: {
				type: "boolean",
			},
		},
		size: {
			control: "radio",
			options: ["s", "m"],
			description: "Size of the text field.",
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
				"size",
				"maxLength",
				"placeholder",
				"value",
				"label",
				"required",
				"picto",
				"pictoProps",
				"onPictoClick",
				"isLoading",
				"...",
			],
		},
	},
};

interface ITextFieldStoryProps extends ITextFieldProps {
	formiked?: boolean;
}

const Template: StoryFn<ITextFieldStoryProps> = ({ formiked, ...args }) => {
	if (!formiked) return <TextField {...args} />;

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
			{() => (
				<Form>
					<TextField {...args} name="field" />
				</Form>
			)}
		</Formik>
	);
};

export const Base = Template.bind({});

Base.args = {
	label: "Field Label",
	placeholder: "Enter text here",
};

export const Formiked = Template.bind({});
Formiked.args = {
	label: "With Formik",
	name: "field",
	formiked: true,
	required: true,
};

export const Required = Template.bind({});
Required.args = {
	label: "Required",
	required: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
	label: "Disabled",
	disabled: true,
};

export const MaxLength = Template.bind({});

MaxLength.args = {
	label: "Max Length",
	maxLength: 1000,
};

export const Picto = Template.bind({});

Picto.args = {
	picto: "search",
	label: "Search",
	onPictoClick: () => alert("Picto clicked"),
};

export const Loading = Template.bind({});

Loading.args = {
	label: "Loading",
	isLoading: true,
};

export const NoLabel = Template.bind({});
NoLabel.args = {
	placeholder: "Enter text here",
};

export const NoLabelMaxLength = Template.bind({});
NoLabelMaxLength.args = {
	placeholder: "Enter text here",
	maxLength: 1000,
};

export const Sizes = () => {
	return (
		<div className="flex flex-col gap-8">
			<TextField label="Small Text Field" size="s" />
			<TextField placeholder="Small Text Field no label" size="s" />
			<TextField
				label="Small Text Field with Picto"
				size="s"
				picto="search"
				onPictoClick={() => alert("Picto clicked")}
			/>
			<TextField label="Medium Text Field" size="m" />
		</div>
	);
};
