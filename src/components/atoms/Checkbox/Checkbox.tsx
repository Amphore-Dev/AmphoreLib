import React, { InputHTMLAttributes } from "react";
import "./Checkbox.scss";

export interface ICheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
	indeterminate?: boolean;
	label?: string;
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
			{...props}
			type="checkbox"
		/>
	);

	if (label) {
		return (
			<label className="flex items-center gap-2 cursor-pointer w-fit">
				{genChildren()}
				{label}
			</label>
		);
	}
	return genChildren();
};
