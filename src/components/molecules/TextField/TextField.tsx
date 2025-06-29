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
	const isInForm = autoDetectFormik && !!useContext(FormikContext); // detect if the component is inside a Formik form
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
		if (value !== undefined && !isInForm && value !== Value && !isInForm) {
			if (typeof value === "string" && props.maxLength)
				setValue(value.slice(0, props.maxLength));
			else setValue(value);
		}
	}, [value]);

	const currentValue = getFieldValue();

	return (
		<div className="al__text-field">
			<div className="relative rounded-3xl">
				<label
					className={cn([
						"pointer-events-none absolute left-5 top-1/2 max-w-[calc(100%-2rem)] -translate-y-1/2 rounded-lg text-neutral-500 opacity-0 duration-300",
						(!!currentValue || alwaysShowLabel) &&
							"top-1 -translate-y-0 text-xs text-neutral-400 opacity-100",
						props.disabled && "text-neutral-300",
					])}
				>
					{label}
				</label>
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
						"h-10 w-full rounded-[3rem] px-5 pt-7 pb-6 text-sm outline-none border-2 border-neutral-300 duration-500",
						meta?.error && meta.touched
							? "border-error-500"
							: "focus:border-primary-500",
						props.disabled && "bg-neutral-100 text-neutral-400",
						props.className,
						(!!picto || isLoading) && "pr-[3.25rem]",
					])}
				/>
				{!isLoading && !!picto && (
					<Picto
						icon={picto}
						onClick={onPictoClick}
						{...pictoProps}
						className={cn([
							"absolute right-4 top-1/2 w-7 h-7 -translate-y-1/2 text-neutral-400",
							onPictoClick && "hover:text-neutral-500",
							pictoProps?.className,
						])}
					/>
				)}
				{isLoading && (
					<Spinner
						className={cn([
							"absolute right-4 top-1/2 w-7 h-7 -translate-y-1/2 text-neutral-40",
							pictoProps?.className,
						])}
					/>
				)}
				{!!props.maxLength &&
					props.maxLength > 0 &&
					type !== "number" &&
					typeof currentValue !== "number" && (
						<span
							className={cn([
								"pointer-events-none absolute bottom-0 right-6 text-xs text-neutral-400",
								props.disabled && "text-neutral-300",
							])}
						>
							{currentValue?.length || 0}/{props.maxLength}
						</span>
					)}
				{children}
			</div>
			{props.required && (
				<div className="text-xs text-left ml-5 text-neutral-500 mt-1">
					Required
				</div>
			)}
			{!!props.name && isInForm && (
				<ErrorMessage name={props.name}>
					{(msg: string) => (
						<InfoMessage
							type="error"
							className={cn([!props.required ? "mt-2" : "mt-1"])}
						>
							{msg}
						</InfoMessage>
					)}
				</ErrorMessage>
			)}
		</div>
	);
};
