import React, {
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";

import { ErrorMessage, Field, FormikContext, useField } from "formik";

import { InfoMessage } from "../InfoMessage/InfoMessage";

import { cn } from "@utils/cn";

export interface ITextAreaProps
	extends React.InputHTMLAttributes<HTMLInputElement>,
		PropsWithChildren {
	label?: string;
	alwaysShowLabel?: boolean;
	autoGrow?: boolean;
}

export const TextArea: React.FC<ITextAreaProps> = ({
	value,
	label = "",
	alwaysShowLabel = false,
	type = "text",
	children,
	autoGrow = true,
	...props
}) => {
	const isInForm = !!useContext(FormikContext); // detect if the component is inside a Formik form
	const Wrapper = isInForm ? Field : "textarea";

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

	const handleAutoGrow = (element: HTMLTextAreaElement) => {
		if (!autoGrow) return;
		if (element.value === "") {
			element.style.height = "5px";
			return;
		}
		element.style.height = "5px";
		element.style.height = element.scrollHeight + "px";
	};

	return (
		<div>
			<div
				className={cn([
					"flex relative rounded-3xl overflow-hidden border-2 border-neutral-300 bg-transparent bg-white",
					props.disabled && "bg-neutral-100",
				])}
			>
				<label
					className={cn([
						"pointer-events-none absolute left-0 px-5 top-5 z-[1] text-neutral-400 opacity-0 duration-300 w-full bg-white",
						(!!currentValue?.length || alwaysShowLabel) &&
							"top-0 text-xs text-neutral-400 !opacity-100 pt-2",
						props.disabled && "text-neutral-300 bg-neutral-100",
					])}
				>
					{label}
				</label>
				<Wrapper
					onChange={handleChange}
					onChangeCapture={(e) => {
						handleAutoGrow(e.target as HTMLTextAreaElement);
					}}
					{...props}
					type={type}
					as="textarea"
					placeholder={
						props.placeholder !== undefined
							? props.placeholder
							: label
					}
					value={currentValue}
					className={cn([
						"bg-white h-10 w-full pt-0 mt-6 px-5 pb-6  text-sm outline-none min-h-[200px] max-h-[400px]",
						meta?.error && meta.touched
							? "border-error-500"
							: "focus:border-primary-500",
						props.disabled && "bg-neutral-100 text-neutral-400",
						props.className,
					])}
				/>

				{children}
			</div>
			<div className="flex mt-1 text-neutral-400 text-xs text-left px-5">
				{props.required && <div>Required</div>}
				{!!props.maxLength &&
					props.maxLength > 0 &&
					type !== "number" &&
					typeof currentValue !== "number" && (
						<span
							className={cn([
								"ml-auto pointer-events-none",
								props.disabled && "text-neutral-300",
							])}
						>
							{currentValue?.length || 0}/{props.maxLength}
						</span>
					)}
			</div>
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
