import React, {
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";

import { ErrorMessage, Field, FormikContext, useField } from "formik";

import { InfoMessage } from "../InfoMessage/InfoMessage";

import { cn } from "@utils/cn";

import "./TextArea.scss";

export interface ITextAreaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
		PropsWithChildren {
	label?: string;
	alwaysShowLabel?: boolean;
	autoGrow?: boolean;
}

export const TextArea: React.FC<ITextAreaProps> = ({
	value,
	label = "",
	alwaysShowLabel = false,
	children,
	autoGrow = true,
	...props
}) => {
	const inputRef = React.useRef<HTMLTextAreaElement>(null);
	const isInForm = !!useContext(FormikContext); // detect if the component is inside a Formik form

	const [field, meta, helpers] =
		props.name && isInForm
			? useField(props.name)
			: [undefined, undefined, undefined];

	const [Value, setValue] =
		useState<React.TextareaHTMLAttributes<HTMLTextAreaElement>["value"]>(
			""
		);

	const handleChange = (value: string) =>
		isInForm && field ? helpers.setValue(value) : setValue(value);

	const getValue = () => (isInForm && field ? field.value : Value) || "";

	useEffect(() => {
		if (value !== undefined && !isInForm && value !== Value && !isInForm) {
			if (typeof value === "string" && props.maxLength)
				setValue(value.slice(0, props.maxLength));
			else setValue(value);
		}
		setTimeout(() => {
			handleAutoGrow();
		}, 30);
	}, [value]);

	const currentValue = getValue();

	const handleAutoGrow = () => {
		if (!autoGrow || !inputRef.current) return;
		const element = inputRef.current;
		if (element.value === "") {
			element.style.height = "5px";
			return;
		}
		element.style.height = "5px";
		element.style.height = element.scrollHeight + "px";
	};

	const commonProps = {
		"data-al-textarea": true,
		...props,
		as: "textarea",
		placeholder:
			props.placeholder !== undefined ? props.placeholder : label,
		value: currentValue,
		className: cn([
			"bg-transparent h-10 w-full pt-0 mt-6 px-5 pb-6 text-sm outline-none min-h-[200px] max-h-[400px] min-w-full",
			meta?.error && meta.touched
				? "border-error-500"
				: "focus:border-primary-500",
			props.disabled && "text-neutral-400",
			props.className,
		]),
	};

	return (
		<div>
			<div
				className={cn([
					"flex relative rounded-3xl border-2 border-neutral-300 bg-white overflow-visible",
					props.disabled && "bg-neutral-100",
				])}
			>
				<label
					className={cn([
						"pointer-events-none absolute left-0 px-5 top-5 z-[1] text-neutral-400 opacity-0 duration-300 w-full rounded-t-3xl",
						(!!currentValue?.length || alwaysShowLabel) &&
							"top-0 text-xs text-neutral-400 !opacity-100 pt-2",
						props.disabled && "text-neutral-300 bg-neutral-100",
					])}
				>
					{label}
				</label>
				{isInForm ? (
					<Field {...commonProps} innerRef={inputRef} />
				) : (
					<textarea
						{...props}
						{...commonProps}
						onChange={(
							event: React.ChangeEvent<HTMLTextAreaElement>
						) => {
							handleChange(event.target.value);
							handleAutoGrow();
						}}
						ref={inputRef}
					/>
				)}

				{children}
			</div>
			<div className="flex mt-1 text-neutral-400 text-xs text-left px-5">
				{props.required && <div>Required</div>}
				{!!props.maxLength && (
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
