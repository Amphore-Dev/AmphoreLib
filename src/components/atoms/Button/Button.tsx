import React from "react";

import { Spinner } from "../Spinner/Spinner";

import { cn } from "@utils/cn";

import "./Button.scss";

export interface IButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	color?: "black" | "white" | "primary";
	size?: "s" | "m" | "l";
	outline?: boolean;
	disabled?: boolean;
	isLoading?: boolean;
}

export const Button: React.FC<IButtonProps> = ({
	children,
	color = "primary",
	size = "m",
	outline = false,
	disabled = false,
	isLoading = false,
	type = "button",
	className = "",
	...props
}) => {
	const classNames = cn([
		`al__button text-white al__button--${color} al__button--${size}`,
		outline && `al__button--outline`,
		isLoading && `al__button--loading`,
		className,
	]);

	return (
		<button
			className={classNames}
			type={type}
			{...props}
			disabled={disabled || isLoading}
			data-amphore_btn
		>
			{isLoading && <Spinner size={1.25} />}
			{children}
		</button>
	);
};
