// stories for CheckboxFilter component
import React from "react";

import { Button } from "@components";
import { Meta, StoryFn } from "@storybook/react";
import { Formik, useFormikContext } from "formik";
import * as Yup from "yup";

import { CheckboxFilter, ICheckboxesFilterProps } from "./CheckboxFilter";

export default {
	title: "Components/Molecules/FieldRenderer/CheckboxFilter",
	component: CheckboxFilter,
} as Meta<typeof CheckboxFilter>;

const Template: StoryFn<ICheckboxesFilterProps> = (args) => {
	return (
		<Formik
			initialValues={{
				availability: null,
			}}
			onSubmit={(val, ctx) => {}}
			initialErrors={{
				availability: "nope",
			}}
			validationSchema={Yup.object({
				availability: Yup.array()
					.min(1, "At least one option must be selected")
					.required("This field is required"),
			})}
		>
			{({ submitForm }) => {
				return (
					<div className="space-y-4">
						<StoryBody {...args} />
						<Button type="submit" onClick={submitForm}>
							Submit
						</Button>
					</div>
				);
			}}
		</Formik>
	);
};

const StoryBody: React.FC<ICheckboxesFilterProps> = ({ options, ...args }) => {
	const { setFieldValue, values } = useFormikContext<any>();

	const handleChange = (name: string, value: string[]) => {
		setFieldValue(name, value);
	};

	return (
		<div style={{ maxWidth: 400 }}>
			<CheckboxFilter
				options={
					options ?? [
						{
							value: "thisMonth",
							label: "Ce mois ci",
						},
						{
							value: "lastMonth",
							label: "Le mois dernier",
						},
						{
							value: "nextMonth",
							label: "Le mois prochain",
						},
					]
				}
				value={values.availability}
				{...args}
				onChange={handleChange}
				name="availability"
			/>
		</div>
	);
};

export const Default = Template.bind({});

export const ErrorProp = Template.bind({});
ErrorProp.args = {
	error: "At least one option must be selected",
};
