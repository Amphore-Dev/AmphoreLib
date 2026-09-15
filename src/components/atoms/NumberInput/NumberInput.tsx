import React, { useEffect, useId, useMemo, useState } from "react";

import { useAmphoreDefaults } from "@theme/useAmphoreDefaults";
import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { cn } from "@utils/cn";

import { TColor, TLabel, TSize } from "@interfaces/index";

import { InputErrorMessage } from "../InputErrorMessage/InputErrorMessage";
import { Picto } from "../Picto/Picto";

import styles from "./NumberInput.module.scss";

export interface INumberInputProps extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"onChange" | "value" | "size" | "color" | "min" | "max" | "step"
> {
	/** Controlled value. `null` means empty — distinct from `0`. */
	value: number | null;
	onChange: (value: number | null) => void;
	min?: number;
	max?: number;
	/** Amount the +/- buttons step by. Defaults to 1. */
	step?: number;
	/** Fixed fraction digits shown once blurred/stepped (e.g. 2 -> always "x,00"). Omit for natural precision. */
	decimals?: number;
	/** BCP 47 locale for the decimal/group separators shown at rest. Defaults to "en-US". */
	locale?: string;
	label?: string;
	error?: string;
	hideError?: boolean;
	size?: TSize;
	color?: TColor;
	/** Rendered after the steppers — e.g. a unit ("j", "kg", "%"). Layout: [input | steppers | after]. */
	after?: React.ReactNode;
	className?: string;
	wrapperClassName?: string;
	/** aria-label for the + (increase) stepper button. Defaults to "Increase" (or `NumberInput.increaseLabel` from the nearest AmphoreProvider — see useAmphoreLabels). */
	increaseLabel?: TLabel;
	/** aria-label for the - (decrease) stepper button. Defaults to "Decrease" (or `NumberInput.decreaseLabel` from the nearest AmphoreProvider). */
	decreaseLabel?: TLabel;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TNumberInputLabels = Pick<
	INumberInputProps,
	"increaseLabel" | "decreaseLabel"
>;

const clamp = (n: number, min?: number, max?: number) => {
	let result = n;
	if (min !== undefined) result = Math.max(min, result);
	if (max !== undefined) result = Math.min(max, result);
	return result;
};

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * V2 NumberInput — controlled, but `value` is `number | null` (not
 * `string`): a local `text` state renders in-progress typing ("-", "3,")
 * that doesn't parse to a number yet; `value` stays the source of truth.
 * Plain `<input type="text" inputMode="decimal">`, not `type="number"`
 * (unrestylable spinner, accepts "1e5", scroll-wheel changes the value).
 * Displays raw while focused, `Intl.NumberFormat`-formatted at rest
 * (group separators, `decimals` if set) — `onChange` always gets a plain
 * number regardless.
 */
export const NumberInput: React.FC<INumberInputProps> = ({
	value,
	onChange,
	min,
	max,
	step = 1,
	decimals,
	locale = "en-US",
	label,
	error,
	hideError = false,
	size: sizeProp,
	color = "primary",
	after,
	disabled = false,
	required = false,
	className = "",
	wrapperClassName = "",
	id,
	increaseLabel: increaseLabelProp,
	decreaseLabel: decreaseLabelProp,
	...props
}) => {
	const { size: defaultSize } = useAmphoreDefaults();
	const size = sizeProp ?? defaultSize ?? "md";
	const generatedId = useId();
	const inputId = id ?? generatedId;
	const errorId = `${inputId}-error`;
	const { resolve } = useAmphoreLabels("NumberInput");
	const increaseLabel = resolve("increaseLabel", increaseLabelProp);
	const decreaseLabel = resolve("decreaseLabel", decreaseLabelProp);

	const decimalSeparator = useMemo(() => {
		const part = new Intl.NumberFormat(locale)
			.formatToParts(1.1)
			.find((p) => p.type === "decimal");
		return part?.value ?? ".";
	}, [locale]);

	const rawPattern = useMemo(
		() => new RegExp(`^-?\\d*${escapeRegExp(decimalSeparator)}?\\d*$`),
		[decimalSeparator]
	);

	// Plain, easy-to-edit form: the locale's decimal separator, no grouping.
	const toRaw = (n: number) => String(n).replace(".", decimalSeparator);
	const parseRaw = (s: string) => Number(s.replace(decimalSeparator, "."));

	// Rest form: group separators + fixed `decimals` if given, via Intl —
	// same mechanism `configToCssVars`-adjacent code never needed before,
	// this is the first place the lib actually formats a number for display.
	const formatDisplay = (n: number) =>
		new Intl.NumberFormat(
			locale,
			decimals !== undefined
				? {
						minimumFractionDigits: decimals,
						maximumFractionDigits: decimals,
					}
				: undefined
		).format(n);

	const [text, setText] = useState(
		value === null ? "" : formatDisplay(value)
	);

	// Syncs the displayed text when `value` changes from outside (a
	// consumer resetting the field, or our own commit on blur/step below) —
	// guarded so it doesn't clobber the "-"/"3,"/"" the user is mid-typing
	// when `value` hasn't actually changed underneath them.
	useEffect(() => {
		const parsed = text === "" ? null : parseRaw(text);
		if (parsed !== value || Number.isNaN(parsed)) {
			setText(value === null ? "" : formatDisplay(value));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps -- only re-sync when the external value itself changes
	}, [value]);

	/** Commits a final value and shows it in its formatted (at-rest) form. */
	const commit = (next: number | null) => {
		setText(next === null ? "" : formatDisplay(next));
		onChange(next);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const next = e.target.value;
		// Anything that could still become a valid number is allowed through
		// as-is (a bare "-", a trailing separator) — only fully-formed numbers
		// are reported live; everything else waits for blur to normalize.
		if (rawPattern.test(next)) {
			setText(next);
			if (
				next !== "" &&
				next !== "-" &&
				!next.endsWith(decimalSeparator)
			) {
				const parsed = parseRaw(next);
				if (!Number.isNaN(parsed)) onChange(parsed);
			}
		}
	};

	// Switches back to the plain, group-separator-free form for editing —
	// re-typing digits around an inserted "1 234" space is exactly the
	// friction this avoids.
	const handleFocus = () => {
		setText(value === null ? "" : toRaw(value));
	};

	const handleBlur = () => {
		if (text === "" || text === "-") {
			commit(null);
			return;
		}
		const parsed = parseRaw(text);
		commit(Number.isNaN(parsed) ? null : clamp(parsed, min, max));
	};

	const step_ = (direction: 1 | -1) => {
		if (disabled) return;
		const base = value ?? 0;
		commit(clamp(base + direction * step, min, max));
	};

	return (
		<div className={cn([styles.wrapper, wrapperClassName])}>
			{label && (
				<label className={styles.label} htmlFor={inputId}>
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
					{...props}
					id={inputId}
					type="text"
					inputMode="decimal"
					className={styles.input}
					value={text}
					disabled={disabled}
					required={required}
					aria-invalid={!!error}
					aria-describedby={error && !hideError ? errorId : undefined}
					onChange={handleChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
				/>

				<div className={styles.steppers}>
					<button
						type="button"
						className={styles.stepper}
						tabIndex={-1}
						disabled={
							disabled ||
							(max !== undefined && (value ?? 0) >= max)
						}
						onClick={() => step_(1)}
						aria-label={increaseLabel}
					>
						<Picto icon="chevron" rotation={270} />
					</button>
					<button
						type="button"
						className={styles.stepper}
						tabIndex={-1}
						disabled={
							disabled ||
							(min !== undefined && (value ?? 0) <= min)
						}
						onClick={() => step_(-1)}
						aria-label={decreaseLabel}
					>
						<Picto icon="chevron" rotation={90} />
					</button>
				</div>

				{after && <div className={styles.after}>{after}</div>}
			</div>

			{!hideError && (
				<InputErrorMessage id={errorId}>{error}</InputErrorMessage>
			)}
		</div>
	);
};
