import React from "react";

import { components } from "react-select";

import { cn } from "@utils/cn";

// nsm typing react-select is too hard
// eslint-disable-next-line
export const SelectControl: React.FC<any> = (props) => {
	const { label, disabled, value, isMulti } = props.selectProps;

	const hasValue = Array.isArray(value) ? !!value.length : !!value;

	return (
		<div className="relative">
			<label
				className={cn([
					"pointer-events-none absolute top-1/2 max-w-[calc(100%-2rem)] -translate-y-1/2 rounded-lg text-neutral-500 opacity-0 duration-300 z-10",
					!!hasValue &&
						"top-2 -translate-y-0 text-xs text-neutral-400 opacity-100",
					disabled && "text-neutral-300",
					isMulti ? "left-6" : "left-5",
				])}
			>
				{label}
			</label>
			<components.Control
				{...props}
				className={cn([
					isMulti && hasValue && "!pt-5 !pb-1",
					!isMulti && hasValue && "!pt-3 !pb-1",
				])}
			/>
		</div>
	);
};
