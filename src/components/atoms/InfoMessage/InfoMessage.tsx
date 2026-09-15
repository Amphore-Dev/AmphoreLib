import React, { HTMLAttributes } from "react";

import { useAmphoreDefaults } from "@theme/useAmphoreDefaults";

import type { TPictoName } from "@constants/index";

import { getPicto } from "@utils/UPicto";
import { cn } from "@utils/cn";

import { TColor, TSize } from "@interfaces/index";

import type { IPictoProps } from "../Picto/Picto";
import { Picto } from "../Picto/Picto";

import styles from "./InfoMessage.module.scss";

export type TInfoMessageVariant = "tint" | "outline" | "solid";

const DEFAULT_ICON: Partial<Record<TColor, TPictoName>> = {
	danger: "alert",
	warning: "alertTriangle",
	success: "checkCircle",
	info: "info",
};

export interface IInfoMessageProps extends HTMLAttributes<HTMLDivElement> {
	color?: TColor;
	variant?: TInfoMessageVariant;
	size?: TSize;
	/** Overrides the icon picked from `color` (see DEFAULT_ICON) — an icon name, or an `IPictoProps` object to pass other Picto props. */
	picto?: TPictoName | IPictoProps;
	hideIcon?: boolean;
	className?: string;
}

/** V2 InfoMessage — inline banner/alert. Same `--_color*` per-`[data-color]` pattern as Badge/Button. */
export const InfoMessage: React.FC<IInfoMessageProps> = ({
	color = "info",
	variant = "tint",
	size: sizeProp,
	picto,
	hideIcon = false,
	children,
	className = "",
	...props
}) => {
	const { size: defaultSize } = useAmphoreDefaults();
	const size = sizeProp ?? defaultSize ?? "md";
	const resolvedPicto = getPicto(picto ?? DEFAULT_ICON[color] ?? "info");
	// Assertive for danger/warning (interrupts, like a real alert) —
	// polite for everything else (announced without interrupting).
	const role = color === "danger" || color === "warning" ? "alert" : "status";

	return (
		<div
			{...props}
			role={role}
			data-color={color}
			data-variant={variant}
			data-size={size}
			className={cn([styles.message, className])}
		>
			{!hideIcon && <Picto {...resolvedPicto} className={styles.picto} />}
			<span className={styles.content}>{children}</span>
		</div>
	);
};
