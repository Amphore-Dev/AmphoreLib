import React from "react";

import { TPictoName } from "@constants/CPictos";

import { Picto } from "../Picto/Picto";
import { Spinner } from "../Spinner/Spinner";

import { cn } from "@utils/cn";

import "./Button.scss";

export interface IButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	color?: "black" | "white" | "primary" | "red" | "green" | "yellow";
	size?: "s" | "m" | "l";
	outline?: boolean;
	disabled?: boolean;
	isLoading?: boolean;
	picto?: TPictoName;
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
	picto,
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
			{!!picto && <Picto icon={picto} className="al__button--picto" />}
			{children}
		</button>
	);
};
