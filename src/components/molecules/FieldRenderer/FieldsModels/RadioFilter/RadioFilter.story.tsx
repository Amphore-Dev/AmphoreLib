// stories for RadioFilter component
import React from "react";

import { Button } from "@components";
import { Meta, StoryFn } from "@storybook/react";
import { Formik, useFormikContext } from "formik";
import * as Yup from "yup";

import { RadioFilter, IRadioFilterProps } from "./RadioFilter";

export default {
	title: "Components/Molecules/FieldRenderer/RadioFilter",
	component: RadioFilter,
} as Meta<typeof RadioFilter>;

const Template: StoryFn<IRadioFilterProps> = (args) => {
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
				availability: Yup.string().required("This field is required"),
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

const StoryBody: React.FC<IRadioFilterProps> = ({ options, ...args }) => {
	const { setFieldValue, values } = useFormikContext<any>();

	const handleChange = (name: string, value: string) => {
		setFieldValue(name, value);
	};

	return (
		<div style={{ maxWidth: 400 }}>
			<RadioFilter
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

export const ErrorState = Template.bind({});
ErrorState.args = {
	error: "Une erreur est survenue",
};
