import React, { useId } from "react";

import { cn } from "@utils/cn";

import { InputErrorMessage } from "../InputErrorMessage/InputErrorMessage";

import styles from "./Toggle.module.scss";

export interface IToggleProps extends Omit<
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
 * V2 Toggle — fully controlled (checked/onChange only), no ambient
 * form-library awareness. Single fixed size and color (primary), same
 * reasoning as Checkbox/Radio: not a place consumers need visual variants.
 * Native <input type="checkbox" role="switch">, visually hidden under a
 * styled track+thumb — standard switch-replacement pattern.
 */
export const Toggle: React.FC<IToggleProps> = ({
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
				<span className={styles.trackWrapper}>
					<input
						{...props}
						id={inputId}
						type="checkbox"
						role="switch"
						className={cn([styles.input, className])}
						checked={checked}
						disabled={disabled}
						aria-describedby={
							error && !hideError ? errorId : undefined
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
				<InputErrorMessage id={errorId}>{error}</InputErrorMessage>
			)}
		</div>
	);
};
