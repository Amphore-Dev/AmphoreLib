import React, { Children, HTMLAttributes, isValidElement } from "react";

import { cn } from "@utils/cn";

import { FlexGridItem } from "./FlexGridItem";

import styles from "./FlexGrid.module.scss";

export interface IFlexGridProps extends HTMLAttributes<HTMLDivElement> {
	/** Number of columns. Omit for a free-flowing layout (no fixed column count, items just wrap at `minItemWidth`) — `span` has no effect without a column count to size against. */
	columns?: number;
	minItemWidth?: string;
	/** A single value ("1rem") or "row column" ("1rem 2rem"). */
	gap?: string;
	className?: string;
}

/**
 * V2 FlexGrid — responsive flexbox-based layout (port of the reference's
 * own `FlexGrid`, ex-`Grid` in V2 — see the sibling `Grid` atom for its
 * classic CSS-grid counterpart, ex-`Grid` in the reference). Every child is
 * auto-wrapped in a `FlexGridItem` (span 1) unless it already is one, or
 * carries its own `data-span` (works on any element, no wrapper needed).
 * Because it wraps every child in its own real element, a child that is
 * itself a multi-field wrapper (e.g. a `<div>` grouping several fields)
 * collapses into *one* opaque flex item — reach for `Grid` instead when
 * children need to flow individually regardless of intermediate wrapper
 * elements (see EditableCard's per-group display).
 */
export const FlexGrid: React.FC<IFlexGridProps> = ({
	columns,
	minItemWidth = "200px",
	gap = "1rem",
	children,
	className = "",
	...props
}) => {
	const [rowGap, columnGap = rowGap] = gap.split(" ");

	const items = Children.map(children, (child) => {
		if (isValidElement(child) && child.type === FlexGridItem) {
			return child;
		}
		const span = isValidElement(child)
			? Number((child.props as { "data-span"?: number })["data-span"]) ||
				undefined
			: undefined;
		return <FlexGridItem span={span}>{child}</FlexGridItem>;
	});

	return (
		<div
			{...props}
			className={cn([styles.flexGrid, className])}
			style={
				{
					gap: `${rowGap} ${columnGap}`,
					"--_column-count": columns,
					"--_gap": columnGap,
					"--_item-min-width": minItemWidth,
					"--_gap-count": columns
						? `calc(${columns} - 1)`
						: undefined,
					"--_total-gap": columns
						? "calc(var(--_gap-count) * var(--_gap))"
						: undefined,
					"--_item-width": columns
						? "calc((100% - var(--_total-gap)) / var(--_column-count))"
						: undefined,
				} as React.CSSProperties
			}
		>
			{items}
		</div>
	);
};
