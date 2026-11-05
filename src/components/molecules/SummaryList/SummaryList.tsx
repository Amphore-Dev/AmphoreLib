import React, { forwardRef } from "react";

import { deriveTestId } from "@utils/UTestId";
import { cn } from "@utils/cn";

import type { ITestIdProps, TSummaryListItem } from "@interfaces/index";

import { FlexGrid, IFlexGridProps } from "../../atoms/FlexGrid/FlexGrid";
import { SummaryListItem } from "../SummaryListItem/SummaryListItem";

import styles from "./SummaryList.module.scss";

export type TSummaryListLayout = "vertical" | "horizontal" | "grid";

export interface ISummaryListProps
	extends Omit<React.HTMLAttributes<HTMLElement>, "children">, ITestIdProps {
	items: TSummaryListItem[];
	/** Label above value ("vertical", v1's layout), side by side ("horizontal"), or wrapped into a `FlexGrid` ("grid"). Defaults to "vertical". */
	layout?: TSummaryListLayout;
	/** Passed straight to `FlexGrid` for `layout="grid"` (columns, minItemWidth, gap). `columns` defaults to 4. */
	gridConfig?: Omit<IFlexGridProps, "children" | "className">;
	/** Separator line between rows. Off by default. Ignored for `layout="grid"` (no natural row order to separate). */
	divider?: boolean;
	className?: string;
}

const SummaryListBase: React.ForwardRefRenderFunction<
	HTMLElement,
	ISummaryListProps
> = (
	{
		items,
		layout = "vertical",
		gridConfig,
		divider = false,
		className = "",
		...props
	},
	ref
) => {
	if (layout === "grid") {
		return (
			<FlexGrid
				columns={4}
				{...(props as React.HTMLAttributes<HTMLDivElement>)}
				{...gridConfig}
				ref={ref as React.Ref<HTMLDivElement>}
				className={className}
			>
				{items.map((item, index) => (
					<SummaryListItem
						key={item.label}
						{...item}
						direction="vertical"
						data-testid={deriveTestId(
							props["data-testid"],
							"item",
							index
						)}
					/>
				))}
			</FlexGrid>
		);
	}

	return (
		<dl
			{...(props as React.HTMLAttributes<HTMLDListElement>)}
			ref={ref as React.Ref<HTMLDListElement>}
			className={cn([styles.list, className])}
			data-divider={divider}
		>
			{items.map((item, index) => (
				<SummaryListItem
					key={item.label}
					{...item}
					direction={layout}
					data-testid={deriveTestId(
						props["data-testid"],
						"item",
						index
					)}
					inList
					className={styles.row}
				/>
			))}
		</dl>
	);
};

/**
 * V2 SummaryList — data-driven (`items`) term/value pairs, rendered via
 * the shared `SummaryListItem`. `layout="grid"` wraps items in `FlexGrid`,
 * which puts a wrapper between a list and its rows: each item is then its
 * own one-row `<dl>`. "vertical"/"horizontal" share a single `<dl>`.
 *
 * Native props and `ref` go to the root: the `<dl>`, or the grid. Derived
 * testids: `-item-<position>`, each item then deriving its own.
 */
export const SummaryList = forwardRef(SummaryListBase);
SummaryList.displayName = "SummaryList";
