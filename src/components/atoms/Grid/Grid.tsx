import React, { PropsWithChildren } from "react";

import { cn } from "@utils/cn";

import "./Grid.scss";

export interface IGridProps extends PropsWithChildren {
	columns: number;
	minItemWidth?: string;
	gap?: string; // Can be a single value (e.g., "1rem") or two values (e.g., "1rem 2rem")
	className?: string;
}

export const Grid = ({
	columns,
	minItemWidth = "200px",
	gap = "1rem",
	children,
	className,
}: IGridProps) => {
	const gapSplit = gap.split(" ");
	const columnGap = gapSplit[1] || gapSplit[0];
	const rowGap = gapSplit[0];

	return (
		<div
			className={cn(["al__grid", className])}
			style={
				{
					gap: `${rowGap} ${columnGap}`,
					"--grid-column-count": columns,
					"--grid-layout-gap": columnGap,
					"--grid-item-min-width": `${minItemWidth}`,
					"--gap-count": `calc(${columns} - 1)`,
					"--total-gap-width": `calc(var(--gap-count) * var(--grid-layout-gap))`,
					"--grid-item-max-width": `calc((100% - var(--total-gap-width)) / var(--grid-column-count))`,
					gridTemplateColumns:
						"repeat(auto-fill, minmax(max(var(--grid-item-min-width), var(--grid-item-max-width)), 1fr))",
				} as React.CSSProperties
			}
		>
			{children}
		</div>
	);
};
