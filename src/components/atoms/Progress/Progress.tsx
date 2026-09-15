import React from "react";

import { useAmphoreDefaults } from "@theme/useAmphoreDefaults";

import { cn } from "@utils/cn";

import { TColor, TSize } from "@interfaces/index";

import styles from "./Progress.module.scss";

export interface IProgressProps {
	/** 0-100. Ignored (and not required) when `indeterminate`. */
	value?: number;
	/** Animated, unknown-duration state — no `value` to show. */
	indeterminate?: boolean;
	color?: TColor;
	size?: TSize;
	/** Accessible label (aria-label) — there's no visible text otherwise. */
	label?: string;
	/** Renders a "NN%" label next to the bar. No effect when `indeterminate`. */
	showValue?: boolean;
	className?: string;
}

/**
 * V2 Progress — linear progress bar. Not a user input (no onChange): it's a
 * status display, so unlike the form fields `value` is just a plain prop,
 * not part of the "fully controlled" value/onChange contract those follow.
 */
export const Progress: React.FC<IProgressProps> = ({
	value = 0,
	indeterminate = false,
	color = "primary",
	size: sizeProp,
	label,
	showValue = false,
	className = "",
}) => {
	const { size: defaultSize } = useAmphoreDefaults();
	const size = sizeProp ?? defaultSize ?? "md";
	const clamped = Math.min(100, Math.max(0, value));

	return (
		<div className={cn([styles.wrapper, className])}>
			<div
				role="progressbar"
				aria-valuenow={indeterminate ? undefined : clamped}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-label={label}
				className={styles.track}
				data-size={size}
				data-color={color}
				data-indeterminate={indeterminate || undefined}
			>
				<div
					className={styles.bar}
					style={indeterminate ? undefined : { width: `${clamped}%` }}
				/>
			</div>

			{showValue && !indeterminate && (
				<span className={styles.value}>{Math.round(clamped)}%</span>
			)}
		</div>
	);
};
