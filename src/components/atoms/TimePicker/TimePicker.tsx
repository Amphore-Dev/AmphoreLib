import React, { useEffect, useId, useRef, useState } from "react";

import { useAmphoreDefaults } from "@theme/useAmphoreDefaults";
import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { cn } from "@utils/cn";

import { TColor, TLabel, TSize } from "@interfaces/index";

import { InputErrorMessage } from "../InputErrorMessage/InputErrorMessage";

import styles from "./TimePicker.module.scss";

export interface ITimePickerProps {
	/** Controlled value, "HH:mm" (24h, zero-padded). `null` means empty. */
	value: string | null;
	onChange: (value: string | null) => void;
	/** Lower bound, "HH:mm". Compares lexicographically — works because both sides are always zero-padded. */
	min?: string;
	/** Upper bound, "HH:mm". */
	max?: string;
	/** Upper bound for the hour segment. Defaults to 23. Set higher (e.g. 999) for duration-style values (e.g. "136:00") — the segment grows to fit up to 3 digits. */
	hourMax?: number;
	/** Amount ArrowUp/ArrowDown step the minute segment by. Defaults to 1. */
	minuteStep?: number;
	label?: string;
	error?: string;
	hideError?: boolean;
	size?: TSize;
	color?: TColor;
	disabled?: boolean;
	required?: boolean;
	className?: string;
	wrapperClassName?: string;
	/** aria-label for the hour segment. Defaults to "Hours" (or `TimePicker.hoursLabel` from the nearest AmphoreProvider — see useAmphoreLabels). When `label` is set, it's suffixed instead ("<label> — hours"). */
	hoursLabel?: TLabel;
	/** aria-label for the minute segment. Defaults to "Minutes" (or `TimePicker.minutesLabel` from the nearest AmphoreProvider). Same suffixing behavior as `hoursLabel`. */
	minutesLabel?: TLabel;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TTimePickerLabels = Pick<
	ITimePickerProps,
	"hoursLabel" | "minutesLabel"
>;

const pad2 = (n: number) => String(n).padStart(2, "0");
const clampInt = (n: number, min: number, max: number) =>
	Math.min(max, Math.max(min, n));

const splitValue = (v: string | null) => {
	if (!v) return { h: "", m: "" };
	const [h = "", m = ""] = v.split(":");
	return { h, m };
};

/**
 * V2 TimePicker — controlled, `value` is a plain "HH:mm" string (24h), not
 * a `Date` — no timezone ambiguity for a time-of-day-only value. Two
 * segmented text inputs (hour/minute), not native `<input type="time">`
 * (unrestylable chrome, same reasoning as NumberInput vs type="number").
 * Two digits auto-advance to the next segment; ArrowUp/Down adjust by 1,
 * wrapping.
 */
export const TimePicker: React.FC<ITimePickerProps> = ({
	value,
	onChange,
	min,
	max,
	hourMax = 23,
	minuteStep = 1,
	label,
	error,
	hideError = false,
	size: sizeProp,
	color = "primary",
	disabled = false,
	required = false,
	className = "",
	wrapperClassName = "",
	hoursLabel: hoursLabelProp,
	minutesLabel: minutesLabelProp,
}) => {
	const { size: defaultSize } = useAmphoreDefaults();
	const size = sizeProp ?? defaultSize ?? "md";
	const generatedId = useId();
	const errorId = `${generatedId}-error`;
	const minuteRef = useRef<HTMLInputElement>(null);
	const { resolve } = useAmphoreLabels("TimePicker");
	const hoursLabel = resolve("hoursLabel", hoursLabelProp);
	const minutesLabel = resolve("minutesLabel", minutesLabelProp);

	const [hourText, setHourText] = useState(splitValue(value).h);
	const [minuteText, setMinuteText] = useState(splitValue(value).m);

	// Syncs from `value` when it changes externally — same guarded pattern
	// as NumberInput, so it doesn't fight an in-progress edit.
	useEffect(() => {
		const parsed = splitValue(value);
		setHourText(parsed.h);
		setMinuteText(parsed.m);
	}, [value]);

	// 3-digit hour segment (e.g. up to 999h for durations) once hourMax > 99.
	const hourDigits = hourMax > 99 ? 3 : 2;

	const commit = (h: string, m: string) => {
		if (h === "" && m === "") {
			onChange(null);
			return;
		}
		const hn = clampInt(h === "" ? 0 : Number(h), 0, hourMax);
		const mn = clampInt(m === "" ? 0 : Number(m), 0, 59);
		let next = `${pad2(hn)}:${pad2(mn)}`;
		if (min && next < min) next = min;
		if (max && next > max) next = max;
		onChange(next);
	};

	const handleSegmentChange =
		(
			setter: (v: string) => void,
			max: number,
			digits: number,
			focusNext?: () => void
		) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const raw = e.target.value;
			if (!new RegExp(`^\\d{0,${digits}}$`).test(raw)) return;
			// Clamped as soon as the last digit lands, not only on blur/commit —
			// otherwise an out-of-range value (e.g. "24" with hourMax=23) stays
			// on screen until something happens to trigger a blur, which isn't
			// guaranteed to happen right away (e.g. user stays focused, or
			// deliberately tabs elsewhere without going through focusNext).
			const next =
				raw.length === digits
					? pad2(clampInt(Number(raw), 0, max))
					: raw;
			setter(next);
			// Deferred: focusNext() moves focus synchronously, which fires a
			// native blur on this input before React re-renders — handleBlur's
			// closure would still see the pre-update text if called inline here.
			if (raw.length === digits) setTimeout(() => focusNext?.(), 0);
		};

	const handleSegmentKeyDown =
		(text: string, setter: (v: string) => void, max: number, step = 1) =>
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
			e.preventDefault();
			const current = text === "" ? -step : Number(text);
			const delta = e.key === "ArrowUp" ? step : -step;
			const span = max + 1;
			const next = (((current + delta) % span) + span) % span;
			setter(pad2(next));
		};

	const handleBlur = () => commit(hourText, minuteText);

	// Selects the segment's existing text on focus so re-entering a value
	// overwrites it cleanly instead of interleaving with the old digits.
	const handleFocus = (e: React.FocusEvent<HTMLInputElement>) =>
		e.target.select();

	return (
		<div className={cn([styles.wrapper, wrapperClassName])}>
			{label && (
				<label className={styles.label}>
					{label}
					{required && <span className={styles.required}>*</span>}
				</label>
			)}

			<div
				className={cn([styles.field, className])}
				data-size={size}
				data-color={color}
				data-disabled={disabled || undefined}
				data-invalid={!!error || undefined}
			>
				<input
					id={generatedId}
					type="text"
					inputMode="numeric"
					maxLength={hourDigits}
					placeholder={"H".repeat(hourDigits)}
					aria-label={
						label
							? `${label} — ${hoursLabel.toLowerCase()}`
							: hoursLabel
					}
					className={styles.segment}
					style={
						hourDigits > 2
							? { width: `${hourDigits + 0.25}ch` }
							: undefined
					}
					value={hourText}
					disabled={disabled}
					aria-invalid={!!error}
					aria-describedby={error && !hideError ? errorId : undefined}
					onChange={handleSegmentChange(
						setHourText,
						hourMax,
						hourDigits,
						() => minuteRef.current?.focus()
					)}
					onKeyDown={handleSegmentKeyDown(
						hourText,
						setHourText,
						hourMax
					)}
					onFocus={handleFocus}
					onBlur={handleBlur}
				/>
				<span className={styles.separator} aria-hidden>
					:
				</span>
				<input
					ref={minuteRef}
					type="text"
					inputMode="numeric"
					maxLength={2}
					placeholder="mm"
					aria-label={
						label
							? `${label} — ${minutesLabel.toLowerCase()}`
							: minutesLabel
					}
					className={styles.segment}
					value={minuteText}
					disabled={disabled}
					aria-invalid={!!error}
					onChange={handleSegmentChange(setMinuteText, 59, 2)}
					onKeyDown={handleSegmentKeyDown(
						minuteText,
						setMinuteText,
						59,
						minuteStep
					)}
					onFocus={handleFocus}
					onBlur={handleBlur}
				/>
			</div>

			{!hideError && (
				<InputErrorMessage id={errorId}>{error}</InputErrorMessage>
			)}
		</div>
	);
};
