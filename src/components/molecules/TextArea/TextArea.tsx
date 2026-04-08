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
	autoGrow?: boolean | "onMount";
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
		element.style.height = "auto";
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
			"al__textarea__input",
			meta?.error && meta.touched
				? "al__textarea__input--error"
				: "al__textarea__input--focus",
			props.disabled && "al__textarea__input--disabled",
			props.className,
		]),
	};

	return (
		<div className="al__textarea">
			<div
				className={cn([
					"al__textarea__container",
					props.disabled && "al__textarea__container--disabled",
				])}
			>
				<label
					className={cn([
						"al__textarea__label",
						(!!currentValue?.length || alwaysShowLabel) &&
							"al__textarea__label--visible",
						props.disabled && "al__textarea__label--disabled",
					])}
				>
					{label}
				</label>
				{isInForm ? (
					<Field
						{...commonProps}
						innerRef={inputRef}
						onChangeCapture={() => {
							handleAutoGrow();
						}}
					/>
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
			<div className="al__textarea__footer">
				{props.required && <div>Required</div>}
				{!!props.maxLength && (
					<span
						className={cn([
							"al__textarea__char-count",
							props.disabled &&
								"al__textarea__char-count--disabled",
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
