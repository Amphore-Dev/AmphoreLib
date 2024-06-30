import React, { useLayoutEffect } from "react";

import { endOfWeek, format, startOfWeek } from "date-fns";
import { fr } from "date-fns/locale/fr";
import ReactDatePicker, {
	DatePickerProps,
	registerLocale,
} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
}

export const DatePicker: React.FC<IDatePickerProps> = ({
	onChange,
	weekPicker,
	onMonthChange,
	selected,
	className,
	...props
}) => {
	const isInitied = React.useRef(false);
	const calendarRef = React.useRef<any>(null);

	const handleChange = (
		date: Date | null,
		event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
	) => {
		if (!onChange) return;
		if (!weekPicker) return onChange(date, event);
		if (!date) return onChange(null);
		const start = startOfWeek(date, { weekStartsOn: 1 }); // Set week start (0 = Sunday, 1 = Monday, etc.)
		const end = endOfWeek(date, { weekStartsOn: 1 });

		if (onChange) return onChange({ start, end, date: date });
		resetAndGetActiveWeek();
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
				selected &&
				format(date, "YYYY-DD-MM") === format(selected, "YYYY-DD-MM")
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
			/>
		</Wrapper>
	);
};
