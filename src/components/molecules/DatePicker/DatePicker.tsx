import React, { forwardRef, useContext, useLayoutEffect } from "react";

import { FormikContext, useField } from "formik";

import { endOfWeek, format, startOfWeek } from "date-fns";
import { fr } from "date-fns/locale/fr";
import ReactDatePicker, {
	DatePickerProps,
	registerLocale,
} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { ITextFieldProps, TextField } from "../TextField/TextField";
import { Picto } from "@components/atoms";

import { cn } from "@utils/cn";

import "./DatePicker.scss";

registerLocale("fr", fr);

export interface IWeek {
	start: Date;
	end: Date;
	date: Date;
}

export interface IDatePickerProps extends Omit<DatePickerProps, "onChange"> {
	weekPicker?: boolean;

	onChange?: (date: Date | IWeek | null, event?: any) => void;
	onMonthChange?: (date: Date) => void;
	formatInputValue?: (date: Date | IWeek | null) => string;
}

export const DatePicker: React.FC<IDatePickerProps> = ({
	onChange,
	weekPicker,
	onMonthChange,
	selected,
	className,
	formatInputValue,
	...props
}) => {
	const isInForm = !!useContext(FormikContext);

	const isInitied = React.useRef(false);
	const calendarRef = React.useRef<any>(null);

	const [field, , helpers] =
		props.name && isInForm
			? useField(props.name)
			: [undefined, undefined, undefined];

	const CurrentValue = field?.value?.date ?? field?.value ?? selected;

	const handleChange = (
		date: Date | null,
		event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
	) => {
		const hasField = isInForm && field;

		if (hasField && !weekPicker) {
			helpers.setValue(date);
		}

		if (!onChange) return;
		if (!weekPicker) return onChange(date, event);
		if (!date) return onChange(null);

		// handle week picker
		const start = startOfWeek(date, { weekStartsOn: 1 }); // Set week start (0 = Sunday, 1 = Monday, etc.)
		const end = endOfWeek(date, { weekStartsOn: 1 });

		if (hasField) helpers.setValue({ start, end, date });
		if (onChange) return onChange({ start, end, date });
	};

	const Wrapper = weekPicker ? "div" : React.Fragment;

	const resetAndGetActiveWeek = () => {
		if (!weekPicker || isInitied.current) return;
		const activeWeek = calendarRef.current?.querySelector(
			".react-datepicker__day--selected"
		);

		calendarRef.current
			?.querySelectorAll(".react-datepicker__week")
			.forEach((a: HTMLElement) => a.classList.remove("ActiveWeek"));

		return activeWeek;
	};

	const handleMonthChange = (date: Date) => {
		if (weekPicker) {
			const activeWeek = resetAndGetActiveWeek();
			if (
				CurrentValue &&
				format(date, "yyyy-dd-mm") ===
					format(CurrentValue, "yyyy-dd-mm")
			)
				activeWeek
					?.closest(".react-datepicker__week")
					?.classList.add("ActiveWeek");
		}
		onMonthChange?.(date);
	};

	/* initial active week */
	useLayoutEffect(() => {
		const activeWeek = resetAndGetActiveWeek();

		activeWeek
			?.closest(".react-datepicker__week")
			?.classList.add("ActiveWeek");
	});

	return (
		<Wrapper
			{...(Wrapper === "div"
				? {
						className: cn([weekPicker && "WeekPicker"]),
						ref: calendarRef,
					}
				: {})}
		>
			{/* @ts-ignore */}
			<ReactDatePicker
				{...props}
				onChange={(date, event) => handleChange(date, event)}
				locale="fr"
				onMonthChange={handleMonthChange}
				dateFormat="dd/MM/yyyy"
				className={cn(["DatePicker", className])}
				wrapperClassName="DatePickerWrapper"
				popperClassName="DatePickerPopper"
				selected={CurrentValue}
				customInput={
					<DatePickerField
						weekPicker={weekPicker}
						isInForm={isInForm}
						formatInputValue={formatInputValue}
					/>
				}
				onCalendarOpen={() => {
					if (!weekPicker) return;
					const activeWeek = resetAndGetActiveWeek();

					activeWeek
						?.closest(".react-datepicker__week")
						?.classList.add("ActiveWeek");
				}}
				onCalendarClose={() => {
					resetAndGetActiveWeek();
					setTimeout(() => {
						if (field) helpers.setTouched(true);
					}, 10);
				}}
			/>
		</Wrapper>
	);
};

interface IDatePickerFieldProps extends ITextFieldProps {
	weekPicker?: boolean;
	isInForm?: boolean;
	formatInputValue?: (date: Date | IWeek | null) => string;
}

const DatePickerField = forwardRef(
	(
		{
			weekPicker,
			isInForm,
			formatInputValue,
			...props
		}: IDatePickerFieldProps,
		ref: any
	) => {
		const placeholder = "Select a date";
		const label = "Date";

		return (
			<div ref={ref}>
				<TextField
					label={label}
					placeholder={placeholder}
					{...(!isInForm ? { ...props } : {})}
					name={props.name}
					getValue={(value: any) => {
						if (formatInputValue) return formatInputValue(value);
						if (!value) return "";
						if (weekPicker)
							return `${value.start ? format(value.start, "yyyy/MM/dd") : ""} - ${value.end ? format(value.end, "yyyy/MM/dd") : ""}`;
						return value;
					}}
					onBlur={() => {}}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						props.onClick?.(e);
					}}
					readOnly
				>
					<div className="absolute top-1/2 -translate-y-1/2 right-4 flex items-center gap-4 text-neutral-500">
						<button
							className="w-6 h-6 text-neutral-400 hover:text-neutral-500"
							title={placeholder}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								props.onClick?.(e);
							}}
						>
							<Picto icon={"calendar"} />
						</button>
					</div>
				</TextField>
			</div>
		);
	}
);

DatePickerField.displayName = "DatePickerField";
