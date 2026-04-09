import React, { InputHTMLAttributes, useCallback } from "react";

import { cn } from "@utils/cn";

import "./Range.scss";

export interface IRangeProps
	extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
	min?: number;
	max?: number;
	step?: number;
	value?: number;
	onChange?: (value: number) => void;
	className?: string;
	trackClassName?: string;
	centered?: boolean;
}

export const Range: React.FC<IRangeProps> = ({
	min = 0,
	max = 100,
	step = 1,
	value = 0,
	onChange,
	disabled,
	className,
	trackClassName,
	centered = false,
	...props
}) => {
	const percent = ((value - min) / (max - min)) * 100;
	const centerPercent = (((min + max) / 2 - min) / (max - min)) * 100;

	const fillLeft = centered ? Math.min(percent, centerPercent) : 0;
	const fillWidth = centered ? Math.abs(percent - centerPercent) : percent;

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			onChange?.(Number(e.target.value));
		},
		[onChange]
	);

	return (
		<div
			className={cn([
				"al__range",
				disabled && "al__range--disabled",
				className,
			])}
		>
			<div className={cn(["al__range__track", trackClassName])}>
				<div
					className="al__range__fill"
					style={{ left: `${fillLeft}%`, width: `${fillWidth}%` }}
				/>
			</div>
			<input
				{...props}
				type="range"
				min={min}
				max={max}
				step={step}
				value={value}
				disabled={disabled}
				onChange={handleChange}
				className="al__range__input"
			/>
		</div>
	);
};
