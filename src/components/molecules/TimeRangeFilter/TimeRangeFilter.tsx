import React, { forwardRef } from "react";

import {
	ITimePickerProps,
	TimePicker,
} from "@components/atoms/TimePicker/TimePicker";

import { deriveTestId } from "@utils/UTestId";
import { cn } from "@utils/cn";

import { ITestIdProps } from "@interfaces/index";

import styles from "./TimeRangeFilter.module.scss";

export interface ITimeRangeFilterProps
	extends
		Omit<React.ComponentPropsWithoutRef<"div">, "onChange" | "children">,
		ITestIdProps {
	from?: Partial<ITimePickerProps>;
	to?: Partial<ITimePickerProps>;
	/** Called when neither `from.onChange` nor `to.onChange` handles the change itself. */
	onChange?: (fieldName: "from" | "to", value: string | null) => void;
	minuteStep?: number;
	hourMax?: number;
	disabled?: boolean;
	className?: string;
}

const TimeRangeFilterBase: React.ForwardRefRenderFunction<
	HTMLDivElement,
	ITimeRangeFilterProps
> = (
	{
		from = {},
		to = {},
		onChange,
		minuteStep = 1,
		hourMax = 23,
		disabled = false,
		className = "",
		...props
	},
	ref
) => {
	const handleChange = (field: "from" | "to", value: string | null) => {
		const fieldProps = field === "from" ? from : to;
		if (fieldProps.onChange) {
			fieldProps.onChange(value);
			return;
		}
		onChange?.(field, value);
	};

	return (
		<div {...props} ref={ref} className={cn([styles.wrapper, className])}>
			<TimePicker
				minuteStep={minuteStep}
				hourMax={hourMax}
				value={null}
				data-testid={deriveTestId(props["data-testid"], "from")}
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
				data-testid={deriveTestId(props["data-testid"], "to")}
				{...to}
				disabled={disabled || to.disabled}
				onChange={(value) => handleChange("to", value)}
			/>
		</div>
	);
};

/**
 * V2 TimeRangeFilter — a `from`/`to` pair of `TimePicker`. Fully prop-driven
 * (`from.value`/`to.value`/`onChange`) — v1's version reached directly into
 * `FormikContext` to read values when its own props didn't supply them;
 * dropped, that binding now happens one layer up in `FieldRenderer`.
 *
 * Native props and `ref` go to the root `<div>`. Derived testids: `-from`,
 * `-to`.
 */
export const TimeRangeFilter = forwardRef(TimeRangeFilterBase);
TimeRangeFilter.displayName = "TimeRangeFilter";
