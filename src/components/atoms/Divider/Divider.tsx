import React from "react";

import { cn } from "@utils/cn";

import styles from "./Divider.module.scss";

export type TDividerOrientation = "horizontal" | "vertical";

export interface IDividerProps extends Omit<
	React.HTMLAttributes<HTMLDivElement>,
	"role"
> {
	orientation?: TDividerOrientation;
	/** Text shown in the middle of the line. Horizontal only — ignored when `orientation="vertical"`. */
	label?: string;
	className?: string;
}

/**
 * V2 Divider — plain visual separator. Deliberately no size/color props:
 * unlike Button/Badge/Tabs, a divider doesn't have distinct visual "states"
 * to mark — it's one line, themed via --amp-color-border like every other
 * hairline in the lib (Card's own border, Input's field-box, etc).
 */
export const Divider: React.FC<IDividerProps> = ({
	orientation = "horizontal",
	label,
	className = "",
	...props
}) => {
	if (label && orientation === "horizontal") {
		return (
			<div
				{...props}
				role="separator"
				aria-orientation="horizontal"
				className={cn([styles.divider, styles.withLabel, className])}
			>
				<span className={styles.line} />
				<span className={styles.label}>{label}</span>
				<span className={styles.line} />
			</div>
		);
	}

	return (
		<div
			{...props}
			role="separator"
			aria-orientation={orientation}
			className={cn([
				styles.divider,
				orientation === "vertical" && styles.vertical,
				className,
			])}
		/>
	);
};
