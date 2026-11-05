import React, { forwardRef, useId } from "react";

import { deriveTestId } from "@utils/UTestId";
import { cn } from "@utils/cn";

import { ITestIdProps, TElementProps } from "@interfaces/index";

import { InputErrorMessage } from "../InputErrorMessage/InputErrorMessage";

import styles from "./Radio.module.scss";

export interface IRadioProps
	extends
		Omit<React.ComponentPropsWithoutRef<"input">, "onChange" | "checked">,
		ITestIdProps {
	checked?: boolean;
	onChange?: (
		checked: boolean,
		e: React.ChangeEvent<HTMLInputElement>
	) => void;
	label?: string;
	error?: string;
	hideError?: boolean;
	className?: string;
	wrapperClassName?: string;
	/** Native props of the outer container (the row and the error message). */
	wrapperProps?: TElementProps<"div">;
}

/**
 * V2 Radio — fully controlled (checked/onChange only), no ambient
 * form-library awareness. Single fixed size and color (primary), same
 * reasoning as Checkbox: not a place consumers need visual variants.
 * Group several with the same `name` for native radio-group behavior.
 *
 * Native props, `className` and `ref` go to the `<input>`, `wrapperProps` to
 * the outer container. Derived testid: `-error`.
 */
const RadioBase: React.ForwardRefRenderFunction<
	HTMLInputElement,
	IRadioProps
> = (
	{
		checked = false,
		onChange,
		label,
		error,
		hideError = false,
		disabled = false,
		className = "",
		wrapperClassName = "",
		wrapperProps,
		id,
		"aria-describedby": ariaDescribedBy,
		...props
	},
	ref
) => {
	const generatedId = useId();
	const inputId = id ?? generatedId;
	const errorId = `${inputId}-error`;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e.target.checked, e);
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
			<label
				className={styles.row}
				data-disabled={disabled || undefined}
				htmlFor={inputId}
			>
				<span className={styles.circleWrapper}>
					<input
						{...props}
						ref={ref}
						id={inputId}
						type="radio"
						className={cn([styles.input, className])}
						checked={checked}
						disabled={disabled}
						aria-describedby={
							cn([
								ariaDescribedBy,
								error && !hideError && errorId,
							]) || undefined
						}
						onChange={handleChange}
					/>
					<span className={styles.circle} data-checked={checked}>
						{checked && <span className={styles.dot} />}
					</span>
				</span>

				{label && <span className={styles.label}>{label}</span>}
			</label>

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

export const Radio = forwardRef(RadioBase);
Radio.displayName = "Radio";
