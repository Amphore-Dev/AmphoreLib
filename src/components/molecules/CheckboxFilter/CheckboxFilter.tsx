import React, { forwardRef, useId } from "react";

import { Checkbox, InputErrorMessage } from "@components/atoms";

import { deriveTestId } from "@utils/UTestId";
import { cn } from "@utils/cn";

import { ITestIdProps, TElementProps } from "@interfaces/index";

import styles from "./CheckboxFilter.module.scss";

export interface ICheckboxesFilterProps
	extends
		Omit<
			React.ComponentPropsWithoutRef<"div">,
			"onChange" | "defaultValue" | "children"
		>,
		ITestIdProps {
	options: { label: string; value: string; disabled?: boolean }[];
	/** Controlled value — the list of currently-checked option values. */
	value?: string[];
	onChange?: (value: string[]) => void;
	label?: string;
	error?: string;
	hideError?: boolean;
	disabled?: boolean;
	required?: boolean;
	className?: string;
	wrapperClassName?: string;
	/** Native props of the outer container (label, group and error message). */
	wrapperProps?: TElementProps<"div">;
}

/**
 * V2 CheckboxFilter — a group of `Checkbox` sharing one multi-value
 * `string[]`. Fully controlled (`value`/`onChange`), no ambient form-library
 * awareness — unlike v1's equivalent, which reached into Formik itself via
 * `useFormikField` for its error display. Binding to a form (Formik or
 * otherwise) happens one layer up, in `FieldRenderer`.
 *
 * Native props, `className` and `ref` go to the `role="group"` element,
 * `wrapperProps` to the outer container. Derived testids:
 * `-option-<value>`, `-error`.
 */
const CheckboxFilterBase: React.ForwardRefRenderFunction<
	HTMLDivElement,
	ICheckboxesFilterProps
> = (
	{
		options,
		value = [],
		onChange,
		label,
		error,
		hideError = false,
		disabled = false,
		required = false,
		className = "",
		wrapperClassName = "",
		wrapperProps,
		"aria-describedby": ariaDescribedBy,
		...props
	},
	ref
) => {
	const groupId = useId();
	const errorId = `${groupId}-error`;

	const handleChange = (optionValue: string, checked: boolean) => {
		const next = checked
			? [...value, optionValue]
			: value.filter((v) => v !== optionValue);
		onChange?.(next);
	};

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
				<span className={styles.label}>
					{label}
					{required && <span className={styles.required}>*</span>}
				</span>
			)}

			<div
				{...props}
				ref={ref}
				className={cn([styles.options, className])}
				role="group"
				aria-describedby={
					cn([ariaDescribedBy, error && !hideError && errorId]) ||
					undefined
				}
			>
				{options.map((option) => (
					<Checkbox
						key={option.value}
						label={option.label}
						checked={value.includes(option.value)}
						disabled={disabled || option.disabled}
						onChange={(checked) =>
							handleChange(option.value, checked)
						}
						hideError
						data-testid={deriveTestId(
							props["data-testid"],
							"option",
							option.value
						)}
					/>
				))}
			</div>

			{!hideError && (
				<InputErrorMessage
					id={errorId}
					data-testid={deriveTestId(props["data-testid"], "error")}
				>
					{error}
				</InputErrorMessage>
			)}
		</div>
	);
};

export const CheckboxFilter = forwardRef(CheckboxFilterBase);
CheckboxFilter.displayName = "CheckboxFilter";
