import React, { FormEvent, forwardRef, useId, useRef } from "react";

import { TPictoName } from "@constants/CPictos";
import { MaskitoOptions } from "@maskito/core";
import { useMaskito } from "@maskito/react";

import {
	IWithFormikWrapperProps,
	withFormikWrapper,
} from "@hooks/useFormikField";

import CharCounter from "./CharCounter";
import { IPictoProps, Picto, Spinner, Tooltip } from "@components/atoms";

import { cn } from "@utils/cn";

import "./TextField.scss";

export interface ITextFieldProps
	extends
		Omit<
			React.InputHTMLAttributes<HTMLInputElement>,
			"onChange" | "value" | "pattern" | "size"
		>,
		IWithFormikWrapperProps<string | null, HTMLInputElement> {
	type?: string;
	value?: string | null;
	/** Transforms the raw (possibly non-string) value into the displayed string */
	getValue?: (value: unknown) => string | null;
	onChange?: (
		value: string | null,
		e?: React.ChangeEvent<HTMLInputElement> | FormEvent<HTMLInputElement>
	) => void;
	className?: string;
	wrapperClassName?: string;
	formWrapperClassName?: string;
	disabled?: boolean;
	label?: string;
	labelClassName?: string;
	required?: boolean;
	info?: string;
	name?: string;
	error?: string;
	picto?: Partial<IPictoProps> & {
		icon: TPictoName;
		className?: string;
		onClick?: (
			e: React.MouseEvent<
				HTMLButtonElement | HTMLDivElement | HTMLInputElement
			>
		) => void;
	};
	pattern?: MaskitoOptions;
	hasDefaultBorder?: boolean;
	allowedCharacters?: RegExp;
	hideError?: boolean;
	updateFormikValue?: boolean;
	isClearable?: boolean;
	maxLength?: number;
	showCharCounter?: boolean;
	size?: "s" | "m";
	isLoading?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, ITextFieldProps>(
	(
		{
			type = "text",
			value,
			getValue,
			onChange,
			className = "",
			wrapperClassName = "",
			labelClassName = "",
			disabled = false,
			label,
			required = false,
			info,
			name,
			error,
			picto,
			pattern,
			hasDefaultBorder = true,
			isClearable = false,
			maxLength,
			showCharCounter = false,
			size = "m",
			isLoading = false,
			children,
			...props
		},
		ref
	) => {
		const inputId = useId();
		const displayValue = getValue ? getValue(value) : value;
		const localInputRef = useRef<HTMLInputElement>(null);
		const maskInputRef = pattern && useMaskito({ options: pattern });
		const combinedRef = ref || localInputRef;

		return (
			<div
				className={cn([
					"al__input--wrapper group",
					`al__input--wrapper--${size}`,
					wrapperClassName,
				])}
			>
				<input
					ref={(el: HTMLInputElement | null) => {
						if (el) {
							maskInputRef?.(el); // Apply mask
							if (
								combinedRef &&
								typeof combinedRef !== "function"
							) {
								(
									combinedRef as React.MutableRefObject<HTMLInputElement | null>
								).current = el;
							}
						}
					}}
					type={type}
					onChange={(e) => {
						onChange?.(e?.target?.value, e);
					}}
					className={cn([
						"al__input peer",
						`al__input--${size}`,
						!label && "al__input--no-label",
						error && "al__input--error",
						hasDefaultBorder && "al__input--has-default-border",
						className,
					])}
					disabled={disabled}
					name={name}
					id={props.id || inputId}
					maxLength={maxLength}
					{...props}
					placeholder={""}
					value={displayValue ?? ""}
				/>
				{!!label && (
					<label
						className={cn([
							"al__input__label",
							!!displayValue && "al__input__label--floating",
							required && "al__input__label--required",
							labelClassName,
							"whitespace-nowrap overflow-hidden text-ellipsis",
						])}
						htmlFor={name}
					>
						{label}{" "}
						{!!maxLength && showCharCounter && (
							<span>
								(
								<CharCounter
									maxLength={maxLength}
									length={value?.length}
								/>
								)
							</span>
						)}
					</label>
				)}
				{!isLoading &&
					!!value &&
					!disabled &&
					!props.readOnly &&
					isClearable && (
						<Picto
							icon={"cross"}
							tabIndex={-1}
							wrapperClassName={cn([
								"al__input__icon al__input__icon--absolute al__input--peer",
								error && "al__input__icon--error",
								!!children && "al__input__icon--offset",
							])}
							onClick={() => {
								if (disabled) return;
								if (
									combinedRef &&
									"current" in combinedRef &&
									combinedRef.current
								) {
									combinedRef.current.value = "";
									combinedRef.current.dispatchEvent(
										new Event("input", { bubbles: true })
									);
								}
								onChange?.(null);
							}}
						/>
					)}
				{(!value || disabled) && info && (
					<Tooltip
						tabIndex={-1}
						content={
							<Picto
								icon={"info"}
								className={cn(["al__input__icon"])}
								wrapperClassName={
									error && "al__input__icon--error"
								}
							/>
						}
						buttonClassName={cn([
							"al__input--peer",
							"al__input__icon--absolute",
						])}
						floatingProps={{
							placement: "top",
						}}
						portal={true}
					>
						<div className="al__input__info">{info}</div>
					</Tooltip>
				)}
				{!isLoading && picto && (!value || !isClearable) && (
					<Picto
						tabIndex={-1}
						wrapperClassName={cn([
							"al__input__icon al__input__icon--absolute al__input--peer",
						])}
						className={cn([
							error && "al__input__icon--error",
							picto.className,
						])}
						{...picto}
						onClick={(e) => {
							if (!disabled) {
								picto.onClick?.(e);
							}
						}}
					/>
				)}
				{isLoading && (
					<Spinner
						size={size === "s" ? 1 : 1.5}
						className={cn([
							"al__input__icon al__input__icon--absolute",
						])}
					/>
				)}
				{children}
			</div>
		);
	}
);

TextField.displayName = "TextField";

export const Input = withFormikWrapper<
	ITextFieldProps,
	HTMLInputElement,
	string | null
>(TextField);
