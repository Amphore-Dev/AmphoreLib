import React from "react";

import { Pictos, TPictoName } from "@constants/index";
import { cn } from "@utils/index";

import "./Picto.scss";

export interface IPictoProps {
	icon?: TPictoName;
	src?: string;
	className?: string;
	wrapperClassName?: string;
	style?: React.CSSProperties;
	currentColor?: boolean;
	onClick?: (
		event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
	) => void;
	rotation?: number;
	color?: string;
	disabled?: boolean;
}

export const Picto: React.FC<IPictoProps> = ({
	icon,
	className = "",
	color = "currentColor",
	rotation = 0,
	style,
	src,
	currentColor = true,
	onClick,
	wrapperClassName,
	disabled = false,
}) => {
	const Wrapper = onClick ? "button" : "div";
	const wrapperProps = onClick
		? {
				disabled,
				onClick,
				tabIndex: 0,
				type: "button" as HTMLButtonElement["type"],
			}
		: {};

	if (!icon && !src) {
		return null;
	}

	const SvgIcon = icon
		? (Pictos[icon] as React.FC<React.SVGProps<SVGSVGElement>>)
		: null;

	if (!SvgIcon && !src) {
		console.warn(
			`Picto: No icon found for "${icon}". Please check the icon name or provide a valid src.`
		);
		return null;
	}

	return (
		<Wrapper
			{...wrapperProps}
			className={wrapperClassName}
			data-testid={icon}
		>
			{!!SvgIcon && (
				<SvgIcon
					className={cn(["!text-neutral-500", className])}
					style={{
						color,
						opacity: disabled ? 0.25 : 1,
						transform: rotation
							? `rotate(${rotation}deg)`
							: undefined,
						...style,
					}}
					data-amphore-svg={currentColor ? "current" : ""}
				/>
			)}
			{src && (
				<img
					src={src}
					alt={icon || "Picto"}
					className={cn([className])}
					style={{
						...style,
						color: currentColor ? "currentColor" : undefined,
					}}
					data-amphore-svg
				/>
			)}
		</Wrapper>
	);
};
