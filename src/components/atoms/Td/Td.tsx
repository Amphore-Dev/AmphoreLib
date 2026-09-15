import React from "react";

import { cn } from "@utils/cn";

import styles from "./Td.module.scss";

export interface ITdProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Pins the cell to an edge while the row scrolls horizontally. */
	sticky?: "left" | "right";
	className?: string;
}

/**
 * V2 Td — a grid cell, not a real `<td>`: `Table` lays rows out via CSS
 * Grid (`display: contents` on each row, one grid column per Td) rather
 * than an HTML `<table>`, so it can virtualize rows and size columns with
 * `minmax()`/`max-content` — a real `<table>` can't do either. `role`
 * supplies the equivalent semantics instead.
 */
export const Td: React.FC<ITdProps> = ({
	children,
	className = "",
	sticky,
	...props
}) => (
	<div
		{...props}
		role="gridcell"
		data-sticky={sticky}
		className={cn([styles.td, className])}
	>
		{children}
	</div>
);
