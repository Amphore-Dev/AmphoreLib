import React from "react";

import { StoryFn } from "@storybook/react";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import { AsyncSelect, IAsyncSelectProps } from "./AsyncSelect";

export default {
	title: "Components/Molecules/AsyncSelect",
	component: AsyncSelect,
};

const mockedOptions = [
	{ value: "chocolate", label: "Chocolate" },
	{ value: "strawberry", label: "Strawberry" },
	{ value: "vanilla", label: "Vanilla" },
];

const fetchOptions = (inputValue: string) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(
				mockedOptions.filter((option) =>
					option.label
						.toLowerCase()
						.includes(inputValue.toLowerCase())
				)
			);
		}, 1000);
	});
};

export const Template: StoryFn<any> = (args) => {
	if (!args.formiked)
		return (
			<div className="h-[250px]">
				<AsyncSelect {...args} label="OKOKOK" />
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
				return (
					<Form className="h-[250px]">
						<AsyncSelect
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

export const Base = Template.bind({});

Base.args = {
	isMulti: false,
	loadOptions: fetchOptions,
	defaultOptions: true,
	isClearable: true,
};

export const Formiked = Template.bind({});
Formiked.args = {
	...Template.args,
	formiked: true,
};

export const Multiple = Template.bind({});
Multiple.args = {
	...Base.args,
	isMulti: true,
};
