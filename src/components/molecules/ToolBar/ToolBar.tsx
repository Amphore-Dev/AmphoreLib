import React, { forwardRef } from "react";

import { TPictoName } from "@constants/index";

import { getPicto } from "@utils/UPicto";
import { deriveTestId } from "@utils/UTestId";
import { cn } from "@utils/cn";

import type { ITestIdProps } from "@interfaces/index";

import type { IPictoProps } from "../../atoms/Picto/Picto";
import { Picto } from "../../atoms/Picto/Picto";
import { Popover } from "../Popover/Popover";
import { Tooltip } from "../Tooltip/Tooltip";

import styles from "./ToolBar.module.scss";

export interface TToolBarItem {
	id: string;
	label: string;
	/** Leading icon (see Picto) — an icon name, or an `IPictoProps` object to pass other Picto props. */
	picto?: TPictoName | IPictoProps;
	onClick?: () => void;
	/** Opens this content in a Popover on click instead of firing onClick. */
	popoverContent?: React.ReactNode;
	disabled?: boolean;
}

export interface IToolBarProps
	extends
		Omit<React.ComponentPropsWithoutRef<"div">, "onChange" | "children">,
		ITestIdProps {
	items: TToolBarItem[];
	/** Which item's popover is open (only meaningful for items with `popoverContent`). */
	activeItem?: string;
	onChange?: (id: string | undefined) => void;
	/** Toolbar's own position on screen — flips popover/tooltip placement so it opens away from the edge. Defaults to "bottom". */
	position?: "top" | "bottom";
	/** Forwarded to every item's Popover/Tooltip — renders them into `document.body` via AmphorePortal. Defaults to false. */
	portal?: boolean;
	className?: string;
}

/**
 * V2 ToolBar — a row of icon/label buttons, data-driven (`items`). v1's
 * version had a custom floating-ui middleware to center a popover under
 * its anchor, a portal, and a `component`/`popover(ref)` render-prop
 * escape hatch — dropped all of it: Popover's own flip/shift already
 * handles collision, `portal` is just forwarded to Popover/Tooltip (inline
 * by default), and a plain `popoverContent` node covers the same need
 * without the render-prop indirection.
 *
 * A popover item's trigger uses a native `title` for the hover hint
 * (not Tooltip) — Tooltip's `ref` is its floating panel, not its trigger, so
 * nesting it as Popover's direct child would silently break Popover's own
 * reference (see memory: any Popover/Tooltip/Dropdown trigger must forward
 * its ref).
 *
 * Native props and `ref` go to the root `<div>`. Derived testids:
 * `-item-<id>`.
 */
const ToolBarBase: React.ForwardRefRenderFunction<
	HTMLDivElement,
	IToolBarProps
> = (
	{
		items,
		activeItem,
		onChange,
		position = "bottom",
		portal = false,
		className = "",
		...props
	},
	ref
) => {
	const placement = position === "top" ? "bottom" : "top";

	return (
		<div {...props} ref={ref} className={cn([styles.bar, className])}>
			{items.map((item) => {
				const isActive = activeItem === item.id;
				const itemTestId = deriveTestId(
					props["data-testid"],
					"item",
					item.id
				);

				const buttonContent = item.picto ? (
					<Picto {...getPicto(item.picto)} className={styles.icon} />
				) : (
					<span>{item.label}</span>
				);

				if (item.popoverContent) {
					return (
						<Popover
							key={item.id}
							open={isActive}
							onOpenChange={(open) =>
								onChange?.(open ? item.id : undefined)
							}
							placement={placement}
							disabled={item.disabled}
							portal={portal}
							content={item.popoverContent}
						>
							<button
								type="button"
								className={cn([
									styles.button,
									isActive && styles.active,
								])}
								disabled={item.disabled}
								aria-label={item.label}
								title={item.label}
								data-testid={itemTestId}
							>
								{buttonContent}
							</button>
						</Popover>
					);
				}

				const button = (
					<button
						type="button"
						className={cn([
							styles.button,
							isActive && styles.active,
						])}
						onClick={() => {
							item.onClick?.();
							onChange?.(item.id);
						}}
						disabled={item.disabled}
						aria-label={item.label}
						aria-pressed={isActive}
						data-testid={itemTestId}
					>
						{buttonContent}
					</button>
				);

				return item.picto ? (
					<Tooltip
						key={item.id}
						content={item.label}
						placement={placement}
						portal={portal}
					>
						{button}
					</Tooltip>
				) : (
					<React.Fragment key={item.id}>{button}</React.Fragment>
				);
			})}
		</div>
	);
};

export const ToolBar = forwardRef(ToolBarBase);
ToolBar.displayName = "ToolBar";
