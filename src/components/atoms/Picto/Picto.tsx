import React, { CSSProperties, Fragment } from "react";

import { Pictos, TPictoName } from "@constants/index";
import { cn } from "@utils/index";

import { ReactSVG } from "react-svg";

import "./Picto.scss";

export interface IPictoProps {
	icon?: TPictoName;
	src?: string;
	className?: string;
	style?: CSSProperties;
	currentColor?: boolean;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Picto: React.FC<IPictoProps> = ({
	icon = "logo",
	className = "",
	style,
	src,
	currentColor = true,
	onClick,
}) => {
	const Wrapper = onClick ? "button" : Fragment;
	const wrapperProps = onClick ? { onClick } : {};
	return (
		<Wrapper {...wrapperProps}>
			<ReactSVG
				src={src ?? Pictos[icon]}
				style={style}
				data-amphore-svg-wrapper
				wrapper={undefined}
				beforeInjection={(svg) => {
					const classes = cn([
						"w-full h-full",
						currentColor && "[&>*]:fill-current",
						className,
					]).split(" ");
					svg.setAttribute(
						"data-amphore-svg",
						currentColor ? "current" : ""
					);

					svg.classList.add(...classes.filter(Boolean));
					if (currentColor) {
						svg.style.fill = "currentColor";
						svg.style.stroke = "currentColor";
					}
					if (style) {
						Object.keys(style).forEach((key) => {
							svg.style[key] = style ? style[key] : "";
						});
					}
				}}
			/>
		</Wrapper>
	);
};
