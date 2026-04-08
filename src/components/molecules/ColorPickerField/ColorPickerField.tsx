import React, { PropsWithChildren, useRef } from "react";

import useOutsideAlerter from "@hooks/useOutsideAlerter";

import {
	ColorPicker,
	IColorPickerProps,
	ITooltipProps,
	Tooltip,
} from "@components/atoms";
import { cn } from "@utils/index";

import "./ColorPickerField.scss";

export interface IColorPickerFieldProps
	extends PropsWithChildren,
		IColorPickerProps {
	className?: string;
	tooltipProps?: ITooltipProps;
}

export const ColorPickerField: React.FC<IColorPickerFieldProps> = ({
	children,
	className = "bg-white",
	tooltipProps = {
		className: "max-w-[350px]",
		floatingProps: {
			placement: "right-start",
		},
	},
	...props
}) => {
	const [isOpen, setIsOpen] = React.useState(false);

	const pickerRef = useRef<HTMLDivElement>(null);
	const content = children ? (
		<>{children}</>
	) : (
		<div
			style={{
				backgroundColor: props.value,
			}}
			className="al__color-picker-field__preview"
		/>
	);

	useOutsideAlerter(pickerRef, () => {
		setIsOpen(false);
	});

	return (
		<Tooltip
			{...tooltipProps}
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			content={
				<div className="al__color-picker-field__tooltip-content">
					{content}
				</div>
			}
			trigger="click"
			closeOnLeave={true}
			className={cn(["al__color-picker-field", tooltipProps.className])}
		>
			<div ref={pickerRef}>
				<ColorPicker {...props} className={className} />
			</div>
		</Tooltip>
	);
};
