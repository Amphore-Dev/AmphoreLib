import React, { forwardRef, HTMLAttributes } from "react";

import { cn } from "@utils/cn";

import styles from "./Card.module.scss";

export type TCardElevation = 1 | 2 | 3 | 4 | 5;

/** Undefined leaves the CSS var unset so the stylesheet default applies. */
const px = (value?: number) => (value != null ? `${value}px` : undefined);

export interface ICardShadow {
	/** Horizontal offset in px. Default 0. */
	x?: number;
	/** Vertical offset in px. Default 1. */
	y?: number;
	/** Blur radius in px. Default 2× `y`. */
	blur?: number;
}

export interface ICardProps extends HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode;
	/** Drop shadow depth (1 = subtle, 5 = furthest off the page), border removed. Omit for a plain bordered card. */
	elevation?: TCardElevation;
	/** Keeps the 1px border even with elevation (elevation drops it by default). No effect without elevation. */
	bordered?: boolean;
	/** Base shadow geometry in px, scaled by `elevation`. Default `{ x: 0, y: 1, blur: 2 }`. Only meaningful with `elevation`. */
	shadow?: ICardShadow;
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
		{
			children,
			elevation,
			bordered = false,
			shadow,
			noPadding = false,
			className = "",
			style,
			...props
		},
		ref
	) => {
		return (
			<div
				{...props}
				ref={ref}
				className={cn([styles.card, className])}
				style={
					{
						...style,
						"--_shadow-x": px(shadow?.x),
						"--_shadow-y": px(shadow?.y),
						"--_shadow-blur": px(shadow?.blur),
					} as React.CSSProperties
				}
				data-elevation={elevation}
				data-bordered={bordered || undefined}
				data-no-padding={noPadding || undefined}
			>
				{children}
			</div>
		);
	}
);
Card.displayName = "Card";
