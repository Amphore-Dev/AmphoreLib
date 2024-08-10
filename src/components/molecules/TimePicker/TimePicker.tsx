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
		console.log("value", value);
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
		console.log(
			"Hours, Minutes",
			`${Hours.slice(-2)}:${Minutes.slice(-2)}`
		);
		handleChange(`${Hours.slice(-2)}:${Minutes.slice(-2)}`);
	}, [Hours, Minutes]);

	return (
		<div className="w-full min-w-fit">
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
				<div
					className="flex items-center mt-[10px]"
					ref={fieldsContRef}
				>
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
					<div className="mb-1">:</div>
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
				<Button onClick={focusFirst} className="!p-0 !bg-transparent">
					<Picto
						icon="clock"
						className="min-w-4 h-5 text-neutral-400 hover:text-neutral-500"
					/>
				</Button>
			</div>
			{/* </Popover> */}
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
