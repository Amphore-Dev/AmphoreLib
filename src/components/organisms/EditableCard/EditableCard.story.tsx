// stories for EditableCard component
import React from "react";

import { StoryFn } from "@storybook/react";
import { Formik } from "formik";
import * as Yup from "yup";

import {
	MOCKED_DATA,
	MOCKED_FIELDS,
	MOCKED_FIELDS_VALIDATION_SCHEMA,
	multiColumnFilters,
} from "../../Mocks/FiltersModal/MFiltersModal";
import { EditableCard } from "./EditableCard";
import { Button } from "@components/atoms";

export default {
	title: "Components/Organisms/EditableCard",
	component: EditableCard,
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
		<div className="p-4 bg-neutral-50">
			<EditableCard
				title="Editable Card"
				fields={MOCKED_FIELDS}
				values={Values}
				{...args}
				onSubmit={handleSubmit}
				validationSchema={MOCKED_FIELDS_VALIDATION_SCHEMA}
			/>
		</div>
	);
};

export const Default = Template.bind({});
Default.args = {
	title: "Editable Card",
};

export const CustomDisplayColumns = Template.bind({});
CustomDisplayColumns.args = {
	title: "Editable Card with X columns",
	columns: 2,
};

export const EditColumns = Template.bind({});
EditColumns.args = {
	title: "Editable Card with merged groups for display",
	editColumns: 2,
	itemsColumns: 2,
	fields: [
		{
			title: "Personal Information",
			fields: MOCKED_FIELDS.slice(0, 2),
			className: "!bg-red-500 !p-0",
		},
		{
			title: "Contact Information",
			fields: MOCKED_FIELDS.slice(2),
		},
	],
};

export const SplitGroupsForDisplay = Template.bind({});
SplitGroupsForDisplay.args = {
	...EditColumns.args,
	title: "Editable Card with split groups for display",
	mergeGroupsForDisplay: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
	...EditColumns.args,
	title: "Disabled Editable Card",
	disabled: true,
};

export const WithActions = Template.bind({});
WithActions.args = {
	...EditColumns.args,
	title: "Editable Card with custom actions",
	actions: [
		<Button
			color="red"
			size="s"
			onClick={() => alert("Custom Action 1")}
			key="action1"
		>
			Custom Action 1
		</Button>,
	],
};

export const WithValidation = Template.bind({});
WithValidation.args = {
	...EditColumns.args,
	title: "Editable Card with validation",
	validationSchema: Yup.object().shape({
		firstName: Yup.string().required("First name is required"),
		lastName: Yup.string().required("Last name is required"),
		email: Yup.string().email("Invalid email format"),
	}),
};

export const WithAsyncSubmit = Template.bind({});
WithAsyncSubmit.args = {
	...EditColumns.args,
	title: "Editable Card with async submit",
	onSubmit: (newValues: unknown) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(newValues);
			}, 2000);
		});
	},
};

export const EditInCard = Template.bind({});
EditInCard.args = {
	editItemsColumns: 2,
	fields: MOCKED_FIELDS,
	title: "Editable Card with edit mode in card",
	editInModal: false,
};

export const ControlledEditing = Template.bind({});
ControlledEditing.args = {
	...EditColumns.args,
	title: "Editable Card with controlled editing",
	isEditing: true,
	editInModal: false,
};

export const AddOnEmptyValue = Template.bind({});
AddOnEmptyValue.args = {
	...EditColumns.args,
	fields: [
		...MOCKED_FIELDS,
		{
			name: "newField",
			label: "Field without add button",
			addOnEmptyValue: false,
		},
	],
	values: {},
	title: "Editable Card with add button on empty value",
	addOnEmptyValue: true,
};

const ExternalFormikTemplate: StoryFn = (args) => {
	const [Values, setValues] = React.useState({ ...MOCKED_DATA });

	const handleSubmit = (newValues: unknown) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				setValues(newValues as typeof MOCKED_DATA);
				resolve(newValues);
			}, 2000);
		});
	};

	return (
		<Formik initialValues={Values} onSubmit={handleSubmit}>
			{(formikCtx) => {
				return (
					<div className="flex flex-col gap-4 p-4 bg-neutral-50">
						<p>
							Le formulaire englobe les deux cartes pour permettre
							une gestion globale du formulaire avec Formik
						</p>
						<EditableCard
							title={multiColumnFilters[0].title}
							fields={[multiColumnFilters[0]]}
							values={Values}
							isEditing={true}
							editInModal={false}
							formikWrapper={false}
							displayGroupTitles={false}
							isSubmitting={formikCtx.isSubmitting}
						/>
						<EditableCard
							title={multiColumnFilters[1].title}
							fields={[multiColumnFilters[1]]}
							values={Values}
							isEditing={true}
							editInModal={false}
							formikWrapper={false}
							displayGroupTitles={false}
							isSubmitting={formikCtx.isSubmitting}
						/>
						<Button
							color="primary"
							onClick={() => formikCtx.submitForm()}
							isLoading={formikCtx.isSubmitting}
						>
							Submit All
						</Button>
					</div>
				);
			}}
		</Formik>
	);
};

export const ExternalFormikWrapper = ExternalFormikTemplate.bind({});
ExternalFormikWrapper.args = {
	...EditColumns.args,
	title: "Editable Card with external Formik wrapper",
	formikWrapper: false,
};

export const WithCustomDisplayGridProps = Template.bind({});
WithCustomDisplayGridProps.args = {
	...EditColumns.args,
	title: "Editable Card with custom display grid props",
	displayGridProps: {
		columns: 6,
		gap: "2rem",
		minItemWidth: "100px",
	},
};
