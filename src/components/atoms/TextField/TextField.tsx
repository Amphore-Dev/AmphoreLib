import React, {
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";

import {
	ErrorMessage,
	Field,
	FormikContext,
	useField,
	useFormikContext,
} from "formik";

import { InfoMessage } from "@components/molecules";

import { cn } from "@utils/cn";

export interface ITextFieldProps
	extends React.InputHTMLAttributes<HTMLInputElement>,
		PropsWithChildren {
	label: string;
	alwaysShowLabel?: boolean;
}

export const TextField: React.FC<ITextFieldProps> = ({
	value,
	label,
	alwaysShowLabel = false,
	type = "text",
	children,
	...props
}) => {
	const isInForm = !!useContext(FormikContext); // detect if the component is inside a Formik form
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

	const getValue = () => (isInForm && field ? field.value : Value) || "";

	useEffect(() => {
		if (value !== undefined && !isInForm && value !== Value && !isInForm) {
			if (typeof value === "string" && props.maxLength)
				setValue(value.slice(0, props.maxLength));
			else setValue(value);
		}
	}, [value]);

	const currentValue = getValue();

	return (
		<>
			<div className="relative rounded-3xl">
				<label
					className={cn([
						"pointer-events-none absolute left-5 top-1/2 max-w-[calc(100%-2rem)] -translate-y-1/2 rounded-lg text-neutral-500 opacity-0 duration-300",
						(!!currentValue || alwaysShowLabel) &&
							"top-0 -translate-y-0 text-xs text-neutral-400 opacity-100",
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
						"h-10 w-full rounded-3xl px-5 py-6 text-sm outline outline-2 outline-neutral-300 duration-500 ",
						meta?.error && meta.touched
							? "outline-error-500"
							: "focus:outline-primary-500",
						props.disabled && "bg-neutral-100 text-neutral-400",
					])}
				/>
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
				<div className="text-xs ml-5 text-neutral-500 mt-1">
					Required
				</div>
			)}
			{!!props.name && isInForm && (
				<div className={cn([!props.required && "mt-3"])}>
					<ErrorMessage
						name={props.name}
						component="div"
						className="mt-8"
					>
						{(msg) => <InfoMessage type="error">{msg}</InfoMessage>}
					</ErrorMessage>
				</div>
			)}
		</>
	);
};
