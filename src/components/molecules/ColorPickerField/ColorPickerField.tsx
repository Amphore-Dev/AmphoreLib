import React, { useId, useState } from "react";

import { type Placement } from "@floating-ui/react";

import { useAmphoreDefaults } from "@theme/useAmphoreDefaults";

import { cn } from "@utils/cn";

import { TColor, TSize } from "@interfaces/index";

import {
	ColorPicker,
	IColorPickerProps,
} from "../../atoms/ColorPicker/ColorPicker";
import { InputErrorMessage } from "../../atoms/InputErrorMessage/InputErrorMessage";
import { Popover } from "../Popover/Popover";

import styles from "./ColorPickerField.module.scss";

export interface IColorPickerFieldProps extends Omit<
	IColorPickerProps,
	"className"
> {
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
	/** Names the field when there's no visible `label`. */
	"aria-label"?: string;
	/** Id of an element naming the field — an external label, like FormRenderer's. */
	"aria-labelledby"?: string;
	className?: string;
	wrapperClassName?: string;
	popoverClassName?: string;
}

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
 * Same naming as DatePicker: label plus value through `aria-labelledby`. With
 * `hideValue` the value stays in the markup, visually hidden, or the swatch's
 * color would be the only thing saying what's picked.
 */
export const ColorPickerField: React.FC<IColorPickerFieldProps> = ({
	label,
	error,
	hideError = false,
	size: sizeProp,
	color = "primary",
	disabled = false,
	required = false,
	placement = "bottom-start",
	hideValue = false,
	"aria-label": ariaLabel,
	"aria-labelledby": ariaLabelledBy,
	className = "",
	wrapperClassName = "",
	popoverClassName = "",
	...pickerProps
}) => {
	const { size: defaultSize } = useAmphoreDefaults();
	const size = sizeProp ?? defaultSize ?? "md";
	const generatedId = useId();
	const errorId = `${generatedId}-error`;
	const labelId = `${generatedId}-label`;
	const valueId = `${generatedId}-value`;
	const labelledBy = ariaLabelledBy ?? (label ? labelId : undefined);
	const [open, setOpen] = useState(false);

	return (
		<div className={cn([styles.wrapper, wrapperClassName])}>
			{label && (
				<label
					id={labelId}
					className={styles.label}
					htmlFor={generatedId}
				>
					{label}
					{required && <span className={styles.required}>*</span>}
				</label>
			)}

			<Popover
				open={disabled ? false : open}
				onOpenChange={setOpen}
				placement={placement}
				disabled={disabled}
				aria-label={ariaLabel}
				aria-labelledby={labelledBy}
				className={cn([styles.popover, popoverClassName])}
				content={<ColorPicker noElevation noPadding {...pickerProps} />}
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
					aria-label={
						ariaLabel && !labelledBy
							? `${ariaLabel}: ${pickerProps.value}`
							: undefined
					}
					aria-labelledby={
						labelledBy ? `${labelledBy} ${valueId}` : undefined
					}
				>
					<span
						className={styles.swatch}
						style={{ backgroundColor: pickerProps.value }}
					/>
					<span
						id={valueId}
						className={hideValue ? styles.srOnly : styles.value}
					>
						{pickerProps.value}
					</span>
				</button>
			</Popover>

			{!hideError && (
				<InputErrorMessage id={errorId}>{error}</InputErrorMessage>
			)}
		</div>
	);
};
