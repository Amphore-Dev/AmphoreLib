import React, { AnchorHTMLAttributes } from "react";

import { cn } from "@utils/cn";

import { TColor } from "@interfaces/index";

import { Picto } from "../Picto/Picto";

import styles from "./Link.module.scss";

export type TLinkUnderline = "always" | "hover" | "none";

export interface ILinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	color?: TColor;
	underline?: TLinkUnderline;
	/** Adds target="_blank" rel="noopener noreferrer" and a trailing icon. */
	external?: boolean;
	disabled?: boolean;
	className?: string;
}

/**
 * V2 Link — styled anchor. No `size` prop, unlike most other atoms: a link
 * normally inherits its font-size from the surrounding text (that's how a
 * native <a> behaves too), there's no "standalone" size scale that makes
 * sense the way there is for Button/Input.
 *
 * Renders a plain <a> — for SPA routing, wrap your router's own Link
 * component with these props/styles instead of this one trying to be
 * polymorphic; keeping it a plain anchor means it works with zero
 * router-specific code, same "no ambient coupling" rule as the form fields
 * (see memory/react-library-fields-audit.md).
 */
export const Link: React.FC<ILinkProps> = ({
	color = "primary",
	underline = "hover",
	external = false,
	disabled = false,
	className = "",
	children,
	href,
	...props
}) => {
	return (
		<a
			{...props}
			{...(external
				? { target: "_blank", rel: "noopener noreferrer" }
				: {})}
			href={disabled ? undefined : href}
			aria-disabled={disabled || undefined}
			data-color={color}
			data-underline={underline}
			data-disabled={disabled || undefined}
			tabIndex={disabled ? -1 : props.tabIndex}
			className={cn([styles.link, className])}
		>
			{children}
			{external && <Picto icon="externalLink" className={styles.icon} />}
		</a>
	);
};
