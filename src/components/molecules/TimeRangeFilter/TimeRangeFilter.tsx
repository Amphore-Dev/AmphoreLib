import React from "react";

import {
	ITimePickerProps,
	TimePicker,
} from "@components/atoms/TimePicker/TimePicker";

import { cn } from "@utils/cn";

import styles from "./TimeRangeFilter.module.scss";

export interface ITimeRangeFilterProps {
	from?: Partial<ITimePickerProps>;
	to?: Partial<ITimePickerProps>;
	/** Called when neither `from.onChange` nor `to.onChange` handles the change itself. */
	onChange?: (fieldName: "from" | "to", value: string | null) => void;
	minuteStep?: number;
	hourMax?: number;
	disabled?: boolean;
	className?: string;
}

/**
 * V2 TimeRangeFilter — a `from`/`to` pair of `TimePicker`. Fully prop-driven
 * (`from.value`/`to.value`/`onChange`) — v1's version reached directly into
 * `FormikContext` to read values when its own props didn't supply them;
 * dropped, that binding now happens one layer up in `FieldRenderer`.
 */
export const TimeRangeFilter: React.FC<ITimeRangeFilterProps> = ({
	from = {},
	to = {},
	onChange,
	minuteStep = 1,
	hourMax = 23,
	disabled = false,
	className = "",
}) => {
	const handleChange = (field: "from" | "to", value: string | null) => {
		const fieldProps = field === "from" ? from : to;
		if (fieldProps.onChange) {
			fieldProps.onChange(value);
			return;
		}
		onChange?.(field, value);
	};

	return (
		<div className={cn([styles.wrapper, className])}>
			<TimePicker
				minuteStep={minuteStep}
				hourMax={hourMax}
				value={null}
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
				{...to}
				disabled={disabled || to.disabled}
				onChange={(value) => handleChange("to", value)}
			/>
		</div>
	);
};
