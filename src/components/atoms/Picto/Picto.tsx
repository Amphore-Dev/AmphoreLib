import React, { CSSProperties } from "react";

import { Pictos, TPictoName } from "../../../constants/Pictos";

import { cn } from "@utils/cn";

import { ReactSVG } from "react-svg";

import "./Picto.scss";

export interface IPictoProps {
	icon?: TPictoName;
	src?: string;
	className?: string;
	style?: CSSProperties;
	currentColor?: boolean;
}

export const Picto: React.FC<IPictoProps> = ({
	icon = "logo",
	className = "",
	style,
	src,
	currentColor = true,
}) => {
	return (
		<ReactSVG
			src={src ?? Pictos[icon]}
			style={style}
			data-amphore-svg
			wrapper={undefined}
			className="w-aduto h-aduto [&>*]:w-full [&>*]:h-full"
			beforeInjection={(svg) => {
				const classes = cn([
					"w-full !h-full",
					currentColor && "[&>*]:fill-current",
					className,
				]).split(" ");

				svg.classList.add(...classes.filter(Boolean));
				if (currentColor) {
					svg.style.fill = "currentColor";
					svg.style.stroke = "currentColor";
				}
				if (style) {
					Object.keys(style).forEach((key: any) => {
						// @ts-expect-error
						svg.style[key as any] = style ? style[key] : "";
					});
				}
			}}
		/>
	);
};
