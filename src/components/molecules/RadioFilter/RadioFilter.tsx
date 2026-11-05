import React, { forwardRef, useId } from "react";

import { InputErrorMessage, Radio } from "@components/atoms";

import { deriveTestId } from "@utils/UTestId";
import { cn } from "@utils/cn";

import { ITestIdProps, TElementProps } from "@interfaces/index";

import styles from "./RadioFilter.module.scss";

export interface IRadioFilterProps
	extends
		Omit<
			React.ComponentPropsWithoutRef<"div">,
			"onChange" | "defaultValue" | "children"
		>,
		ITestIdProps {
	options: { label: string; value: string; disabled?: boolean }[];
	/** Controlled value — the currently-selected option's value, or `""`/`null` for none. */
	value?: string | null;
	onChange?: (value: string) => void;
	name?: string;
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

const RadioFilterBase: React.ForwardRefRenderFunction<
	HTMLDivElement,
	IRadioFilterProps
> = (
	{
		options,
		value = "",
		onChange,
		name,
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
	const groupName = name || groupId;

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
				role="radiogroup"
				aria-describedby={
					cn([ariaDescribedBy, error && !hideError && errorId]) ||
					undefined
				}
			>
				{options.map((option) => (
					<Radio
						key={option.value}
						name={groupName}
						label={option.label}
						checked={option.value === value}
						disabled={disabled || option.disabled}
						onChange={() => onChange?.(option.value)}
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

/**
 * V2 RadioFilter — a group of `Radio` sharing one single-value selection.
 * Fully controlled (`value`/`onChange`), no ambient form-library awareness
 * (see CheckboxFilter's sibling note). `name` groups the native inputs —
 * defaults to a stable generated id so the group works even unnamed.
 *
 * Native props, `className` and `ref` go to the `role="radiogroup"` element,
 * `wrapperProps` to the outer container. Derived testids:
 * `-option-<value>`, `-error`.
 */
export const RadioFilter = forwardRef(RadioFilterBase);
RadioFilter.displayName = "RadioFilter";
