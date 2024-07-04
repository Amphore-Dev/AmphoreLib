import React from "react";

import { StoryFn } from "@storybook/addons";
import { Form, Formik } from "formik";
import * as yup from "yup";

import { format } from "date-fns";

import { ITimePickerProps, TimePicker } from "./TimePicker";

export default {
	title: "Components/Molecules/TimePicker",
	component: TimePicker,
};

interface IStoryProps extends ITimePickerProps {
	formiked?: boolean;
}

export const Template: StoryFn<IStoryProps> = ({
	formiked = true,
	...props
}) => {
	if (!formiked)
		return (
			<div className="min-h-[300px]">
				<TimePicker label="Time" {...props} />
			</div>
		);
	return (
		<div className="min-h-[300px]">
			<Formik
				initialValues={{ time: format(new Date(), "HH:mm") }}
				validationSchema={yup.object().shape({
					time: yup.string().required("Time is required"),
				})}
				onSubmit={() => {}}
			>
				{({ values }) => {
					return (
						<Form>
							<TimePicker
								label="Time"
								name="time"
								{...props}
								value={values.time}
								onChange={(time) => {}}
								required
								readOnly
								minutesStep={5}
							/>
						</Form>
					);
				}}
			</Formik>
		</div>
	);
};

// export const Default = Template.bind({});

// Default.args = {
// 	formiked: true,
// };

// export const WithValue = Template.bind({});

// WithValue.args = {
// 	value: "12:00",
// };
