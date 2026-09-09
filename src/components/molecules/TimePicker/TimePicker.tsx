import React, { useContext, useEffect } from "react";

import { ErrorMessage, FormikContext, useField } from "formik";

import { format } from "date-fns";

import { InfoMessage } from "../InfoMessage/InfoMessage";
import { ITextFieldProps, TextField } from "../TextField/TextField";
import {
	Button,
	Picto, //Popover, TimeWheel
} from "@components/atoms";
import { cn } from "@utils/index";

import "./TimePicker.scss";

export interface ITimePickerProps extends Omit<ITextFieldProps, "onChange"> {
	value?: string;
	onChange?: (time: string) => void;
	minutesStep?: number;
}

const inputClasses = "al__time-picker__input appearance-textfield";

export const TimePicker: React.FC<ITimePickerProps> = ({
	value = format(new Date(), "HH:mm"),
	minutesStep = 1,
	onChange,
	label = "",
	...props
}) => {
	const fieldsContRef = React.useRef<HTMLDivElement>(null);
	const isInForm = !!useContext(FormikContext); // detect if the component is inside a Formik form
	const [Minutes, setMinutes] = React.useState(
		(
			Math.ceil(
				parseInt((value ?? "00:00").split(":")[1]) / minutesStep
			) * minutesStep
		)
			.toString()
			.padStart(2, "0")
	);
	const [Hours, setHours] = React.useState(
		parseInt((value ?? "00:00").split(":")[0])
			.toString()
			.padStart(2, "0")
	);

	const [field, , helpers] =
		props.name && isInForm
			? useField(props.name)
			: [undefined, undefined, undefined];

	const handleChange = (time: string) => {
		if (isInForm && field && time !== field.value) {
			return helpers.setValue(time);
		}
		onChange?.(time);
	};

	const handleBlur = () => {
		if (isInForm && field) {
			helpers.setTouched(true);
		}
	};

	const handleRange = (value: string, max: number, isMinutes?: boolean) => {
		const selectedValue = parseInt(value);
		if (
			(isMinutes && selectedValue >= max) ||
			(!isMinutes && selectedValue > max)
		)
			return "00";
		else if (selectedValue < 0)
			return (max - (isMinutes ? minutesStep : 0))
				.toString()
				.padStart(2, "0");
		else return value.toString().padStart(2, "0");
	};

	const stopScroll = (e) => {
		e.stopPropagation();
	};

	const focusFirst = () => {
		fieldsContRef.current?.querySelector("input")?.focus();
	};

	useEffect(() => {
		fieldsContRef.current?.addEventListener("wheel", stopScroll);

		return () => {
			fieldsContRef.current?.removeEventListener("wheel", stopScroll);
		};
	}, []);

	useEffect(() => {
		const getInitialValue = () => {
			const [hours, minutes] = value.split(":");
			const roundedMinutes =
				Math.ceil(parseInt(minutes) / minutesStep) * minutesStep;
			const newDate = new Date();
			newDate.setMinutes(roundedMinutes);
			newDate.setHours(parseInt(hours));
			return format(newDate, "HH:mm");
		};

		const [newHours, newMinutes] = getInitialValue().split(":");

		if (isInForm) return;
		setHours(newHours.slice(-2));
		setMinutes(newMinutes.slice(-2));
	}, [value]);

	useEffect(() => {
		// if (isInForm) return;

		handleChange(`${Hours.slice(-2)}:${Minutes.slice(-2)}`);
	}, [Hours, Minutes]);

	return (
		<div className="al__time-picker">
			<div className="al__time-picker__inner">
				<label
					className={cn([
						"al__time-picker__label",
						props.disabled && "al__time-picker__label--disabled",
					])}
				>
					{label}
				</label>
				<div className="al__time-picker__fields" ref={fieldsContRef}>
					<TextField
						type="number"
						value={Hours.slice(-2)}
						onChange={(e) => {
							setHours(handleRange(e.target.value, 23));
						}}
						onBlur={handleBlur}
						className={inputClasses}
						autoDetectFormik={false}
						onClick={(e) => {
							e.currentTarget.select();
						}}
					/>
					<div className="al__time-picker__separator">:</div>
					<TextField
						type="number"
						value={Minutes.slice(-2)}
						onChange={(e) => {
							setMinutes(handleRange(e.target.value, 60, true));
						}}
						onBlur={handleBlur}
						step={minutesStep}
						className={inputClasses}
						autoDetectFormik={false}
						onWheel={(e) => {
							e.stopPropagation();
						}}
						onClick={(e) => {
							e.currentTarget.select();
						}}
					/>
				</div>

				<Picto
					icon="clock"
					onClick={focusFirst}
					color="text-neutral-400"
					className="al__time-picker__icon"
				/>
			</div>
			{/* </Popover> */}
			{props.required && (
				<div className="al__time-picker__required">Required</div>
			)}
			{!!props.name && (
				<ErrorMessage name={props.name}>
					{(msg: string) => (
						<InfoMessage
							type="error"
							className={cn([!props.required ? "mt-2" : "mt-1"])}
						>
							{msg}
						</InfoMessage>
					)}
				</ErrorMessage>
			)}
		</div>
	);
};
