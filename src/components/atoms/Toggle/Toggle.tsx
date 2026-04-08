import React, { InputHTMLAttributes, useCallback } from "react";

import { cn } from "@utils/cn";

import "./Toggle.scss";

export interface IToggleProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
	label: string;
	className?: string;
	labelClassName?: string;
	onChange: (checked: boolean) => void;
}

export const Toggle: React.FC<IToggleProps> = ({
	className,
	labelClassName,
	name,
	disabled,
	label,
	checked,
	onChange,
}) => {
	const wrapperClassNames = cn([
		"amphorelib__toggle",
		disabled && "amphorelib__toggle--disabled",
		className,
	]);

	const labelClassNames = cn([
		"text-m text-black font-medium cursor-pointer",
		labelClassName,
		disabled && "text-neutral-600 cursor-default",
	]);

	const thumbClassNames = cn([
		"amphorelib__toggle__thumb",
		checked && !disabled && "amphorelib__toggle__thumb--checked",
		checked && disabled && "amphorelib__toggle__thumb--checked--disabled",
	]);

	const sliderClassNames = cn([
		"amphorelib__toggle__slider",
		checked && "amphorelib__toggle__slider--checked",
		disabled && "bg-neutral-100",
	]);

	const onChangeCallback = useCallback(
		(
			e:
				| React.MouseEvent<HTMLDivElement>
				| React.KeyboardEvent<HTMLDivElement>
				| React.ChangeEvent<HTMLInputElement>
		) => {
			e.preventDefault();
			e.stopPropagation();
			if (!disabled) {
				onChange(!checked);
			}
		},
		[disabled, onChange, checked]
	);

	return (
		<div
			className={wrapperClassNames}
			role="button"
			tabIndex={disabled ? -1 : 0}
			onClick={onChangeCallback}
			onKeyUp={(event) => {
				if (event.key === "Enter") {
					onChangeCallback(event);
				}
			}}
		>
			<div className={thumbClassNames}>
				<input
					type="checkbox"
					name={name}
					id={name}
					disabled={disabled}
					tabIndex={-1}
					checked={checked}
					onChange={onChangeCallback}
				/>
				<span className={sliderClassNames} />
			</div>
			<label htmlFor={name} className={labelClassNames}>
				{label}
			</label>
		</div>
	);
};
