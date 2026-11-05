import React from "react";

import { FloatingFocusManager, type FloatingContext } from "@floating-ui/react";

import { getPicto } from "@utils/UPicto";
import { deriveTestId } from "@utils/UTestId";
import { cn } from "@utils/cn";

import type { ITestIdProps, TElementProps, TMenuItem } from "@interfaces/index";

import { Picto } from "../../atoms/Picto/Picto";

import styles from "./Dropdown.module.scss";

export interface IMenuListProps {
	items: TMenuItem[];
	context: FloatingContext;
	floatingRef: (node: HTMLDivElement | null) => void;
	floatingStyles: React.CSSProperties;
	getFloatingProps: (
		userProps?: React.HTMLProps<HTMLElement>
	) => Record<string, unknown>;
	getItemProps: (
		item: TMenuItem,
		onSelect: () => void
	) => Record<string, unknown>;
	itemRef: (node: HTMLButtonElement | null, index: number) => void;
	onSelect: (item: TMenuItem) => void;
	activeIndex: number | null;
	className?: string;
	/** Native props of the menu element. */
	menuProps?: TElementProps<"div"> & ITestIdProps;
}

/**
 * Shared menu rendering (role="menu"/"menuitem", roving DOM focus, item
 * markup/styles) — used by both Dropdown (click-triggered) and ContextMenu
 * (right-click, virtual position reference at the cursor). The two only
 * differ in *how* they open/position; once open, the menu itself is
 * identical, so it lives here once instead of being duplicated. Derived
 * testids: `-item-<id>`, or `-item-<position>` for an item without one.
 */
export const MenuList: React.FC<IMenuListProps> = ({
	items,
	context,
	floatingRef,
	floatingStyles,
	getFloatingProps,
	getItemProps,
	itemRef,
	onSelect,
	activeIndex,
	className = "",
	menuProps,
}) => (
	<FloatingFocusManager context={context} modal={false}>
		<div
			{...getFloatingProps(menuProps as React.HTMLProps<HTMLElement>)}
			ref={floatingRef}
			style={{ ...menuProps?.style, ...floatingStyles }}
			className={cn([styles.menu, className])}
		>
			{/* Filtered before mapping — index must match what's rendered. */}
			{items
				.filter((item) => !item.hidden)
				.map((item, index) => (
					<button
						key={item.label}
						ref={(node) => itemRef(node, index)}
						type="button"
						role="menuitem"
						// One tab stop: Tab leaves the menu (which closes it),
						// the arrows move inside it.
						tabIndex={
							activeIndex === index ||
							(activeIndex === null && index === 0)
								? 0
								: -1
						}
						disabled={item.disabled}
						data-color={item.color}
						data-testid={deriveTestId(
							menuProps?.["data-testid"],
							"item",
							item.id ?? index
						)}
						className={cn([
							styles.item,
							activeIndex === index && styles.itemActive,
						])}
						{...getItemProps(item, () => onSelect(item))}
					>
						{!!item.picto && (
							<Picto
								{...getPicto(item.picto)}
								className={styles.picto}
							/>
						)}
						{item.label}
					</button>
				))}
		</div>
	</FloatingFocusManager>
);
