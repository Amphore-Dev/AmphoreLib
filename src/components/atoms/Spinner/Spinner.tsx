import React, { forwardRef } from "react";

import { useAmphoreDefaults } from "@theme/useAmphoreDefaults";
import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { cn } from "@utils/cn";

import { TColor, TLabel, TSize } from "@interfaces/index";

import styles from "./Spinner.module.scss";

export interface ISpinnerProps extends Omit<
	React.ComponentPropsWithoutRef<"span">,
	"color"
> {
	color?: TColor;
	size?: TSize;
	/** Accessible label announced to screen readers (role="status"). Defaults to "Loading" (or `common.loading`/`Spinner.label` from the nearest AmphoreProvider — see useAmphoreLabels). */
	label?: TLabel;
	className?: string;
	inline?: boolean;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TSpinnerLabels = Pick<ISpinnerProps, "label">;

const SpinnerBase: React.ForwardRefRenderFunction<
	HTMLSpanElement,
	ISpinnerProps
> = (
	{
		color = "primary",
		size: sizeProp,
		label: labelProp,
		className = "",
		inline = false,
		...props
	},
	ref
) => {
	const { size: defaultSize } = useAmphoreDefaults();
	const size = sizeProp ?? defaultSize ?? "md";
	const { resolve } = useAmphoreLabels("Spinner");
	const label = resolve("label", labelProp, "loading");

	return (
		<span
			{...props}
			ref={ref}
			role="status"
			className={cn([styles.spinner, className, inline && styles.inline])}
			data-color={color}
			data-size={size}
		>
			<span className={styles.srOnly}>{label}</span>
		</span>
	);
};

/**
 * V2 Spinner — pure indeterminate loading indicator, same visual as
 * Button's internal `loading` state but standalone (e.g. inside a Card,
 * over a section). role="status" + visually-hidden label, no aria-busy on
 * itself — that belongs on whatever container it's loading into.
 *
 * Native props and `ref` go to the root `<span>`.
 */
export const Spinner = forwardRef(SpinnerBase);
Spinner.displayName = "Spinner";
