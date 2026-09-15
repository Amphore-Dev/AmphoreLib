import React, { useId } from "react";

import { useAmphoreDefaults } from "@theme/useAmphoreDefaults";
import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import type { TPictoName } from "@constants/index";

import { getPicto } from "@utils/UPicto";
import { cn } from "@utils/cn";

import { TColor, TLabel, TSize } from "@interfaces/index";

import { InputErrorMessage } from "../InputErrorMessage/InputErrorMessage";
import type { IPictoProps } from "../Picto/Picto";
import { Picto } from "../Picto/Picto";

import styles from "./Input.module.scss";

export interface IInputProps extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"onChange" | "value" | "size" | "color"
> {
	/** Controlled value. Always `string` — pass `""`, never `null`/`undefined`, to stay controlled. */
	value?: string;
	onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
	label?: string;
	error?: string;
	hideError?: boolean;
	size?: TSize;
	color?: TColor;
	/** Leading icon (see Picto) — an icon name, or an `IPictoProps` object to pass other Picto props (rotation, color...). */
	picto?: TPictoName | IPictoProps;
	/** Shows a clear (×) button when the field has a value. */
	isClearable?: boolean;
	/** Rendered after the clear button — e.g. a visibility toggle (PasswordField), a unit. Same convention as NumberInput's `after`. */
	after?: React.ReactNode;
	className?: string;
	wrapperClassName?: string;
	/** aria-label for the clear (×) button. Defaults to "Clear" (or `common.clear`/`Input.clearLabel` from the nearest AmphoreProvider — see useAmphoreLabels). No effect without `isClearable`. */
	clearLabel?: TLabel;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TInputLabels = Pick<IInputProps, "clearLabel">;

/**
 * V2 Input — fully controlled (value/onChange only), no ambient form-library
 * awareness. See memory/react-library-fields-audit.md: v1's withFormikWrapper
 * silently rewired every input's behavior based on Formik context, which is
 * exactly what V2 does not reproduce. Wire it to Formik/RHF/whatever from
 * the outside (`<Field as={Input} />`, a controller, or your own state).
 */
export const Input: React.FC<IInputProps> = ({
	value = "",
	onChange,
	label,
	error,
	hideError = false,
	size: sizeProp,
	color = "primary",
	picto,
	isClearable = false,
	after,
	disabled = false,
	required = false,
	className = "",
	wrapperClassName = "",
	id,
	clearLabel: clearLabelProp,
	...props
}) => {
	const { size: defaultSize } = useAmphoreDefaults();
	const size = sizeProp ?? defaultSize ?? "md";
	const generatedId = useId();
	const inputId = id ?? generatedId;
	const errorId = `${inputId}-error`;
	const { resolve } = useAmphoreLabels("Input");
	const clearLabel = resolve("clearLabel", clearLabelProp, "clear");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e.target.value, e);
	};

	const handleClear = () => {
		if (!onChange) return;
		const fakeEvent = {
			target: { value: "" },
		} as React.ChangeEvent<HTMLInputElement>;
		onChange("", fakeEvent);
	};

	return (
		<div className={cn([styles.wrapper, wrapperClassName])}>
			{label && (
				<label className={styles.label} htmlFor={inputId}>
					{label}
					{required && <span className={styles.required}>*</span>}
				</label>
			)}

			<div
				className={cn([styles.field, className])}
				data-size={size}
				data-color={color}
				data-disabled={disabled || undefined}
				data-invalid={!!error || undefined}
			>
				{!!picto && (
					<Picto {...getPicto(picto)} className={styles.picto} />
				)}

				<input
					placeholder={label}
					{...props}
					id={inputId}
					className={styles.input}
					value={value}
					disabled={disabled}
					required={required}
					aria-invalid={!!error}
					aria-describedby={error && !hideError ? errorId : undefined}
					onChange={handleChange}
				/>

				{isClearable && value && !disabled && (
					<button
						type="button"
						className={styles.clear}
						onClick={handleClear}
						aria-label={clearLabel}
					>
						<Picto icon="cross" />
					</button>
				)}

				{after}
			</div>

			{!hideError && (
				<InputErrorMessage id={errorId}>{error}</InputErrorMessage>
			)}
		</div>
	);
};
