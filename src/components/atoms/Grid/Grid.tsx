import React from "react";

import { cn } from "@utils/cn";

import styles from "./Grid.module.scss";

export interface IGridProps extends React.HTMLAttributes<HTMLDivElement> {
	/** Number of columns. Omit for a free-flowing layout (no fixed column count, items just auto-fill at `minItemWidth`). */
	columns?: number;
	minItemWidth?: string;
	/** A single value ("1rem") or "row column" ("1rem 2rem"). */
	gap?: string;
	className?: string;
}

/**
 * V2 Grid — classic CSS-grid layout (`display: grid`, `auto-fill`), no JS
 * wrapping of children at all — every direct child is a real grid item,
 * placed automatically. Unlike its sibling `FlexGrid` atom (whose
 * `Children.map` sees a `Fragment` grouping several children as *one*
 * React child, wrapping the whole thing in one FlexGridItem), this `Grid`
 * renders `children` as-is: a `Fragment` grouping fields stays fully
 * transparent, each one landing as its own grid item. Reach for it when a
 * caller needs to group children (e.g. one `Fragment` per data group)
 * without that grouping affecting layout at all — EditableCard's per-group
 * display instead gives each group its own `Grid` *instance* (own layout
 * context, own `order` scoping), stacked by a plain flex-column wrapper;
 * see its own comment for why a single shared instance doesn't work for
 * that particular case regardless of Grid vs FlexGrid.
 */
export const Grid: React.FC<IGridProps> = ({
	columns,
	minItemWidth = "200px",
	gap = "1rem",
	children,
	className = "",
	...props
}) => {
	const [rowGap, columnGap = rowGap] = gap.split(" ");

	return (
		<div
			{...props}
			className={cn([styles.grid, className])}
			style={
				{
					gap: `${rowGap} ${columnGap}`,
					"--_item-min-width": minItemWidth,
					"--_gap": columnGap,
					"--_column-count": columns,
					"--_gap-count": columns
						? `calc(${columns} - 1)`
						: undefined,
					"--_total-gap": columns
						? "calc(var(--_gap-count) * var(--_gap))"
						: undefined,
					"--_item-max-width": columns
						? "calc((100% - var(--_total-gap)) / var(--_column-count))"
						: undefined,
				} as React.CSSProperties
			}
		>
			{children}
		</div>
	);
};
