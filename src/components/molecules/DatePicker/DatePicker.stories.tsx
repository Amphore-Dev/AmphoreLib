import React from "react";

import { StoryFn } from "@storybook/react";
import { Form, Formik } from "formik";
import * as yup from "yup";

import { DatePicker, IDatePickerProps } from "./DatePicker";

export default {
	title: "Components/Molecules/DatePicker",
	component: DatePicker,
	argTypes: {
		onChange: {
			action: "onChange",
		},
		onMonthChange: {
			action: "onMonthChange",
		},
	},
	parameters: { docs: { iframeHeight: 400 } },
};

interface IDatePickerStoryProps extends IDatePickerProps {
	formiked?: boolean;
	validationSchema?: any;
}

const Template: StoryFn<IDatePickerStoryProps> = (args) => {
	if (!args.formiked)
		return (
			<div className="min-h-[300px] text-center ">
				<DatePicker {...args} className="border-2 text-center" />
			</div>
		);
	return (
		<div className="min-h-[300px] text-center ">
			<Formik
				initialValues={{
					field: "",
				}}
				validationSchema={
					args.validationSchema
						? args.validationSchema
						: () =>
								yup.object().shape({
									field: yup.string().required(),
								})
				}
				onSubmit={() => {}}
			>
				{({}) => {
					return (
						<Form>
							<DatePicker
								{...args}
								className="border-2 text-center"
							/>
						</Form>
					);
				}}
			</Formik>
		</div>
	);
};

export const Base = Template.bind({});

Base.args = {
	formiked: true,
	name: "field",
	label: "Date",
	placeholder: "Click to pick a date",
	type: "time",
};

Base.parameters = {
	docs: {
		iframeHeight: 400,
	},
};

export const WeekPicker = Template.bind({});
WeekPicker.args = {
	weekPicker: true,
	formiked: true,
	name: "field",
	validationSchema: yup.object().shape({
		field: yup.object().required(),
	}),
};

export const WithSelected = Template.bind({});
WithSelected.args = {
	selected: new Date(),
	onChange: (date) => {
		alert(`Date changed to ${date}`);
	},
};
