import React, { useId } from "react";

import { InputErrorMessage, Radio } from "@components/atoms";

import { cn } from "@utils/cn";

import styles from "./RadioFilter.module.scss";

export interface IRadioFilterProps {
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
}

/**
 * V2 RadioFilter — a group of `Radio` sharing one single-value selection.
 * Fully controlled (`value`/`onChange`), no ambient form-library awareness
 * (see CheckboxFilter's sibling note). `name` groups the native inputs —
 * defaults to a stable generated id so the group works even unnamed.
 */
export const RadioFilter: React.FC<IRadioFilterProps> = ({
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
}) => {
	const groupId = useId();
	const errorId = `${groupId}-error`;
	const groupName = name || groupId;

	return (
		<div className={cn([styles.wrapper, wrapperClassName])}>
			{label && (
				<span className={styles.label}>
					{label}
					{required && <span className={styles.required}>*</span>}
				</span>
			)}

			<div
				className={cn([styles.options, className])}
				role="radiogroup"
				aria-describedby={error && !hideError ? errorId : undefined}
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
					/>
				))}
			</div>

			{!hideError && (
				<InputErrorMessage id={errorId}>{error}</InputErrorMessage>
			)}
		</div>
	);
};
