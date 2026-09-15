import React, { HTMLAttributes } from "react";

import { cn } from "@utils/cn";

import { TSortDirection } from "@interfaces/index";

import { Picto } from "../Picto/Picto";

import styles from "./Th.module.scss";

export interface IThProps extends HTMLAttributes<HTMLDivElement> {
	sortable?: boolean;
	sortDirection?: TSortDirection;
	onSort?: () => void;
	sticky?: "left" | "right";
	className?: string;
}

/** V2 Th — a grid column header, same "not a real `<th>`" reasoning as Td. */
export const Th: React.FC<IThProps> = ({
	children,
	className = "",
	sortable = false,
	sortDirection,
	onSort,
	sticky,
	...props
}) => (
	<div
		{...props}
		role="columnheader"
		aria-sort={
			sortDirection
				? sortDirection === "asc"
					? "ascending"
					: "descending"
				: undefined
		}
		onClick={sortable ? onSort : undefined}
		onKeyDown={
			sortable
				? (e) => {
						if (e.key !== "Enter" && e.key !== " ") return;
						e.preventDefault();
						onSort?.();
					}
				: undefined
		}
		tabIndex={sortable ? 0 : undefined}
		data-sortable={sortable || undefined}
		data-sticky={sticky}
		className={cn([styles.th, className])}
	>
		{children}
		{sortable && (
			<span className={styles.sortIcon}>
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
