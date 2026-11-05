import React, { forwardRef, HTMLAttributes } from "react";

import { useAmphoreDefaults } from "@theme/useAmphoreDefaults";

import { cn } from "@utils/cn";

import { TColor, TSize } from "@interfaces/index";

import styles from "./Text.module.scss";

export type TTextElement =
	| "p"
	| "span"
	| "div"
	| "label"
	| "strong"
	| "em"
	| "small";

export type TTextWeight = "regular" | "semibold" | "bold";

/** The theme's text colours, `ink` (body copy) and `sub` (secondary text), plus the semantic palette. */
export type TTextColor = "ink" | "sub" | TColor;

export interface ITextProps extends Omit<HTMLAttributes<HTMLElement>, "color"> {
	/** Element rendered. Defaults to "p". */
	as?: TTextElement;
	/** Same text scale as a field or a button of that size. Falls back to `AmphoreProvider`'s `config.defaults.size`, then "md". */
	size?: TSize;
	/** Defaults to the parent's weight. */
	weight?: TTextWeight;
	/** Defaults to the parent's color. */
	color?: TTextColor;
	/** Ties the text to its field, with `as="label"`. */
	htmlFor?: string;
}

/**
 * V2 Text — body copy, inline text or a label, on the same scale as the
 * rest of the lib. forwardRef, so it can be a Tooltip/Popover trigger.
 */
export const Text = forwardRef<HTMLElement, ITextProps>(
	(
		{
			as = "p",
			size: sizeProp,
			weight,
			color,
			className = "",
			children,
			...props
		},
		ref
	) => {
		const { size: defaultSize } = useAmphoreDefaults();
		const size = sizeProp ?? defaultSize ?? "md";
		// One signature for every `as`: only the attributes differ, and
		// `HTMLAttributes` (+ `htmlFor`) covers what this props type allows.
		const Tag = as as "label";

		return (
			<Tag
				{...props}
				ref={ref as React.Ref<HTMLLabelElement>}
				className={cn([styles.text, className])}
				data-size={size}
				data-weight={weight}
				data-color={color}
			>
				{children}
			</Tag>
		);
	}
);

Text.displayName = "Text";
