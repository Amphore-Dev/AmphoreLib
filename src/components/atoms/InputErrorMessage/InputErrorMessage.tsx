import React from "react";

import { cn } from "@utils/cn";

import styles from "./InputErrorMessage.module.scss";

export interface IInputErrorMessageProps {
	children?: React.ReactNode;
	className?: string;
	/** Pass this to the field's `aria-describedby` so it's read on focus, not just on change. */
	id?: string;
}

/** Shared error text for any form field — Input, Select, Checkbox... all render errors through this. */
export const InputErrorMessage: React.FC<IInputErrorMessageProps> = ({
	children,
	className = "",
	id,
}) => {
	if (!children) return null;

	return (
		<p id={id} className={cn([styles.message, className])} role="alert">
			{children}
		</p>
	);
};
