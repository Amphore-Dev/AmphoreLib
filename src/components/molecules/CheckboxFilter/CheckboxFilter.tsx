import React, { useId } from "react";

import { Checkbox, InputErrorMessage } from "@components/atoms";

import { cn } from "@utils/cn";

import styles from "./CheckboxFilter.module.scss";

export interface ICheckboxesFilterProps {
	options: { label: string; value: string; disabled?: boolean }[];
	/** Controlled value — the list of currently-checked option values. */
	value?: string[];
	onChange?: (value: string[]) => void;
	label?: string;
	error?: string;
	hideError?: boolean;
	disabled?: boolean;
	required?: boolean;
	/** Names the group when there's no visible `label`. */
	"aria-label"?: string;
	/** Id of an element naming the group — an external label, like FormRenderer's. */
	"aria-labelledby"?: string;
	className?: string;
	wrapperClassName?: string;
}

/**
 * V2 CheckboxFilter — a group of `Checkbox` sharing one multi-value
 * `string[]`. Fully controlled (`value`/`onChange`), no ambient form-library
 * awareness — unlike v1's equivalent, which reached into Formik itself via
 * `useFormikField` for its error display. Binding to a form (Formik or
 * otherwise) happens one layer up, in `FieldRenderer`.
 */
export const CheckboxFilter: React.FC<ICheckboxesFilterProps> = ({
	options,
	value = [],
	onChange,
	label,
	error,
	hideError = false,
	disabled = false,
	required = false,
	"aria-label": ariaLabel,
	"aria-labelledby": ariaLabelledBy,
	className = "",
	wrapperClassName = "",
}) => {
	const groupId = useId();
	const errorId = `${groupId}-error`;
	const labelId = `${groupId}-label`;

	const handleChange = (optionValue: string, checked: boolean) => {
		const next = checked
			? [...value, optionValue]
			: value.filter((v) => v !== optionValue);
		onChange?.(next);
	};

	return (
		<div className={cn([styles.wrapper, wrapperClassName])}>
			{label && (
				<span id={labelId} className={styles.label}>
					{label}
					{required && <span className={styles.required}>*</span>}
				</span>
			)}

			<div
				className={cn([styles.options, className])}
				role="group"
				aria-labelledby={
					ariaLabelledBy ?? (label ? labelId : undefined)
				}
				aria-label={ariaLabel}
				aria-describedby={error && !hideError ? errorId : undefined}
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
						error={error}
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
