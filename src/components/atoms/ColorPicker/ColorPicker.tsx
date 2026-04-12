import React from "react";

import ReactGPicker from "react-gcolor-picker";

import { PICKER_DEFAULT_COLORS } from "@constants/index";
import { cn } from "@utils/index";
import { IPropsMain } from "react-gcolor-picker/dist/components/Colorpicker/types";

import "./ColorPicker.scss";

export interface IColorPickerProps extends IPropsMain {
	theme?: string;
	className?: string;
}

export const ColorPicker: React.FC<IColorPickerProps> = (props) => {
	return (
		<div
			className={cn([
				"ColorPicker",
				props?.theme === "dark" ? " dark" : "",
				props?.className,
			])}
		>
			<ReactGPicker
				format="hex"
				defaultColors={PICKER_DEFAULT_COLORS}
				{...props}
			/>
		</div>
	);
};
