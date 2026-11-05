import React, { forwardRef } from "react";

import type { TPictoName } from "@constants/index";

import { deriveTestId } from "@utils/UTestId";
import { cn } from "@utils/cn";

import type { ITestIdProps } from "@interfaces/index";

import { NavItem } from "../../atoms/NavItem/NavItem";
import type { IPictoProps } from "../../atoms/Picto/Picto";

import styles from "./NavList.module.scss";

export interface TNavItem {
	/** Names the item in its derived testid (`<testid>-item-<id>`). Falls back to its position. */
	id?: string;
	href: string;
	label: React.ReactNode;
	picto?: TPictoName | IPictoProps;
	/** Router-agnostic: the caller decides (see NavItem) and passes the result in. */
	isActive?: boolean;
	/** Drops this entry entirely, without needing to filter `items` yourself before passing them — role-based access control (or any other business rule) stays the caller's job. */
	hidden?: boolean;
}

export interface INavListProps
	extends
		Omit<React.ComponentPropsWithoutRef<"nav">, "children">,
		ITestIdProps {
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
 *
 * Native props and `ref` go to the `<nav>`. Derived testids: `-item-<id>`, or
 * `-item-<position>` for an item without one.
 */
const NavListBase: React.ForwardRefRenderFunction<
	HTMLElement,
	INavListProps
> = (
	{ items, isReduced = false, onNavigate, className = "", ...props },
	ref
) => (
	<nav {...props} ref={ref} className={cn([styles.list, className])}>
		{items
			.filter((item) => !item.hidden)
			.map((item, index) => (
				<NavItem
					key={item.href}
					href={item.href}
					picto={item.picto}
					isActive={item.isActive}
					isReduced={isReduced}
					data-testid={deriveTestId(
						props["data-testid"],
						"item",
						item.id ?? index
					)}
					onClick={
						onNavigate ? (e) => onNavigate(item, e) : undefined
					}
				>
					{item.label}
				</NavItem>
			))}
	</nav>
);

export const NavList = forwardRef(NavListBase);
NavList.displayName = "NavList";
