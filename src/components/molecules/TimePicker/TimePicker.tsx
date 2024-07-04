import React, { useContext, useEffect, useMemo } from "react";

import { ErrorMessage, FormikContext, useField } from "formik";

import { format } from "date-fns";

import { InfoMessage } from "../InfoMessage/InfoMessage";
import { ITextFieldProps, TextField } from "../TextField/TextField";
import { Picto, Popover, TimeWheel } from "@components/atoms";

import { cn } from "@utils/cn";

const HOURS = Array.from({ length: 24 }, (_, i) =>
	i.toString().padStart(2, "0")
);

export interface ITimePickerProps extends Omit<ITextFieldProps, "onChange"> {
	value?: string;
	onChange?: (time: string) => void;
	minutesStep?: number;
}

const inputClasses =
	"!p-0 text-center appearance-textfield w-[2rem] h-auto bg-transparent focus:text-primary-600 !rounded-none py-1 !outline-none  !border-transparent focus:!border-b-primary-500";

export const TimePicker: React.FC<ITimePickerProps> = ({
	value = format(new Date(), "HH:mm"),
	minutesStep = 1,
	onChange,
	label = "",
	...props
}) => {
	const isInForm = !!useContext(FormikContext); // detect if the component is inside a Formik form
	const [Minutes, setMinutes] = React.useState("00");
	const [Hours, setHours] = React.useState("00");

	const [field, , helpers] =
		props.name && isInForm
			? useField(props.name)
			: [undefined, undefined, undefined];

	const handleChange = (time: string) => {
		if (isInForm && field) return;
		onChange?.(time);
	};

	const handleBlur = () => {
		if (isInForm && field) {
			helpers.setTouched(true);
		}
	};

	const MINUTES = useMemo(() => {
		const minutes = Array.from({ length: 60 / minutesStep }, (_, i) =>
			(i * minutesStep).toString().padStart(2, "0")
		);
		return minutes;
	}, [minutesStep]);

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

		setHours(newHours);
		setMinutes(newMinutes);
	}, [value]);

	useEffect(() => {
		// if (isInForm) return;
		handleChange(`${Hours}:${Minutes}`);
	}, [Hours, Minutes]);

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

	return (
		<div className="w-full min-w-fit">
			<Popover
				className="w-full"
				content={
					<div className="flex relative items-center">
						<TimeWheel
							items={HOURS}
							value={Hours}
							onChange={setHours}
						/>
						<div className="h-full flex justify-center items-center">
							:
						</div>
						<TimeWheel
							items={MINUTES}
							value={Minutes}
							onChange={setMinutes}
						/>
					</div>
				}
				onRequestClose={() => {
					helpers?.setValue(`${Hours}:${Minutes}`);
				}}
			>
				<div className="relative flex items-center justify-between w-full border-2 border-neutral-300 p-4 py-2 pb-[6px] rounded-[3rem] gap-2">
					<label
						className={cn([
							"pointer-events-none absolute left-5 top-1/2 max-w-[calc(100%-2rem)] -translate-y-1/2 rounded-lg text-neutral-500 opacity-0 duration-300",
							"top-[2px] -translate-y-0 text-xs text-neutral-400 opacity-100",
							props.disabled && "text-neutral-300",
						])}
					>
						{label}
					</label>
					<div className="flex items-center mt-[10px]">
						<TextField
							type="number"
							value={Hours}
							onChange={(e) => {
								setHours(handleRange(e.target.value, 23));
							}}
							onBlur={handleBlur}
							className={inputClasses}
							autoDetectFormik={false}
						/>
						<div className="mb-1">:</div>
						<TextField
							type="number"
							value={Minutes}
							onChange={(e) => {
								setMinutes(
									handleRange(e.target.value, 60, true)
								);
							}}
							onBlur={handleBlur}
							step={minutesStep}
							className={inputClasses}
							autoDetectFormik={false}
						/>
					</div>
					<Picto
						icon="clock"
						className="min-w-4 h-5 text-neutral-400 hover:text-neutral-500"
					/>
				</div>
			</Popover>
			{props.required && (
				<div className="text-xs text-left ml-5 text-neutral-500 mt-1">
					Required
				</div>
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
