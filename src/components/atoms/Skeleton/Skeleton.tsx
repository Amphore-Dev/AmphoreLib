import React from "react";

import { cn } from "@utils/cn";

import styles from "./Skeleton.module.scss";

export type TSkeletonVariant = "text" | "circle" | "rect";

export interface ISkeletonProps extends Omit<
	React.HTMLAttributes<HTMLDivElement>,
	"children"
> {
	variant?: TSkeletonVariant;
	width?: string | number;
	height?: string | number;
	className?: string;
}

/**
 * V2 Skeleton — animated loading placeholder. No color/size props: always
 * the same neutral shimmer, dimensions via `width`/`height` instead of a
 * fixed scale. `aria-hidden="true"` on every instance — announce the
 * loading state via a wrapping `role="status"`, not each shape.
 */
export const Skeleton: React.FC<ISkeletonProps> = ({
	variant = "text",
	width,
	height,
	className = "",
	style,
	...props
}) => (
	<div
		{...props}
		aria-hidden="true"
		className={cn([styles.skeleton, className])}
		data-variant={variant}
		style={{ width, height, ...style }}
	/>
);
