import React, { ComponentPropsWithoutRef, forwardRef } from "react";

import { composeHandlers } from "@utils/UHandlers";
import { cn } from "@utils/cn";

import { TSortDirection } from "@interfaces/index";

import { Picto } from "../Picto/Picto";

import styles from "./Th.module.scss";

export interface IThProps extends ComponentPropsWithoutRef<"div"> {
	sortable?: boolean;
	sortDirection?: TSortDirection;
	onSort?: () => void;
	sticky?: "left" | "right";
	className?: string;
}

const ThBase: React.ForwardRefRenderFunction<HTMLDivElement, IThProps> = (
	{
		children,
		className = "",
		sortable = false,
		sortDirection,
		onSort,
		sticky,
		onClick,
		onKeyDown,
		...props
	},
	ref
) => (
	<div
		{...props}
		ref={ref}
		role="columnheader"
		aria-sort={
			sortDirection
				? sortDirection === "asc"
					? "ascending"
					: "descending"
				: sortable
					? "none"
					: undefined
		}
		onClick={
			sortable ? composeHandlers(onClick, () => onSort?.()) : onClick
		}
		onKeyDown={
			sortable
				? composeHandlers(onKeyDown, (e) => {
						if (e.key !== "Enter" && e.key !== " ") return;
						e.preventDefault();
						onSort?.();
					})
				: onKeyDown
		}
		tabIndex={sortable ? 0 : props.tabIndex}
		data-sortable={sortable || undefined}
		data-sticky={sticky}
		className={cn([styles.th, className])}
	>
		{children}
		{sortable && (
			<span className={styles.sortIcon} aria-hidden>
				{sortDirection ? (
					<Picto
						icon={sortDirection === "desc" ? "sortDesc" : "sortAsc"}
					/>
				) : (
					"-"
				)}
			</span>
		)}
	</div>
);

/**
 * V2 Th — a grid column header, same "not a real `<th>`" reasoning as Td.
 * Native props and `ref` go to the root `<div>`; `onClick`/`onKeyDown` run
 * alongside the sort handling.
 */
export const Th = forwardRef(ThBase);
Th.displayName = "Th";
