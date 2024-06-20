import React, { CSSProperties } from "react";

import { Pictos, TPictoName } from "@constants/Pictos";

import { cn } from "@utils/cn";

import { ReactSVG } from "react-svg";

import "./Picto.scss";

export interface IPictoProps {
	icon: TPictoName;
	className?: string;
	style?: CSSProperties;
}

export const Picto: React.FC<IPictoProps> = ({
	icon,
	className = "",
	style,
}) => {
	return (
		<ReactSVG
			src={Pictos[icon]}
			style={style}
			className="w-aduto h-aduto [&>*]:w-full [&>*]:h-full"
			beforeInjection={(svg) => {
				const classes = cn([
					"w-full !h-full",
					"[&>*]:fill-current",
					className,
				]).split(" ");

				svg.classList.add(...classes.filter(Boolean));
				svg.style.fill = "currentColor";
				svg.style.stroke = "currentColor";
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
