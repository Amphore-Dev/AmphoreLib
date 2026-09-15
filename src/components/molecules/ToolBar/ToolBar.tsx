import React from "react";

import { TPictoName } from "@constants/index";

import { getPicto } from "@utils/UPicto";
import { cn } from "@utils/cn";

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

export interface IToolBarProps {
	items: TToolBarItem[];
	/** Which item's popover is open (only meaningful for items with `popoverContent`). */
	activeItem?: string;
	onChange?: (id: string | undefined) => void;
	/** Toolbar's own position on screen — flips popover/tooltip placement so it opens away from the edge. Defaults to "bottom". */
	position?: "top" | "bottom";
	className?: string;
}

/**
 * V2 ToolBar — a row of icon/label buttons, data-driven (`items`). v1's
 * version had a custom floating-ui middleware to center a popover under
 * its anchor, a portal, and a `component`/`popover(ref)` render-prop
 * escape hatch — dropped all of it: Popover's own flip/shift already
 * handles collision, no portal per this lib's standing convention, and a
 * plain `popoverContent` node covers the same need without the render-prop
 * indirection.
 *
 * A popover item's trigger uses a native `title` for the hover hint
 * (not Tooltip) — Tooltip isn't `forwardRef`, so nesting it as Popover's
 * direct child would silently break Popover's own ref (see memory:
 * any Popover/Tooltip/Dropdown trigger must forward its ref).
 */
export const ToolBar: React.FC<IToolBarProps> = ({
	items,
	activeItem,
	onChange,
	position = "bottom",
	className = "",
}) => {
	const placement = position === "top" ? "bottom" : "top";

	return (
		<div className={cn([styles.bar, className])}>
			{items.map((item) => {
				const isActive = activeItem === item.id;

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
					>
						{buttonContent}
					</button>
				);

				return item.picto ? (
					<Tooltip
						key={item.id}
						content={item.label}
						placement={placement}
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
