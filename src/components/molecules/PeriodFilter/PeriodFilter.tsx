import React from "react";

import {
	addMonths,
	addWeeks,
	addYears,
	endOfMonth,
	endOfWeek,
	endOfYear,
	isSameDay,
	startOfMonth,
	startOfWeek,
	startOfYear,
} from "date-fns";

import { Button } from "@components/atoms";
import {
	DatePicker,
	IDatePickerProps,
} from "@components/molecules/DatePicker/DatePicker";

import { cn } from "@utils/cn";

import { RadioFilter } from "../RadioFilter/RadioFilter";

import styles from "./PeriodFilter.module.scss";

export type TPeriodPreset =
	| "thisWeek"
	| "nextWeek"
	| "lastWeek"
	| "thisMonth"
	| "nextMonth"
	| "lastMonth"
	| "thisYear"
	| "nextYear"
	| "lastYear";

export type TPeriodRangeType = "between" | "starting" | "ending";

const PRESET_LABELS: Record<TPeriodPreset, string> = {
	thisWeek: "This week",
	nextWeek: "Next week",
	lastWeek: "Last week",
	thisMonth: "This month",
	nextMonth: "Next month",
	lastMonth: "Last month",
	thisYear: "This year",
	nextYear: "Next year",
	lastYear: "Last year",
};

const RANGE_TYPE_OPTIONS: { label: string; value: TPeriodRangeType }[] = [
	{ label: "Between", value: "between" },
	{ label: "Starting from", value: "starting" },
	{ label: "Ending by", value: "ending" },
];

const getPresetDates = (preset: TPeriodPreset): { from: Date; to: Date } => {
	const now = new Date();
	const weekOpts = { weekStartsOn: 1 as const };

	switch (preset) {
		case "thisWeek":
			return {
				from: startOfWeek(now, weekOpts),
				to: endOfWeek(now, weekOpts),
			};
		case "nextWeek": {
			const next = addWeeks(now, 1);
			return {
				from: startOfWeek(next, weekOpts),
				to: endOfWeek(next, weekOpts),
			};
		}
		case "lastWeek": {
			const prev = addWeeks(now, -1);
			return {
				from: startOfWeek(prev, weekOpts),
				to: endOfWeek(prev, weekOpts),
			};
		}
		case "thisMonth":
			return { from: startOfMonth(now), to: endOfMonth(now) };
		case "nextMonth": {
			const next = addMonths(now, 1);
			return { from: startOfMonth(next), to: endOfMonth(next) };
		}
		case "lastMonth": {
			const prev = addMonths(now, -1);
			return { from: startOfMonth(prev), to: endOfMonth(prev) };
		}
		case "thisYear":
			return { from: startOfYear(now), to: endOfYear(now) };
		case "nextYear": {
			const next = addYears(now, 1);
			return { from: startOfYear(next), to: endOfYear(next) };
		}
		case "lastYear": {
			const prev = addYears(now, -1);
			return { from: startOfYear(prev), to: endOfYear(prev) };
		}
	}
};

export interface IPeriodFilterProps {
	from?: Partial<IDatePickerProps>;
	to?: Partial<IDatePickerProps>;
	/** Called for whichever side (`from`/`to`) doesn't handle its own `onChange`. */
	onChange?: (fieldName: "from" | "to", value: Date | null) => void;
	/** Shows quick-preset buttons above the range-type selector. Defaults to true. */
	showPresets?: boolean;
	presets?: TPeriodPreset[];
	/** Shows the between/starting/ending selector. Needs its own controlled value/onChange to be useful. */
	range?: {
		value?: TPeriodRangeType | null;
		onChange?: (value: TPeriodRangeType) => void;
	};
	disabled?: boolean;
	className?: string;
}

/**
 * V2 PeriodFilter — a `from`/`to` `DatePicker` pair with quick presets and
 * an optional between/starting/ending selector. Fully prop-driven: v1's
 * version wrote directly into `useFormikContext().setValues` for both the
 * preset buttons and the range-type radios — dropped, `onChange` (or the
 * per-side `from.onChange`/`to.onChange`) is the only way values change.
 */
export const PeriodFilter: React.FC<IPeriodFilterProps> = ({
	from = {},
	to = {},
	onChange,
	showPresets = true,
	presets = ["thisWeek", "thisMonth", "lastMonth"],
	range,
	disabled = false,
	className = "",
}) => {
	const handleChange = (field: "from" | "to", value: Date | null) => {
		const fieldProps = field === "from" ? from : to;
		if (fieldProps.onChange) {
			fieldProps.onChange(value);
			return;
		}
		onChange?.(field, value);
	};

	const isPresetActive = (preset: TPeriodPreset) => {
		const { from: presetFrom, to: presetTo } = getPresetDates(preset);
		return (
			!!from.value &&
			!!to.value &&
			isSameDay(from.value, presetFrom) &&
			isSameDay(to.value, presetTo)
		);
	};

	const applyPreset = (preset: TPeriodPreset) => {
		const { from: presetFrom, to: presetTo } = getPresetDates(preset);
		handleChange("from", presetFrom);
		handleChange("to", presetTo);
	};

	return (
		<div className={cn([styles.wrapper, className])}>
			<div className={styles.pickers}>
				<DatePicker
					label="From"
					value={null}
					{...from}
					disabled={disabled || from.disabled}
					onChange={(value) => handleChange("from", value)}
				/>
				<DatePicker
					label="To"
					value={null}
					{...to}
					disabled={disabled || to.disabled}
					onChange={(value) => handleChange("to", value)}
				/>
			</div>

			{showPresets && (
				<div className={styles.presets}>
					{presets.map((preset) => (
						<Button
							key={preset}
							size="sm"
							variant={
								isPresetActive(preset) ? "solid" : "outline"
							}
							disabled={disabled}
							onClick={() => applyPreset(preset)}
						>
							{PRESET_LABELS[preset]}
						</Button>
					))}
				</div>
			)}

			{range && (
				<RadioFilter
					className={styles.rangeType}
					options={RANGE_TYPE_OPTIONS}
					value={range.value}
					disabled={disabled}
					onChange={(value) =>
						range.onChange?.(value as TPeriodRangeType)
					}
				/>
			)}
		</div>
	);
};
