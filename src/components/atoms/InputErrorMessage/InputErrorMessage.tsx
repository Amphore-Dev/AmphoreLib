import React from "react";

import { cn } from "@utils/cn";

import "./InputErrorMessage.scss";

export interface IInputErrorMessageProps {
	children: React.ReactNode;
	className?: string;
}

export const InputErrorMessage: React.FC<IInputErrorMessageProps> = ({
	children,
	className,
}) => {
	return children ? (
		<p className={cn(["al__input__error-message", className])}>
			{children}
		</p>
	) : null;
};
