import React, { forwardRef, HTMLAttributes } from "react";

import { cn } from "@utils/cn";

import styles from "./Card.module.scss";

export type TCardElevation = 1 | 2 | 3 | 4 | 5;

export interface ICardProps extends HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode;
	/** Drop shadow depth (1 = subtle, 5 = furthest off the page), border removed. Omit for a plain bordered card. */
	elevation?: TCardElevation;
	/** Removes the default (density-driven) padding, for a card that manages its own inner layout. */
	noPadding?: boolean;
	className?: string;
}

/**
 * V2 Card — a themed container. Padding comes from `--amp-card-padding`
 * (config.density: comfortable/compact), not a `size` prop — a card isn't a
 * single interactive control the way Button/Input are, its "density" is
 * about page-level spacing, which is exactly what `density` (not `size`)
 * models. See memory/density-vs-size-design.md.
 *
 * forwardRef so it can double as the DOM node a floating/positioned
 * component (e.g. Modal's panel) attaches its own ref to, instead of that
 * consumer having to wrap a second plain div around it just for the ref.
 */
export const Card = forwardRef<HTMLDivElement, ICardProps>(
	(
		{ children, elevation, noPadding = false, className = "", ...props },
		ref
	) => {
		return (
			<div
				{...props}
				ref={ref}
				className={cn([styles.card, className])}
				data-elevation={elevation}
				data-no-padding={noPadding || undefined}
			>
				{children}
			</div>
		);
	}
);
Card.displayName = "Card";
