import React, { useId, useState } from "react";

import { DayPicker, type Locale } from "react-day-picker";
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

export interface IDatePickerProps {
	/** Controlled value — a plain `Date` (local midnight), or `null` for empty. */
	value: Date | null;
	onChange: (value: Date | null) => void;
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
	className?: string;
	wrapperClassName?: string;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TDatePickerLabels = Pick<IDatePickerProps, "placeholder">;

/**
 * V2 DatePicker — controlled, `value` is a plain `Date` (not a string).
 * Trigger is a text-like field (same _field.scss box as Input/Select);
 * the grid is react-day-picker, restyled via its own --rdp-* vars, opened
 * in a `Popover`.
 */
export const DatePicker: React.FC<IDatePickerProps> = ({
	value,
	onChange,
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

	const formatted = value
		? new Intl.DateTimeFormat(locale.code, {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			}).format(value)
		: "";

	const handleSelect = (next: Date | undefined) => {
		onChange(next ?? null);
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
				content={
					<DayPicker
						className={styles.calendar}
						styles={{
							chevron: { width: "0.875rem", height: "0.875rem" },
						}}
						mode="single"
						locale={locale}
						selected={value ?? undefined}
						defaultMonth={value ?? undefined}
						onSelect={handleSelect}
						disabled={[
							...(min ? [{ before: min }] : []),
							...(max ? [{ after: max }] : []),
						]}
						// DayPicker's own prop, not raw DOM autofocus.
						// eslint-disable-next-line jsx-a11y/no-autofocus
						autoFocus
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
