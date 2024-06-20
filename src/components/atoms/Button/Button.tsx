import React from "react";

import { Spinner } from "@components/atoms";

import { cn } from "@utils/cn";

import "./Button.scss";

export interface IButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	color?: "black" | "white" | "primary";
	size?: "s" | "m" | "l";
	outline?: boolean;
	disabled?: boolean;
	isLoading?: boolean;
	className?: string;
}

export const Button = ({
	children,
	color = "primary",
	size = "m",
	outline = false,
	disabled = false,
	isLoading = false,
	className = "",
	...props
}: IButtonProps) => {
	const hasOutlineClass = outline && `btn--outline`;
	const isLoadingClass = isLoading && `btn--loading`;
	const classNames = cn([
		`btn text-white btn--${color} btn--${size} ${hasOutlineClass} ${isLoadingClass}`,
		className,
	]);

	return (
		<button
			className={classNames}
			{...props}
			disabled={disabled || isLoading}
		>
			{isLoading && <Spinner size={1.25} />}
			{children}
		</button>
	);
};
