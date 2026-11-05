import React from "react";

import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import {
	ITimePickerProps,
	TimePicker,
} from "@components/atoms/TimePicker/TimePicker";

import { cn } from "@utils/cn";

import type { TLabel } from "@interfaces/index";

import styles from "./TimeRangeFilter.module.scss";

export interface ITimeRangeFilterProps {
	from?: Partial<ITimePickerProps>;
	to?: Partial<ITimePickerProps>;
	/** Called when neither `from.onChange` nor `to.onChange` handles the change itself. */
	onChange?: (fieldName: "from" | "to", value: string | null) => void;
	minuteStep?: number;
	hourMax?: number;
	disabled?: boolean;
	/** Names the first time when `from.label` doesn't. Defaults to "From" (or `TimeRangeFilter.fromLabel` from the nearest AmphoreProvider — see useAmphoreLabels). */
	fromLabel?: TLabel;
	/** Names the second time when `to.label` doesn't. Defaults to "To" (or `TimeRangeFilter.toLabel` from the nearest AmphoreProvider). */
	toLabel?: TLabel;
	/** Names the pair when something else labels it. */
	"aria-label"?: string;
	/** Id of an element naming the pair — an external label, like FormRenderer's. */
	"aria-labelledby"?: string;
	className?: string;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TTimeRangeFilterLabels = Pick<
	ITimeRangeFilterProps,
	"fromLabel" | "toLabel"
>;

/**
 * V2 TimeRangeFilter — a `from`/`to` pair of `TimePicker`. Fully prop-driven
 * (`from.value`/`to.value`/`onChange`) — v1's version reached directly into
 * `FormikContext` to read values when its own props didn't supply them;
 * dropped, that binding now happens one layer up in `FieldRenderer`.
 *
 * Unlabelled, the two pickers read as "Hours", "Minutes", "Hours", "Minutes":
 * each one is a group named after its side of the range.
 */
export const TimeRangeFilter: React.FC<ITimeRangeFilterProps> = ({
	from = {},
	to = {},
	onChange,
	minuteStep = 1,
	hourMax = 23,
	disabled = false,
	fromLabel: fromLabelProp,
	toLabel: toLabelProp,
	"aria-label": ariaLabel,
	"aria-labelledby": ariaLabelledBy,
	className = "",
}) => {
	const { resolve } = useAmphoreLabels("TimeRangeFilter");
	const fromLabel = resolve("fromLabel", fromLabelProp);
	const toLabel = resolve("toLabel", toLabelProp);

	const handleChange = (field: "from" | "to", value: string | null) => {
		const fieldProps = field === "from" ? from : to;
		if (fieldProps.onChange) {
			fieldProps.onChange(value);
			return;
		}
		onChange?.(field, value);
	};

	return (
		<div
			role="group"
			aria-label={ariaLabel}
			aria-labelledby={ariaLabelledBy}
			className={cn([styles.wrapper, className])}
		>
			<TimePicker
				minuteStep={minuteStep}
				hourMax={hourMax}
				value={null}
				aria-label={from.label ? undefined : fromLabel}
				{...from}
				disabled={disabled || from.disabled}
				onChange={(value) => handleChange("from", value)}
			/>
			<span className={styles.separator} aria-hidden>
				—
			</span>
			<TimePicker
				minuteStep={minuteStep}
				hourMax={hourMax}
				value={null}
				aria-label={to.label ? undefined : toLabel}
				{...to}
				disabled={disabled || to.disabled}
				onChange={(value) => handleChange("to", value)}
			/>
		</div>
	);
};
