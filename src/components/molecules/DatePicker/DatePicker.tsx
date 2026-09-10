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
import { cn } from "@utils/index";

import "./DatePicker.scss";
import "./TimePicker.scss";

registerLocale("fr", fr);

export interface IWeek {
	start: Date;
	end: Date;
	date: Date;
}

type IDate = Date | IWeek | null;

export interface IDatePickerProps extends Omit<DatePickerProps, "onChange"> {
	weekPicker?: boolean;
	label?: string;
	placeholder?: string;
	onChange?: (
		date: IDate,
		event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
	) => void;
	onMonthChange?: (date: Date) => void;
	formatInputValue?: (date: IDate) => string;
	type?: "date" | "time";
}

export const DatePicker: React.FC<IDatePickerProps> = ({
	onChange,
	weekPicker,
	onMonthChange,
	selected,
	className,
	formatInputValue,
	placeholder,
	label,
	type,
	...props
}) => {
	const isInForm = !!useContext(FormikContext);

	const isInitied = React.useRef(false);
	const calendarRef = React.useRef<HTMLDivElement>(null);

	const [field, , helpers] =
		props.name && isInForm
			? useField(props.name)
			: [undefined, undefined, undefined];

	// Full field value (Date for a date picker, IWeek for a week picker)
	const FieldValue = field?.value ?? selected;
	// Date used by react-datepicker's `selected` (extract the week's date)
	const CurrentValue = field?.value?.date ?? FieldValue;

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
			.forEach((a: Element) => {
				a.classList.remove("ActiveWeek");
			});

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
			{type === "time" ? (
				<TextField type="time" data-al-input />
			) : (
				<>
					{/* @ts-expect-error: ReactDatePicker is not typed correctly */}
					<ReactDatePicker
						{...props}
						placeholderText={placeholder}
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
								rawValue={FieldValue}
								label={label}
								placeholder={placeholder}
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
				</>
			)}
		</Wrapper>
	);
};

interface IDatePickerFieldProps extends ITextFieldProps {
	weekPicker?: boolean;
	isInForm?: boolean;
	formatInputValue?: (date: IDate) => string;
	rawValue?: IDate;
	placeholder?: string;
	label?: string;
}

const DatePickerField = forwardRef(
	(
		{
			weekPicker,
			isInForm,
			formatInputValue,
			rawValue,
			placeholder,
			label,
			...props
		}: IDatePickerFieldProps,
		ref: React.Ref<HTMLDivElement>
	) => {
		return (
			<div ref={ref}>
				<TextField
					label={label}
					placeholder={placeholder}
					{...(!isInForm ? { ...props } : {})}
					name={props.name}
					// Display the selected value even in form mode, where the raw
					// TextField isn't Formik-wrapped and never receives it otherwise.
					value={rawValue as unknown as string}
					getValue={(value) => {
						if (formatInputValue)
							return formatInputValue(value as IDate);
						if (!value) return "";
						if (weekPicker) {
							const week = value as IWeek;
							return `${week.start ? format(week.start, "yyyy/MM/dd") : ""} - ${week.end ? format(week.end, "yyyy/MM/dd") : ""}`;
						}
						if (value instanceof Date)
							return format(value, "dd/MM/yyyy");
						return value as string;
					}}
					onBlur={() => {}}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						props.onClick?.(e);
					}}
					picto="calendar"
					onPictoClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						props.onClick?.(e);
					}}
					pictoProps={{
						color: "text-neutral-400",
						className: "!w-6 !h-6",
					}}
					readOnly
				/>
			</div>
		);
	}
);

DatePickerField.displayName = "DatePickerField";
