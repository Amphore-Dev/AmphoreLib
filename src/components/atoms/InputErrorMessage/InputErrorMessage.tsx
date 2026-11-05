import React, { ComponentPropsWithoutRef, forwardRef } from "react";

import { cn } from "@utils/cn";

import styles from "./InputErrorMessage.module.scss";

export interface IInputErrorMessageProps extends ComponentPropsWithoutRef<"p"> {
	className?: string;
	/** Pass this to the field's `aria-describedby` so it's read on focus, not just on change. */
	id?: string;
}

/**
 * Shared error text for any form field — Input, Select, Checkbox... all
 * render errors through this. Native props and `ref` go to the `<p>`.
 */
const InputErrorMessageBase: React.ForwardRefRenderFunction<
	HTMLParagraphElement,
	IInputErrorMessageProps
> = ({ children, className = "", ...props }, ref) => {
	if (!children) return null;

	return (
		<p
			{...props}
			ref={ref}
			className={cn([styles.message, className])}
			role="alert"
		>
			{children}
		</p>
	);
};

export const InputErrorMessage = forwardRef(InputErrorMessageBase);
InputErrorMessage.displayName = "InputErrorMessage";
