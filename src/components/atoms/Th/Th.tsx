import React from "react";

import { TSortDirection } from "@interfaces/TTable";

import { Picto } from "@components/atoms";

import { cn } from "@utils/cn";

import "./Th.scss";

export interface IThProps {
	children?: React.ReactNode;
	className?: string;
	sortable?: boolean;
	sortDirection?: TSortDirection;
	onSort?: () => void;
	sticky?: "left" | "right";
}

export const Th: React.FC<IThProps> = ({
	children,
	className,
	sortable,
	sortDirection,
	onSort,
	sticky,
}) => (
	<div
		role="columnheader"
		aria-sort={
			sortDirection
				? sortDirection === "asc"
					? "ascending"
					: "descending"
				: undefined
		}
		onClick={sortable ? onSort : undefined}
		className={cn([
			"al__th",
			sortable && "al__th--sortable",
			sortDirection && "al__th--sorted",
			sticky === "left" && "al__th--sticky-left",
			sticky === "right" && "al__th--sticky-right",
			className,
		])}
	>
		{children}
		{sortable && (
			<span className="al__th__sort-icon">
				{sortDirection ? (
					<Picto icon={sortDirection === "desc" ? "sortDesc" : "sortAsc"} />
				) : (
					"-"
				)}
			</span>
		)}
	</div>
);
