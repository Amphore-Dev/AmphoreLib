import React, { HTMLAttributes } from "react";

import { cn } from "@utils/cn";

import styles from "./FlexGrid.module.scss";

export interface IFlexGridItemProps extends HTMLAttributes<HTMLDivElement> {
	/** Number of columns this item spans. Only meaningful inside a `FlexGrid` with a fixed `columns` count. Defaults to 1. */
	span?: number;
	className?: string;
}

export const FlexGridItem: React.FC<IFlexGridItemProps> = ({
	span = 1,
	children,
	className = "",
	style,
	...props
}) => (
	<div
		{...props}
		className={cn([styles.item, className])}
		style={
			span > 1
				? {
						...style,
						flex: `1 1 calc(${span} * var(--_col-size) + ${span - 1} * var(--_gap))`,
					}
				: style
		}
	>
		{children}
	</div>
);
