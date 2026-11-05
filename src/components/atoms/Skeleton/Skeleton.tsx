import React, { forwardRef } from "react";

import { cn } from "@utils/cn";

import styles from "./Skeleton.module.scss";

export type TSkeletonVariant = "text" | "circle" | "rect";

export interface ISkeletonProps extends Omit<
	React.ComponentPropsWithoutRef<"div">,
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
 *
 * Native props and `ref` go to the root `<div>`.
 */
const SkeletonBase: React.ForwardRefRenderFunction<
	HTMLDivElement,
	ISkeletonProps
> = (
	{ variant = "text", width, height, className = "", style, ...props },
	ref
) => (
	<div
		{...props}
		ref={ref}
		aria-hidden="true"
		className={cn([styles.skeleton, className])}
		data-variant={variant}
		style={{ width, height, ...style }}
	/>
);

export const Skeleton = forwardRef(SkeletonBase);
Skeleton.displayName = "Skeleton";
