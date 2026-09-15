import React from "react";

import { FloatingFocusManager, type FloatingContext } from "@floating-ui/react";

import { getPicto } from "@utils/UPicto";
import { cn } from "@utils/cn";

import type { TMenuItem } from "@interfaces/index";

import { Picto } from "../../atoms/Picto/Picto";

import styles from "./Dropdown.module.scss";

export interface IMenuListProps {
	items: TMenuItem[];
	context: FloatingContext;
	floatingRef: (node: HTMLDivElement | null) => void;
	floatingStyles: React.CSSProperties;
	getFloatingProps: () => Record<string, unknown>;
	getItemProps: (
		item: TMenuItem,
		onSelect: () => void
	) => Record<string, unknown>;
	itemRef: (node: HTMLButtonElement | null, index: number) => void;
	onSelect: (item: TMenuItem) => void;
	activeIndex: number | null;
	className?: string;
}

/**
 * Shared menu rendering (role="menu"/"menuitem", roving DOM focus, item
 * markup/styles) — used by both Dropdown (click-triggered) and ContextMenu
 * (right-click, virtual position reference at the cursor). The two only
 * differ in *how* they open/position; once open, the menu itself is
 * identical, so it lives here once instead of being duplicated.
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
}) => (
	<FloatingFocusManager context={context} modal={false}>
		<div
			ref={floatingRef}
			style={floatingStyles}
			className={cn([styles.menu, className])}
			{...getFloatingProps()}
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
						disabled={item.disabled}
						data-color={item.color}
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
