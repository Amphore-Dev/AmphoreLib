import React, { forwardRef, useId } from "react";

import { deriveTestId } from "@utils/UTestId";
import { cn } from "@utils/cn";

import { ITestIdProps, TElementProps } from "@interfaces/index";

import { InputErrorMessage } from "../InputErrorMessage/InputErrorMessage";

import styles from "./Toggle.module.scss";

export interface IToggleProps
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
 * V2 Toggle — fully controlled (checked/onChange only), no ambient
 * form-library awareness. Single fixed size and color (primary), same
 * reasoning as Checkbox/Radio: not a place consumers need visual variants.
 * Native <input type="checkbox" role="switch">, visually hidden under a
 * styled track+thumb — standard switch-replacement pattern.
 *
 * Native props, `className` and `ref` go to the `<input>`, `wrapperProps` to
 * the outer container. Derived testid: `-error`.
 */
const ToggleBase: React.ForwardRefRenderFunction<
	HTMLInputElement,
	IToggleProps
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
				<span className={styles.trackWrapper}>
					<input
						{...props}
						ref={ref}
						id={inputId}
						type="checkbox"
						role="switch"
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
					<span className={styles.track} data-checked={checked}>
						<span className={styles.thumb} />
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

export const Toggle = forwardRef(ToggleBase);
Toggle.displayName = "Toggle";
