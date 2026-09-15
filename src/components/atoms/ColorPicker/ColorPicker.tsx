import React from "react";

import ReactGPicker from "react-gcolor-picker";
import { type IPropsMain } from "react-gcolor-picker/dist/components/Colorpicker/types";

import { cn } from "@utils/cn";

import styles from "./ColorPicker.module.scss";

const DEFAULT_COLORS = [
	"#EB144C",
	"#FF3000",
	"#FF6900",
	"#FF8733",
	"#FCB900",
	"#7BDCB5",
	"#00D084",
	"#00DDDD",
	"#8ED1FC",
	"#0693E3",
	"#3663DD",
	"#ABB8C3",
	"#607d8b",
	"#F78DA7",
	"#ee68c8",
	"#ba68c8",
	"#9900EF",
	"#000000",
];

export interface IColorPickerProps extends Omit<
	IPropsMain,
	"onChange" | "value"
> {
	value: string;
	onChange: (value: string) => void;
	/** Removes the panel's own padding — e.g. when it's already framed by whatever renders it (a Popover with its own padding). */
	noPadding?: boolean;
	/** Removes the panel's own drop shadow (border stays). */
	noElevation?: boolean;
	className?: string;
}

/**
 * V2 ColorPicker — thin themed wrapper around `react-gcolor-picker`
 * (solid + gradient panels, its own tabs/inputs), whose own controlled
 * `value`/`onChange` contract already matches this lib's — restyled via
 * `:global()` overrides on its class names (see .module.scss) instead of
 * a from-scratch color picker, same reasoning as DatePicker/react-day-picker.
 */
export const ColorPicker: React.FC<IColorPickerProps> = ({
	value,
	onChange,
	format = "hex",
	defaultColors = DEFAULT_COLORS,
	noPadding = false,
	noElevation = false,
	className = "",
	...props
}) => (
	<div
		className={cn([styles.picker, className])}
		data-no-padding={noPadding || undefined}
		data-no-elevation={noElevation || undefined}
	>
		<ReactGPicker
			{...props}
			value={value}
			onChange={onChange}
			format={format}
			defaultColors={defaultColors}
		/>
	</div>
);
