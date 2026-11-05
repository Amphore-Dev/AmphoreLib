import React, {
	createContext,
	useContext,
	useId,
	useMemo,
	useState,
} from "react";

import { addDays, isSameWeek, startOfWeek } from "date-fns";
import {
	DayButton,
	type DayButtonProps,
	DayPicker,
	type DayPickerProps,
	type Locale,
} from "react-day-picker";
import { enGB } from "react-day-picker/locale";
import "react-day-picker/style.css";

import { useAmphoreDefaults } from "@theme/useAmphoreDefaults";
import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { cn } from "@utils/cn";

import { TColor, TLabel, TSize } from "@interfaces/index";

import { InputErrorMessage } from "../../atoms/InputErrorMessage/InputErrorMessage";
import { Picto } from "../../atoms/Picto/Picto";
import { Popover } from "../Popover/Popover";

import styles from "./DatePicker.module.scss";

/** What a click picks: one day, or the whole week of that day. */
export type TDatePickerMode = "single" | "week";

/** A full week, first and last day at local midnight. */
export type TDatePickerWeek = { from: Date; to: Date };

/** A day flagged in the calendar, e.g. one with entries left to fill in. */
export type TDatePickerMarker = {
	date: Date;
	/** Added to the day's accessible name, and shown as its native tooltip. Text from the caller: pass it translated. */
	label?: string;
};

export interface IDatePickerProps {
	/** Controlled value — a plain `Date` (local midnight), or `null` for empty. With `mode="week"`, any day of the selected week. */
	value: Date | null;
	/** With `mode="week"`, `value` is the first day of the picked week and `week` the whole of it. */
	onChange: (value: Date | null, week?: TDatePickerWeek) => void;
	/** `"week"` selects the whole week of the clicked day. Defaults to `"single"`. */
	mode?: TDatePickerMode;
	/** First day of the week, 0 for Sunday. Defaults to the one of `locale`. */
	weekStartsOn?: TWeekStartsOn;
	/** Days flagged in the calendar with a small bar under their number. */
	markers?: TDatePickerMarker[];
	/** Called when the visible month changes, e.g. to load that month's `markers`. */
	onMonthChange?: (month: Date) => void;
	/** Days outside them can't be clicked. With `mode="week"`, a week that straddles a bound can still be picked from its enabled days. */
	min?: Date;
	max?: Date;
	/** date-fns locale for month/day names and the trigger's formatted display. Defaults to English (UK) — dd/mm/yyyy, the convention outside the US. */
	locale?: Locale;
	/** Defaults to "dd/mm/yyyy" (or `DatePicker.placeholder` from the nearest AmphoreProvider — see useAmphoreLabels). Unrelated to `locale` above: this is the trigger's empty-state text, not the calendar's own date-fns locale. */
	placeholder?: TLabel;
	label?: string;
	error?: string;
	hideError?: boolean;
	size?: TSize;
	color?: TColor;
	disabled?: boolean;
	required?: boolean;
	/** Forwarded to the calendar's Popover — renders it into `document.body` via AmphorePortal. Defaults to false. */
	portal?: boolean;
	className?: string;
	wrapperClassName?: string;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TDatePickerLabels = Pick<IDatePickerProps, "placeholder">;

type TWeekStartsOn = NonNullable<DayPickerProps["weekStartsOn"]>;

const dayKey = (date: Date) => date.toDateString();

const getWeek = (date: Date, weekStartsOn: TWeekStartsOn): TDatePickerWeek => {
	const from = startOfWeek(date, { weekStartsOn });
	return { from, to: addDays(from, 6) };
};

const MarkersContext = createContext<Map<string, TDatePickerMarker>>(new Map());

/**
 * Lives at module level, markers reaching it through context: a component
 * created during render would be a new type on every render, so hovering
 * the calendar would replace each day's button mid-click and lose the click.
 * It extends the name react-day-picker computed rather than overriding
 * `labels.labelDayButton`, which would drop the locale's own translation.
 */
const MarkedDayButton = (props: DayButtonProps) => {
	const marker = useContext(MarkersContext).get(dayKey(props.day.date));
	const name = props["aria-label"];

	return (
		<DayButton
			{...props}
			aria-label={marker?.label ? `${name}, ${marker.label}` : name}
			title={marker?.label}
			data-marked={marker ? true : undefined}
		/>
	);
};

interface IDatePickerCalendarProps extends Pick<
	IDatePickerProps,
	"value" | "mode" | "min" | "max" | "markers" | "onMonthChange"
> {
	locale: Locale;
	weekStartsOn: TWeekStartsOn;
	onSelectDay: (next: Date | undefined) => void;
	onSelectWeek: (day: Date) => void;
}

/** Own component so the hovered week lives and dies with the open calendar. */
const DatePickerCalendar: React.FC<IDatePickerCalendarProps> = ({
	value,
	mode,
	min,
	max,
	markers,
	onMonthChange,
	locale,
	weekStartsOn,
	onSelectDay,
	onSelectWeek,
}) => {
	const [hoveredDay, setHoveredDay] = useState<Date>();

	const markersByDay = useMemo(
		() => new Map(markers?.map((marker) => [dayKey(marker.date), marker])),
		[markers]
	);

	const calendarProps = {
		className: styles.calendar,
		styles: {
			chevron: { width: "0.875rem", height: "0.875rem" },
		},
		components: { DayButton: MarkedDayButton },
		locale,
		weekStartsOn,
		defaultMonth: value ?? undefined,
		onMonthChange,
		disabled: [
			...(min ? [{ before: min }] : []),
			...(max ? [{ after: max }] : []),
		],
		// DayPicker's own prop, not raw DOM autofocus.
		// eslint-disable-next-line jsx-a11y/no-autofocus
		autoFocus: true,
	};

	return (
		<MarkersContext.Provider value={markersByDay}>
			{mode === "week" ? (
				// Rendered as a range for its start/middle/end styling. The
				// range react-day-picker computes is ignored: the clicked
				// day alone decides the week.
				<DayPicker
					{...calendarProps}
					mode="range"
					selected={value ? getWeek(value, weekStartsOn) : undefined}
					onSelect={(_range, day) => onSelectWeek(day)}
					// A week picked across two months has to read as a week.
					showOutsideDays
					modifiers={{
						hoverWeek: (day) =>
							!!hoveredDay &&
							isSameWeek(day, hoveredDay, { weekStartsOn }),
					}}
					modifiersClassNames={{ hoverWeek: styles.hoverWeek }}
					onDayMouseEnter={(day) => setHoveredDay(day)}
					onDayMouseLeave={() => setHoveredDay(undefined)}
				/>
			) : (
				<DayPicker
					{...calendarProps}
					mode="single"
					selected={value ?? undefined}
					onSelect={onSelectDay}
				/>
			)}
		</MarkersContext.Provider>
	);
};

/**
 * V2 DatePicker — controlled, `value` is a plain `Date` (not a string).
 * Trigger is a text-like field (same _field.scss box as Input/Select);
 * the grid is react-day-picker, restyled via its own --rdp-* vars, opened
 * in a `Popover`.
 */
export const DatePicker: React.FC<IDatePickerProps> = ({
	value,
	onChange,
	mode = "single",
	weekStartsOn: weekStartsOnProp,
	markers,
	onMonthChange,
	min,
	max,
	locale = enGB,
	placeholder: placeholderProp,
	label,
	error,
	hideError = false,
	size: sizeProp,
	color = "primary",
	disabled = false,
	required = false,
	portal = false,
	className = "",
	wrapperClassName = "",
}) => {
	const { size: defaultSize } = useAmphoreDefaults();
	const size = sizeProp ?? defaultSize ?? "md";
	const generatedId = useId();
	const errorId = `${generatedId}-error`;
	const [open, setOpen] = useState(false);
	const { resolve } = useAmphoreLabels("DatePicker");
	const placeholder = resolve("placeholder", placeholderProp);

	const weekStartsOn = weekStartsOnProp ?? locale.options?.weekStartsOn ?? 0;

	const dateFormat = new Intl.DateTimeFormat(locale.code, {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
	const week = value && mode === "week" && getWeek(value, weekStartsOn);
	const formatted = week
		? dateFormat.formatRange(week.from, week.to)
		: value
			? dateFormat.format(value)
			: "";

	const handleSelect = (next: Date | undefined) => {
		onChange(next ?? null);
		setOpen(false);
	};

	const handleSelectWeek = (day: Date) => {
		const picked = getWeek(day, weekStartsOn);
		onChange(picked.from, picked);
		setOpen(false);
	};

	return (
		<div className={cn([styles.wrapper, wrapperClassName])}>
			{label && (
				<label className={styles.label} htmlFor={generatedId}>
					{label}
					{required && <span className={styles.required}>*</span>}
				</label>
			)}

			<Popover
				open={disabled ? false : open}
				onOpenChange={setOpen}
				placement="bottom-start"
				disabled={disabled}
				portal={portal}
				content={
					<DatePickerCalendar
						value={value}
						mode={mode}
						min={min}
						max={max}
						markers={markers}
						onMonthChange={onMonthChange}
						locale={locale}
						weekStartsOn={weekStartsOn}
						onSelectDay={handleSelect}
						onSelectWeek={handleSelectWeek}
					/>
				}
			>
				<button
					type="button"
					id={generatedId}
					className={cn([styles.field, className])}
					data-size={size}
					data-color={color}
					data-disabled={disabled || undefined}
					data-invalid={!!error || undefined}
					disabled={disabled}
					aria-haspopup="dialog"
					aria-describedby={error && !hideError ? errorId : undefined}
				>
					<Picto icon="calendar" className={styles.picto} />
					<span
						className={cn([
							styles.value,
							!value && styles.placeholder,
						])}
					>
						{formatted || placeholder}
					</span>
				</button>
			</Popover>

			{!hideError && (
				<InputErrorMessage id={errorId}>{error}</InputErrorMessage>
			)}
		</div>
	);
};
