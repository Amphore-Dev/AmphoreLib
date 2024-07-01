import React from "react";

import { StoryFn } from "@storybook/react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import { Select, ISelectProps } from "./Select";

export default {
	title: "Components/Molecules/Select",
	component: Select,
};

export const Template: StoryFn<any> = (args) => {
	console.log(args);

	if (!args.formiked)
		return (
			<div className="h-[250px]">
				<Select {...args} label="OKOKOK" />
			</div>
		);

	return (
		<Formik
			initialValues={{ select: "" }}
			onSubmit={() => {}}
			validationSchema={Yup.object().shape({
				select: Yup.object().required("Required"),
			})}
		>
			{({ values, errors }) => {
				console.log(values, errors);
				return (
					<Form className="h-[250px]">
						<Select
							isClearable
							{...args}
							label="OKOKOK"
							name="select"
						/>
					</Form>
				);
			}}
		</Formik>
	);
};

Template.args = {
	isMulti: false,

	options: [
		{ value: "chocolate", label: "Chocolate" },
		{ value: "strawberry", label: "Strawberry" },
		{ value: "vanilla", label: "Vanilla" },
	],
};

export const Multiple = Template.bind({});
Multiple.args = {
	...Template.args,
	isMulti: true,
};

export const Formiked = Template.bind({});
Formiked.args = {
	...Template.args,
	formiked: true,
};
