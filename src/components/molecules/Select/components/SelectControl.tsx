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
		<div className="al__select-control">
			<label
				className={cn([
					"al__select-control__label",
					!!hasValue && "al__select-control__label--has-value",
					disabled && "al__select-control__label--disabled",
					isMulti
						? "al__select-control__label--multi"
						: "al__select-control__label--single",
				])}
			>
				{label}
			</label>
			<components.Control
				{...props}
				className={cn([
					isMulti &&
						hasValue &&
						"al__select-control__control--multi-has-value",
					!isMulti &&
						hasValue &&
						"al__select-control__control--has-value",
				])}
			/>
		</div>
	);
};
