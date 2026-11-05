import React, { forwardRef } from "react";

import { useAmphoreDefaults } from "@theme/useAmphoreDefaults";
import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { cn } from "@utils/cn";

import { TColor, TElementProps, TLabel, TSize } from "@interfaces/index";

import styles from "./Progress.module.scss";

export interface IProgressProps extends Omit<
	React.ComponentPropsWithoutRef<"div">,
	"color" | "children"
> {
	/** 0-100. Ignored (and not required) when `indeterminate`. */
	value?: number;
	/** Animated, unknown-duration state — no `value` to show. */
	indeterminate?: boolean;
	color?: TColor;
	size?: TSize;
	/** Accessible label (aria-label) — there's no visible text otherwise. Defaults to "Progress" (or `Progress.label` from the nearest AmphoreProvider — see useAmphoreLabels): say what's progressing when you can. */
	label?: TLabel;
	/** Renders a "NN%" label next to the bar. No effect when `indeterminate`. */
	showValue?: boolean;
	/** The outer container (bar and value), like `wrapperProps`. */
	className?: string;
	/** Native props of the outer container (bar and value). */
	wrapperProps?: TElementProps<"div">;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TProgressLabels = Pick<IProgressProps, "label">;

const ProgressBase: React.ForwardRefRenderFunction<
	HTMLDivElement,
	IProgressProps
> = (
	{
		value = 0,
		indeterminate = false,
		color = "primary",
		size: sizeProp,
		label: labelProp,
		showValue = false,
		className = "",
		wrapperProps,
		...props
	},
	ref
) => {
	const { size: defaultSize } = useAmphoreDefaults();
	const size = sizeProp ?? defaultSize ?? "md";
	const clamped = Math.min(100, Math.max(0, value));
	const { resolve } = useAmphoreLabels("Progress");
	const label = resolve("label", labelProp);

	return (
		<div
			{...wrapperProps}
			className={cn([styles.wrapper, className, wrapperProps?.className])}
		>
			<div
				aria-label={label}
				{...props}
				ref={ref}
				role="progressbar"
				aria-valuenow={indeterminate ? undefined : clamped}
				aria-valuemin={0}
				aria-valuemax={100}
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

/**
 * V2 Progress — linear progress bar. Not a user input (no onChange): it's a
 * status display, so unlike the form fields `value` is just a plain prop,
 * not part of the "fully controlled" value/onChange contract those follow.
 *
 * Native props and `ref` go to the `role="progressbar"` element, the one
 * `aria-*` attributes apply to; `className` and `wrapperProps` to the outer
 * container.
 */
export const Progress = forwardRef(ProgressBase);
Progress.displayName = "Progress";
