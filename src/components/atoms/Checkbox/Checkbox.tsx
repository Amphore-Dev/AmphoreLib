import React, { useEffect, useId, useRef } from "react";

import { cn } from "@utils/cn";

import { InputErrorMessage } from "../InputErrorMessage/InputErrorMessage";

import styles from "./Checkbox.module.scss";

export interface ICheckboxProps extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"onChange" | "checked"
> {
	checked?: boolean;
	/** Renders a dash instead of a check, and reports as neither checked nor unchecked. Purely visual — doesn't change `checked`. */
	indeterminate?: boolean;
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
 * V2 Checkbox — fully controlled (checked/onChange only), no ambient
 * form-library awareness. Single fixed size and color (primary) by design:
 * unlike Button/Input, a checkbox isn't a place consumers reach for visual
 * variants — keep the surface small.
 */
export const Checkbox: React.FC<ICheckboxProps> = ({
	checked = false,
	indeterminate = false,
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
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.indeterminate = indeterminate;
		}
	}, [indeterminate]);

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
				<span className={styles.boxWrapper}>
					<input
						{...props}
						ref={inputRef}
						id={inputId}
						type="checkbox"
						className={cn([styles.input, className])}
						checked={checked}
						disabled={disabled}
						aria-invalid={!!error}
						aria-describedby={
							error && !hideError ? errorId : undefined
						}
						onChange={handleChange}
					/>
					<span
						className={styles.box}
						data-checked={checked || indeterminate}
					>
						{indeterminate ? (
							<span className={styles.dash} />
						) : (
							checked && (
								<svg
									className={styles.check}
									viewBox="0 0 16 16"
									fill="none"
									aria-hidden
								>
									<path
										d="M3.5 8.5L6.5 11.5L12.5 4.5"
										stroke="currentColor"
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							)
						)}
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
