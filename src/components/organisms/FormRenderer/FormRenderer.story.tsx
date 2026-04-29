// stories for FormRenderer component
import React from "react";

import { StoryFn } from "@storybook/react";
import { Formik, FormikProps } from "formik";

import {
	MOCKED_DATA,
	MOCKED_FIELDS,
} from "../../Mocks/FiltersModal/MFiltersModal";
import { FormRenderer, FormRendererWithFormik } from "./FormRenderer";

export default {
	title: "Components/Organisms/FormRenderer",
	component: FormRenderer,
};

const Template: StoryFn = (args) => {
	const [Values, setValues] = React.useState({ ...MOCKED_DATA });

	const handleSubmit = (newValues: unknown) => {
		if (args.onSubmit) {
			const result = args.onSubmit(newValues);
			if (result instanceof Promise) {
				return result.then(() => {
					setValues(newValues as typeof MOCKED_DATA);
				});
			}
		}
		setValues(newValues as typeof MOCKED_DATA);
	};

	return (
		<Formik initialValues={Values} onSubmit={handleSubmit}>
			{(formikCtx: FormikProps<typeof MOCKED_DATA>) => {
				return (
					<FormRenderer
						title="Form Renderer"
						fields={MOCKED_FIELDS}
						{...args}
						onSubmit={handleSubmit}
						initialValues={Values}
						isOpen={true}
						onClose={() => {}}
						formikCtx={formikCtx as unknown as FormikProps<object>}
					/>
				);
			}}
		</Formik>
	);
};

export const Default = Template.bind({});

export const EditColumns = Template.bind({});
EditColumns.args = {
	title: "Render with 2 columns",
	columns: 1,
	fields: [
		{
			columns: 2,
			title: "Personal Information",
			fields: MOCKED_FIELDS.slice(0, 2),
			className: "bg-red-500",
		},
		{
			columns: 2,
			title: "Contact Information",
			fields: MOCKED_FIELDS.slice(2),
		},
	],
};

export const Row = Template.bind({});
Row.args = {
	title: "Render with 2 columns",
	columns: 2,
	fields: [
		{
			title: "Personal Information",
			fields: MOCKED_FIELDS.slice(0, 2),
		},
		{
			title: "Contact Information",
			fields: MOCKED_FIELDS.slice(2),
		},
	],
};

export const CustomColumnsForGroup = Template.bind({});
CustomColumnsForGroup.args = {
	title: "Render with 2 columns",
	columns: 2,
	fields: [
		{
			title: "Personal Information s'affiche sur 2 colonnes",
			fields: MOCKED_FIELDS.slice(0, 2),
			columns: 2,
		},
		{
			title: "Contact Information s'affiche sur 1 colonne",
			fields: MOCKED_FIELDS.slice(2),
		},
	],
};

export const WithFormikWrapper: StoryFn = (args) => {
	const [Values, setValues] = React.useState({ ...MOCKED_DATA });

	return (
		<FormRendererWithFormik
			title="Form Renderer"
			fields={MOCKED_FIELDS}
			{...args}
			onSubmit={(newValues) => {
				setValues(newValues as typeof MOCKED_DATA);
			}}
			initialValues={Values}
			isOpen={true}
			onClose={() => {}}
		/>
	);
};

export const CustomMinItemWidth = Template.bind({});
CustomMinItemWidth.args = {
	title: "Render with custom min item width",
	minItemWidth: "300px",
	fields: MOCKED_FIELDS,
	columns: 3,
};

export const CustomGapField = Template.bind({});
CustomGapField.args = {
	title: "Render with custom gap between fields",
	fields: MOCKED_FIELDS,
	columns: 3,
	gap: "0.25rem",
};
