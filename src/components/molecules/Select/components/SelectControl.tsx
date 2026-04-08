import React from "react";

import { components } from "react-select";

import { cn } from "@utils/cn";

import "./SelectControl.scss";

// nsm typing react-select is too hard
// eslint-disable-next-line
export const SelectControl: React.FC<any> = (props) => {
	const { label, disabled, value, isMulti } = props.selectProps;

	const hasValue = Array.isArray(value) ? !!value.length : !!value;

	return (
		<div className="al__select-ctrl">
			<label
				className={cn([
					"al__select-ctrl__label",
					!!hasValue && "al__select-ctrl__label--has-value",
					disabled && "al__select-ctrl__label--disabled",
					isMulti
						? "al__select-ctrl__label--multi"
						: "al__select-ctrl__label--single",
				])}
			>
				{label}
			</label>
			<components.Control
				{...props}
				className={cn([
					isMulti &&
						hasValue &&
						"al__select-ctrl__control--multi-has-value",
					!isMulti &&
						hasValue &&
						"al__select-ctrl__control--has-value",
				])}
			/>
		</div>
	);
};
