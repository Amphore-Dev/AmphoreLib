import React from "react";

import type { TPictoName } from "@constants/index";

import { getPicto } from "@utils/UPicto";
import { cn } from "@utils/cn";

import { Tooltip } from "../../molecules/Tooltip/Tooltip";
import { Picto } from "../Picto/Picto";
import type { IPictoProps } from "../Picto/Picto";

import styles from "./NavItem.module.scss";

export interface INavItemProps extends Omit<
	React.AnchorHTMLAttributes<HTMLAnchorElement>,
	"className" | "children"
> {
	href: string;
	/** Highlights this item as the current page — router-agnostic: the caller decides (`useLocation`, `NavLink`'s own match logic, ...) and passes the result in. */
	isActive?: boolean;
	/** Icon-only: hides `children`, shows them as a Tooltip on hover/focus instead. */
	isReduced?: boolean;
	picto?: TPictoName | IPictoProps;
	children?: React.ReactNode;
	className?: string;
}

/**
 * V2 NavItem — a persistent nav-sidebar link (as opposed to Dropdown/
 * ContextMenu's `TMenuItem`, a transient action in a floating popup — no
 * relation despite the similar name). Renders a plain `<a href>`, same
 * "no ambient router coupling" rule as Link/Breadcrumb: for real SPA
 * routing, spread your router's own navigation over it (an `onClick` that
 * calls `e.preventDefault()` + `navigate(href)` is the common, accessible
 * way to do that without needing a polymorphic `as` — every native anchor
 * prop passes through).
 */
export const NavItem: React.FC<INavItemProps> = ({
	href,
	isActive = false,
	isReduced = false,
	picto,
	children,
	className = "",
	...props
}) => {
	const link = (
		<a
			{...props}
			href={href}
			className={cn([styles.link, className])}
			data-active={isActive || undefined}
			data-reduced={isReduced || undefined}
			aria-current={isActive ? "page" : undefined}
		>
			{!!picto && <Picto {...getPicto(picto)} className={styles.picto} />}
			{!isReduced && children}
		</a>
	);

	return (
		<Tooltip
			placement="right"
			disabled={!isReduced}
			content={typeof children === "string" ? children : undefined}
		>
			{link}
		</Tooltip>
	);
};
