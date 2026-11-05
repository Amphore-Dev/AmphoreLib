import React, { forwardRef } from "react";

import { cn } from "@utils/cn";

import { TColor } from "@interfaces/index";

import styles from "./Title.module.scss";

export type TTitleLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface ITitleProps extends Omit<
	React.ComponentPropsWithoutRef<"h1">,
	"color"
> {
	/** Semantic heading tag rendered. Defaults to "h1". */
	as?: TTitleLevel;
	/** Visual size, independent of `as` — lets you keep correct heading order (no skipped levels) while styling a heading like a different one. Defaults to `as`. */
	size?: TTitleLevel;
	color?: TColor;
	className?: string;
}

const TitleBase: React.ForwardRefRenderFunction<
	HTMLHeadingElement,
	ITitleProps
> = ({ as = "h1", size, color, className = "", children, ...props }, ref) => {
	const Tag = as;

	return (
		<Tag
			{...props}
			ref={ref}
			className={cn([styles.title, className])}
			data-size={size ?? as}
			data-color={color}
		>
			{children}
		</Tag>
	);
};

/**
 * V2 Title — heading text. `as` picks the semantic tag, `size` (defaults to
 * `as`) picks the visual scale — decoupled so heading order stays correct
 * (h1 → h2 → h3, no skipping for style reasons) independent of look.
 *
 * Native props and `ref` go to the heading element.
 */
export const Title = forwardRef(TitleBase);
Title.displayName = "Title";
