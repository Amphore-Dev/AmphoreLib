import React from "react";

import type { TPictoName } from "@constants/index";

import { cn } from "@utils/cn";

import { NavItem } from "../../atoms/NavItem/NavItem";
import type { IPictoProps } from "../../atoms/Picto/Picto";

import styles from "./NavList.module.scss";

export interface TNavItem {
	href: string;
	label: React.ReactNode;
	picto?: TPictoName | IPictoProps;
	/** Router-agnostic: the caller decides (see NavItem) and passes the result in. */
	isActive?: boolean;
	/** Drops this entry entirely, without needing to filter `items` yourself before passing them — role-based access control (or any other business rule) stays the caller's job. */
	hidden?: boolean;
}

export interface INavListProps {
	items: TNavItem[];
	/** Icon-only sidebar (see NavItem's own `isReduced`). */
	isReduced?: boolean;
	/** Called for every item's native `onClick` — the common way to wire real SPA routing without a router-specific `as`/render prop (see NavItem's own doc comment). Receives the clicked item. */
	onNavigate?: (item: TNavItem, event: React.MouseEvent) => void;
	className?: string;
}

/**
 * V2 NavList — a persistent nav-sidebar list, data-driven (`items`) over
 * the shared `NavItem`. Not to be confused with Dropdown/ContextMenu's
 * `TMenuItem`/`MenuList` — a transient floating action menu, unrelated
 * despite the naming echo (see NavItem's own doc comment).
 */
export const NavList: React.FC<INavListProps> = ({
	items,
	isReduced = false,
	onNavigate,
	className = "",
}) => (
	<nav className={cn([styles.list, className])}>
		{items
			.filter((item) => !item.hidden)
			.map((item) => (
				<NavItem
					key={item.href}
					href={item.href}
					picto={item.picto}
					isActive={item.isActive}
					isReduced={isReduced}
					onClick={
						onNavigate ? (e) => onNavigate(item, e) : undefined
					}
				>
					{item.label}
				</NavItem>
			))}
	</nav>
);
