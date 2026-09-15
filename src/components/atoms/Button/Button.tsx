import React, { ButtonHTMLAttributes, forwardRef } from "react";

import { useAmphoreDefaults } from "@theme/useAmphoreDefaults";

import { TPictoName } from "@constants/index";

import { getPicto } from "@utils/UPicto";
import { cn } from "@utils/cn";

import { TColor, TSize } from "@interfaces/index";

import { IPictoProps, Picto } from "../Picto/Picto";

import styles from "./Button.module.scss";

/** Button-specific shape. Not shared: other components (Badge, Tag...) may not offer all four. */
export type TButtonVariant = "solid" | "outline" | "ghost" | "link";

// Scales with `size` — stays comfortably under each size's own line-height
// (see Button.module.scss) so the picto/spinner never change the button's
// row height, at any size.
const ICON_SIZE: Record<TSize, string> = {
	sm: "1rem",
	md: "1.25rem",
	lg: "1.5rem",
};

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children?: React.ReactNode;
	/** Semantic hue (shared TColor). Independent from `variant` — every color works with every variant. */
	color?: TColor;
	/** Visual shape: filled, outlined, ghost, or link (no padding/background, underlines on hover — for an action inline with text or a value, like `SummaryListItem`'s "Add"). Combines with `color`. */
	variant?: TButtonVariant;
	/** Falls back to `AmphoreProvider`'s `config.defaults.size`, then "md". */
	size?: TSize;
	isLoading?: boolean;
	label?: string;
	/** Leading icon name (see Picto), same convention as Input/Select. Hidden while `isLoading` — the spinner takes its place. */
	picto?: TPictoName | IPictoProps;
}

/**
 * V2 Button — themed via --amp-* vars. `color`/`variant` are orthogonal
 * (data-attributes), any color works with any variant. forwardRef — needed
 * as a Tooltip/Popover/Dropdown trigger (see memory/amphorelib-v2-conventions.md).
 */
export const Button = forwardRef<HTMLButtonElement, IButtonProps>(
	(
		{
			children,
			color = "primary",
			variant = "solid",
			size: sizeProp,
			isLoading = false,
			type = "button",
			className = "",
			label,
			picto,
			disabled = false,
			...props
		},
		ref
	) => {
		const { size: defaultSize } = useAmphoreDefaults();
		const size = sizeProp ?? defaultSize ?? "md";
		const iconSize = ICON_SIZE[size];

		return (
			<button
				ref={ref}
				className={cn([styles.button, className])}
				data-color={color}
				data-variant={variant}
				data-size={size}
				data-loading={isLoading || undefined}
				type={type}
				disabled={disabled || isLoading}
				{...props}
			>
				{isLoading && (
					<span
						className={styles.spinner}
						aria-hidden
						style={{ width: iconSize, height: iconSize }}
					/>
				)}
				{!isLoading && !!picto && (
					<Picto
						{...getPicto(picto)}
						className={styles.picto}
						wrapperClassName={styles.pictoWrapper}
						// The underlying SVGs ship with hardcoded width/height=24
						// attributes — a class alone doesn't reliably override an
						// SVG root's own presentation attributes across browsers.
						// Inline style always wins, over both.
						style={{ width: iconSize, height: iconSize }}
					/>
				)}
				{label ?? children}
			</button>
		);
	}
);
Button.displayName = "Button";
