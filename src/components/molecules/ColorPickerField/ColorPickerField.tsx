import React, { forwardRef, useId, useState } from "react";

import { type Placement } from "@floating-ui/react";
import omit from "lodash/omit.js";
import pick from "lodash/pick.js";

import { useAmphoreDefaults } from "@theme/useAmphoreDefaults";

import { deriveTestId } from "@utils/UTestId";
import { cn } from "@utils/cn";

import { ITestIdProps, TColor, TElementProps, TSize } from "@interfaces/index";

import { COLOR_PICKER_OPTION_KEYS } from "../../atoms/ColorPicker/CColorPicker";
import {
	ColorPicker,
	IColorPickerProps,
} from "../../atoms/ColorPicker/ColorPicker";
import { InputErrorMessage } from "../../atoms/InputErrorMessage/InputErrorMessage";
import { Popover } from "../Popover/Popover";

import styles from "./ColorPickerField.module.scss";

export interface IColorPickerFieldProps
	extends
		Pick<
			IColorPickerProps,
			| (typeof COLOR_PICKER_OPTION_KEYS)[number]
			| "noPadding"
			| "noElevation"
		>,
		Omit<
			React.ComponentPropsWithoutRef<"button">,
			"value" | "onChange" | "color" | "type" | "children"
		>,
		ITestIdProps {
	label?: string;
	error?: string;
	hideError?: boolean;
	size?: TSize;
	color?: TColor;
	disabled?: boolean;
	required?: boolean;
	placement?: Placement;
	/** Hides the hex value text next to the swatch. Defaults to false. */
	hideValue?: boolean;
	className?: string;
	wrapperClassName?: string;
	/** Native props of the outer container (label, trigger and error message). */
	wrapperProps?: TElementProps<"div">;
	popoverClassName?: string;
}

const ColorPickerFieldBase: React.ForwardRefRenderFunction<
	HTMLButtonElement,
	IColorPickerFieldProps
> = (
	{
		label,
		error,
		hideError = false,
		size: sizeProp,
		color = "primary",
		disabled = false,
		required = false,
		placement = "bottom-start",
		hideValue = false,
		className = "",
		wrapperClassName = "",
		wrapperProps,
		popoverClassName = "",
		noPadding = true,
		noElevation = true,
		id,
		"aria-describedby": ariaDescribedBy,
		...props
	},
	ref
) => {
	const { size: defaultSize } = useAmphoreDefaults();
	const size = sizeProp ?? defaultSize ?? "md";
	const generatedId = useId();
	const triggerId = id ?? generatedId;
	const errorId = `${triggerId}-error`;
	const pickerProps = pick(props, COLOR_PICKER_OPTION_KEYS);
	const triggerProps = omit(props, COLOR_PICKER_OPTION_KEYS);
	const testId = props["data-testid"];
	const [open, setOpen] = useState(false);

	return (
		<div
			{...wrapperProps}
			className={cn([
				styles.wrapper,
				wrapperClassName,
				wrapperProps?.className,
			])}
		>
			{label && (
				<label className={styles.label} htmlFor={triggerId}>
					{label}
					{required && <span className={styles.required}>*</span>}
				</label>
			)}

			<Popover
				open={disabled ? false : open}
				onOpenChange={setOpen}
				placement={placement}
				disabled={disabled}
				className={cn([styles.popover, popoverClassName])}
				data-testid={deriveTestId(testId, "popover")}
				content={
					<ColorPicker
						noElevation={noElevation}
						noPadding={noPadding}
						{...pickerProps}
					/>
				}
			>
				<button
					{...triggerProps}
					ref={ref}
					type="button"
					id={triggerId}
					className={cn([styles.field, className])}
					data-size={size}
					data-color={color}
					data-disabled={disabled || undefined}
					data-invalid={!!error || undefined}
					disabled={disabled}
					aria-haspopup="dialog"
					aria-describedby={
						cn([ariaDescribedBy, error && !hideError && errorId]) ||
						undefined
					}
				>
					<span
						className={styles.swatch}
						style={{ backgroundColor: pickerProps.value }}
					/>
					{!hideValue && (
						<span className={styles.value}>
							{pickerProps.value}
						</span>
					)}
				</button>
			</Popover>

			{!hideError && (
				<InputErrorMessage
					id={errorId}
					data-testid={deriveTestId(testId, "error")}
				>
					{error}
				</InputErrorMessage>
			)}
		</div>
	);
};

/**
 * V2 ColorPickerField — a compact swatch+hex trigger (same field-box as
 * Input/DatePicker) that opens the full ColorPicker in a Popover. v1's
 * version had this backwards: the always-visible trigger WAS the full
 * ColorPicker, with a small swatch preview hidden inside a click-triggered
 * Tooltip — the opposite of what a "field" should show at rest.
 *
 * The visible frame (padding/shadow) around the open picker is
 * ColorPicker's own (`noPadding`/`noElevation`, forwarded straight through
 * via `...pickerProps` — no field-specific prop needed) — the wrapping
 * Popover is made flush here so there's exactly one frame, not two nested
 * ones.
 *
 * Native props, `className` and `ref` go to the trigger `<button>`, the
 * picker's own options to the picker, `wrapperProps` to the outer container.
 * Derived testids: `-popover`, `-error`.
 */
export const ColorPickerField = forwardRef(ColorPickerFieldBase);
ColorPickerField.displayName = "ColorPickerField";
