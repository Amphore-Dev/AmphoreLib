import React, {
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";

import { ErrorMessage, Field, FormikContext, useField } from "formik";

import { InfoMessage } from "../InfoMessage/InfoMessage";
import { IPictoProps, Picto, Spinner } from "@components/atoms";
import { TPictoName } from "@constants/index";
import { cn } from "@utils/index";

import "./TextField.scss";

export interface ITextFieldProps
	extends React.InputHTMLAttributes<HTMLInputElement>,
		PropsWithChildren {
	label?: string;
	alwaysShowLabel?: boolean;
	getValue?: (currentValue: unknown) => unknown;
	autoDetectFormik?: boolean;
	picto?: TPictoName;
	pictoProps?: IPictoProps;
	onPictoClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	isLoading?: boolean;
	size?: "s" | "m";
}

export const TextField: React.FC<ITextFieldProps> = ({
	value,
	label = "",
	alwaysShowLabel = false,
	type = "text",
	children,
	getValue,
	autoDetectFormik = true,
	picto,
	pictoProps,
	onPictoClick,
	isLoading = false,
	size = "m",
	...props
}) => {
	const isInForm = autoDetectFormik && !!useContext(FormikContext);
	const Wrapper = isInForm ? Field : "input";

	const [field, meta, helpers] =
		props.name && isInForm
			? useField(props.name)
			: [undefined, undefined, undefined];

	const [Value, setValue] =
		useState<React.InputHTMLAttributes<HTMLInputElement>["value"]>("");

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
		isInForm && field
			? helpers.setValue(event.target.value)
			: setValue(event.target.value);

	const getFieldValue = () => {
		const fieldValue = (isInForm && field ? field.value : Value) || "";
		return getValue ? getValue(fieldValue) : fieldValue;
	};

	useEffect(() => {
		if (value !== undefined && !isInForm && value !== Value) {
			if (typeof value === "string" && props.maxLength)
				setValue(value.slice(0, props.maxLength));
			else setValue(value);
		}
	}, [value]);

	const currentValue = getFieldValue();
	const hasError = !!meta?.error && meta?.touched;
	const hasPictoOrLoading = !!picto || isLoading;
	const isDisabled = !!props.disabled;
	const showCharLimit =
		!!props.maxLength &&
		props.maxLength > 0 &&
		type !== "number" &&
		typeof currentValue !== "number";

	return (
		<div className={cn(["al__textfield"])}>
			<div
				className={cn([
					"textfield-wrapper",
					(!!label || showCharLimit) && "has-label",
					size,
				])}
			>
				{!!label && (
					<label
						className={cn([
							!!currentValue || alwaysShowLabel ? "active" : "",
							isDisabled ? "disabled" : "",
						])}
					>
						{label}
					</label>
				)}

				<Wrapper
					onChange={handleChange}
					{...props}
					type={type}
					placeholder={
						props.placeholder !== undefined
							? props.placeholder
							: label
					}
					value={currentValue}
					className={cn([
						"textfield-input appearance-textfield",
						!!currentValue && "has-value",
						hasError && "error",
						isDisabled && "disabled",
						hasPictoOrLoading && "has-picto",
						props.className,
					])}
				/>

				{!isLoading && !!picto && (
					<Picto
						icon={picto}
						onClick={onPictoClick}
						{...pictoProps}
						className={cn([
							"picto",
							onPictoClick && "clickable",
							pictoProps?.className,
						])}
					/>
				)}

				{isLoading && (
					<Spinner
						className={cn(["spinner", pictoProps?.className])}
					/>
				)}

				{showCharLimit && (
					<span
						className={cn(["char-limit", isDisabled && "disabled"])}
					>
						{currentValue?.length || 0}/{props.maxLength}
					</span>
				)}

				{children}
			</div>

			{props.required && <div className="required">Required</div>}

			{!!props.name && isInForm && (
				<ErrorMessage name={props.name}>
					{(msg: string) => (
						<InfoMessage
							type="error"
							className={cn([
								"info-message",
								props.required && "with-required",
							])}
						>
							{msg}
						</InfoMessage>
					)}
				</ErrorMessage>
			)}
		</div>
	);
};
