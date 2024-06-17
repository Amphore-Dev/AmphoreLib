import React from "react";
import "./Button.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "../Spinner/Spinner";
import { cn } from "@utils/cn";

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
