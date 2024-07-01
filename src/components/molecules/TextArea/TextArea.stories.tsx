import React from "react";

import { StoryFn } from "@storybook/react/*";
import { Form, Formik } from "formik";
import * as yup from "yup";

import { TextArea, ITextAreaProps } from "./TextArea";

export default {
	title: "Components/Molecules/TextArea",
	component: TextArea,
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

interface ITextAreaStoryProps extends ITextAreaProps {
	formiked?: boolean;
}

const Template: StoryFn<ITextAreaStoryProps> = ({ formiked, ...args }) => {
	if (!formiked) return <TextArea {...args} />;

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
					<TextArea {...args} name="field" />
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
