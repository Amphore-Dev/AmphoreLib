import React, { forwardRef } from "react";

import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { deriveTestId } from "@utils/UTestId";
import { cn } from "@utils/cn";

import type { ITestIdProps, TLabel } from "@interfaces/index";

import { Picto } from "../../atoms/Picto/Picto";

import styles from "./HeadBar.module.scss";

export interface IHeadBarProps
	extends
		Omit<React.ComponentPropsWithoutRef<"div">, "children">,
		ITestIdProps {
	/** Shows a menu button when given (e.g. to toggle a sidebar). */
	onMenuClick?: () => void;
	/** aria-label for the menu button. Defaults to "Menu" (or `HeadBar.menuLabel` from the nearest AmphoreProvider — see useAmphoreLabels). */
	menuLabel?: TLabel;
	leftContent?: React.ReactNode;
	rightContent?: React.ReactNode;
	className?: string;
	leftClassName?: string;
	rightClassName?: string;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type THeadBarLabels = Pick<IHeadBarProps, "menuLabel">;

const HeadBarBase: React.ForwardRefRenderFunction<
	HTMLDivElement,
	IHeadBarProps
> = (
	{
		onMenuClick,
		menuLabel: menuLabelProp,
		leftContent,
		rightContent,
		className = "",
		leftClassName = "",
		rightClassName = "",
		...props
	},
	ref
) => {
	const { resolve } = useAmphoreLabels("HeadBar");
	const menuLabel = resolve("menuLabel", menuLabelProp);

	return (
		<div {...props} ref={ref} className={cn([styles.bar, className])}>
			<div className={cn([styles.left, leftClassName])}>
				{onMenuClick && (
					<button
						type="button"
						className={styles.menu}
						onClick={onMenuClick}
						aria-label={menuLabel}
						data-testid={deriveTestId(props["data-testid"], "menu")}
					>
						<Picto icon="menu" />
					</button>
				)}
				{leftContent}
			</div>
			<div className={cn([styles.right, rightClassName])}>
				{rightContent}
			</div>
		</div>
	);
};

/**
 * V2 HeadBar — top app bar: optional menu button, left/right content slots.
 * v1's menu trigger was a plain `<div onClick>` with three hardcoded `<hr>`
 * lines — a real `<button>` + Picto here instead (keyboard/AT accessible).
 *
 * Native props and `ref` go to the root `<div>`. Derived testid: `-menu`.
 */
export const HeadBar = forwardRef(HeadBarBase);
HeadBar.displayName = "HeadBar";
