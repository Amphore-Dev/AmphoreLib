import React from "react";

import { cn } from "@utils/cn";

import type { TSummaryListItem } from "@interfaces/index";

import { FlexGrid, IFlexGridProps } from "../../atoms/FlexGrid/FlexGrid";
import { SummaryListItem } from "../SummaryListItem/SummaryListItem";

import styles from "./SummaryList.module.scss";

export type TSummaryListLayout = "vertical" | "horizontal" | "grid";

export interface ISummaryListProps {
	items: TSummaryListItem[];
	/** Label above value ("vertical", v1's layout), side by side ("horizontal"), or wrapped into a `FlexGrid` ("grid"). Defaults to "vertical". */
	layout?: TSummaryListLayout;
	/** Passed straight to `FlexGrid` for `layout="grid"` (columns, minItemWidth, gap). `columns` defaults to 4. */
	gridConfig?: Omit<IFlexGridProps, "children" | "className">;
	/** Separator line between rows. Off by default. Ignored for `layout="grid"` (no natural row order to separate). */
	divider?: boolean;
	className?: string;
}

/**
 * V2 SummaryList — data-driven (`items`) term/value pairs, rendered via
 * the shared `SummaryListItem`. `layout="grid"` wraps items in `FlexGrid`,
 * which puts a wrapper between a list and its rows: each item is then its
 * own one-row `<dl>`. "vertical"/"horizontal" share a single `<dl>`.
 */
export const SummaryList: React.FC<ISummaryListProps> = ({
	items,
	layout = "vertical",
	gridConfig,
	divider = false,
	className = "",
}) => {
	if (layout === "grid") {
		return (
			<FlexGrid columns={4} {...gridConfig} className={className}>
				{items.map((item) => (
					<SummaryListItem
						key={item.label}
						{...item}
						direction="vertical"
					/>
				))}
			</FlexGrid>
		);
	}

	return (
		<dl className={cn([styles.list, className])} data-divider={divider}>
			{items.map((item) => (
				<SummaryListItem
					key={item.label}
					{...item}
					direction={layout}
					inList
					className={styles.row}
				/>
			))}
		</dl>
	);
};
