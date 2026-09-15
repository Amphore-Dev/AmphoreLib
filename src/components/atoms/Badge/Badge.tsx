import React from "react";

import { useAmphoreDefaults } from "@theme/useAmphoreDefaults";
import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import type { TPictoName } from "@constants/index";

import { getPicto } from "@utils/UPicto";
import { cn } from "@utils/cn";

import { TColor, TLabel, TSize } from "@interfaces/index";

import type { IPictoProps } from "../Picto/Picto";
import { Picto } from "../Picto/Picto";

import styles from "./Badge.module.scss";

export type TBadgeVariant = "solid" | "outline" | "tint";

export interface IBadgeProps extends Omit<
	React.HTMLAttributes<HTMLSpanElement>,
	"color"
> {
	children?: React.ReactNode;
	color?: TColor;
	variant?: TBadgeVariant;
	size?: TSize;
	/**
	 * Fully rounded (capsule) shape, ignoring the theme's radius preset.
	 * Off by default — a badge follows --amp-radius-md like Button/Card, so
	 * a "sharp"/"default" style preset actually looks squared instead of
	 * always being a pill regardless of theme.
	 */
	pill?: boolean;
	/** Leading icon name (see Picto), same convention as Input/Select. */
	picto?: TPictoName | IPictoProps;
	/**
	 * Shows a trailing remove (×) button when given — makes the badge usable
	 * as a removable chip/tag (e.g. Select's multi-value chips) without
	 * duplicating the color/variant/size styling logic there.
	 */
	onRemove?: () => void;
	/** aria-label for the remove button. Defaults to "Remove" (or `common.remove`/`Badge.removeLabel` from the nearest AmphoreProvider — see useAmphoreLabels). No effect without `onRemove`. */
	removeLabel?: TLabel;
	className?: string;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why a `Pick` here instead of auto-deriving from `TLabel`. */
export type TBadgeLabels = Pick<IBadgeProps, "removeLabel">;

/**
 * V2 Badge — status/label pill, optionally removable (chip/tag usage). Same
 * convention as Button (data-* attributes, `--_color*` local vars per
 * [data-color], config.defaults.size fallback).
 */
export const Badge: React.FC<IBadgeProps> = ({
	children,
	color = "primary",
	variant = "tint",
	size: sizeProp,
	pill = false,
	picto,
	onRemove,
	removeLabel: removeLabelProp,
	className = "",
	...props
}) => {
	const { size: defaultSize } = useAmphoreDefaults();
	const size = sizeProp ?? defaultSize ?? "md";
	const { resolve } = useAmphoreLabels("Badge");
	const removeLabel = resolve("removeLabel", removeLabelProp, "remove");

	return (
		<span
			{...props}
			className={cn([styles.badge, className])}
			data-color={color}
			data-variant={variant}
			data-size={size}
			data-pill={pill || undefined}
		>
			{!!picto && <Picto {...getPicto(picto)} className={styles.picto} />}
			{children}
			{onRemove && (
				<button
					type="button"
					className={styles.remove}
					onClick={(e) => {
						e.stopPropagation();
						onRemove();
					}}
					aria-label={removeLabel}
				>
					<Picto icon="cross" />
				</button>
			)}
		</span>
	);
};
