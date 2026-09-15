import React from "react";

import { Pictos, TPictoName } from "@constants/index";

import "./Picto.module.scss";

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
	color,
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
		: {
				"data-testid": icon,
			};

	if (!icon && !src) {
		return null;
	}

	const SvgIcon =
		icon && Pictos[icon]
			? (Pictos[icon] as React.FC<React.SVGProps<SVGSVGElement>>)
			: typeof icon !== "string"
				? icon
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
			data-amphore-svg-wrapper
		>
			{!!SvgIcon && (
				<SvgIcon
					className={className}
					style={{
						// Only set inline color when explicitly passed as a prop — an inline style
						// always wins over any CSS class/module color rule (e.g. Checkbox's ".check"
						// class), so defaulting this to the literal "currentColor" string silently
						// defeated every consumer styling the icon through className instead of `color`.
						...(color ? { color } : {}),
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
					className={className}
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
