import React, { InputHTMLAttributes } from "react";

import { cn } from "@utils/cn";

export interface ICheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
	indeterminate?: boolean;
	label?: string | React.ReactNode;
}

export const Checkbox: React.FC<ICheckboxProps> = ({
	label,
	indeterminate,
	...props
}) => {
	const genChildren = () => (
		<input
			data-checkbox
			data-indeterminate={indeterminate}
			type="checkbox"
			{...props}
			className={cn([
				props.disabled ? "cursor-not-allowed" : "cursor-pointer",
				props.disabled && !!label && "!opacity-100",
			])}
		/>
	);

	if (label) {
		return (
			<label
				className={cn([
					"flex w-fit cursor-pointer items-center gap-2",
					props.disabled && "cursor-not-allowed opacity-60",
				])}
			>
				{genChildren()}
				{label}
			</label>
		);
	}
	return genChildren();
};
