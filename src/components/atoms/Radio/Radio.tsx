import React, { useId } from "react";

import { cn } from "@utils/cn";

import { InputErrorMessage } from "../InputErrorMessage/InputErrorMessage";

import styles from "./Radio.module.scss";

export interface IRadioProps extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"onChange" | "checked"
> {
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
}

/**
 * V2 Radio — fully controlled (checked/onChange only), no ambient
 * form-library awareness. Single fixed size and color (primary), same
 * reasoning as Checkbox: not a place consumers need visual variants.
 * Group several with the same `name` for native radio-group behavior.
 */
export const Radio: React.FC<IRadioProps> = ({
	checked = false,
	onChange,
	label,
	error,
	hideError = false,
	disabled = false,
	className = "",
	wrapperClassName = "",
	id,
	...props
}) => {
	const generatedId = useId();
	const inputId = id ?? generatedId;
	const errorId = `${inputId}-error`;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e.target.checked, e);
	};

	return (
		<div className={cn([styles.wrapper, wrapperClassName])}>
			<label
				className={styles.row}
				data-disabled={disabled || undefined}
				htmlFor={inputId}
			>
				<span className={styles.circleWrapper}>
					<input
						{...props}
						id={inputId}
						type="radio"
						className={cn([styles.input, className])}
						checked={checked}
						disabled={disabled}
						aria-describedby={
							error && !hideError ? errorId : undefined
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
				<InputErrorMessage id={errorId}>{error}</InputErrorMessage>
			)}
		</div>
	);
};
