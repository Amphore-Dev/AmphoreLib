import { useEffect, useRef, useState } from "react";

import {
	flip,
	shift,
	size,
	useDismiss,
	useFloating,
	useInteractions,
	useListNavigation,
	useRole,
} from "@floating-ui/react";

import { AmphorePortal } from "@theme/AmphorePortal";

import type { TMenuItem } from "@interfaces/index";

import { MenuList } from "../Dropdown/MenuList";

import type { IContextMenuController } from "./useContextMenu";

export interface IContextMenuProps<T> {
	/** From `useContextMenu()`. Any number of elements can call `menu.show` — this renders once, shared by all of them. */
	menu: IContextMenuController<T>;
	/** Static list, or resolved from whatever `data` the triggering `show(event, data)` call passed. */
	items: TMenuItem[] | ((data: T) => TMenuItem[]);
	disabled?: boolean;
	/** Renders the menu into `document.body` via AmphorePortal (theme scope re-applied) — escapes any ancestor stacking context/`transform`/`overflow` that would trap or clip it. Defaults to false (inline, `position: fixed`). */
	portal?: boolean;
	className?: string;
}

/**
 * V2 ContextMenu — one shared instance, many right-click triggers
 * (react-contexify's model): `useContextMenu()`'s `show(event, data)` from
 * as many `onContextMenu` handlers as needed, `items` resolved against
 * whatever `data` the triggering call passed. Reuses Dropdown's `MenuList`,
 * positions via a virtual reference at the cursor (`refs.setPositionReference`)
 * — no trigger ref/forwardRef needed, unlike Dropdown. Inline
 * (`strategy:"fixed"`) by default, `portal` opts into AmphorePortal.
 */
export function ContextMenu<T = undefined>({
	menu,
	items,
	disabled = false,
	portal = false,
	className = "",
}: IContextMenuProps<T>) {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const listRef = useRef<Array<HTMLButtonElement | null>>([]);
	const open = !disabled && menu.state !== null;

	const { refs, floatingStyles, context } = useFloating({
		open,
		onOpenChange: (next) => {
			if (!next) menu.hide();
		},
		placement: "bottom-start",
		strategy: "fixed",
		middleware: [
			flip({
				padding: 8,
				// Past the usual top/bottom flip: "right"/"left" center the
				// menu vertically on the cursor (half the space above, half
				// below) instead of needing it all on one side — the last
				// resort before `size` below has to clamp height and scroll.
				fallbackPlacements: [
					"top-start",
					"bottom-start",
					"right",
					"left",
				],
			}),
			shift({ padding: 8 }),
			// Clamps to the actual room left in the viewport (not a fixed
			// rem cap) — a long list still scrolls once it hits the screen
			// edge, but a short one never gets a needless scrollbar.
			size({
				padding: 8,
				apply({ availableHeight, elements }) {
					elements.floating.style.maxHeight = `${availableHeight}px`;
				},
			}),
		],
	});

	const dismiss = useDismiss(context);
	const role = useRole(context, { role: "menu" });
	const listNav = useListNavigation(context, {
		listRef,
		activeIndex,
		onNavigate: setActiveIndex,
		loop: true,
	});

	const { getFloatingProps, getItemProps } = useInteractions([
		dismiss,
		role,
		listNav,
	]);

	// Re-anchors to the new cursor position every time a trigger calls
	// `show` — including while already open (right-clicking a different
	// row moves the menu instead of needing to close/reopen it first).
	useEffect(() => {
		if (!menu.state) return;
		const { x, y } = menu.state;
		refs.setPositionReference({
			getBoundingClientRect: () => ({
				x,
				y,
				width: 0,
				height: 0,
				top: y,
				left: x,
				right: x,
				bottom: y,
			}),
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps -- refs is stable; only re-anchor when the trigger position itself changes
	}, [menu.state]);

	if (!open || !menu.state) return null;

	const resolvedItems =
		typeof items === "function" ? items(menu.state.data) : items;

	const handleSelect = (item: TMenuItem) => {
		if (item.disabled) return;
		item.onClick(item);
		menu.hide();
	};

	const list = (
		<MenuList
			items={resolvedItems}
			context={context}
			floatingRef={refs.setFloating}
			floatingStyles={floatingStyles}
			getFloatingProps={getFloatingProps}
			getItemProps={(_item, onClick) => getItemProps({ onClick })}
			itemRef={(node, index) => {
				listRef.current[index] = node;
			}}
			onSelect={handleSelect}
			activeIndex={activeIndex}
			className={className}
		/>
	);

	return portal ? <AmphorePortal>{list}</AmphorePortal> : list;
}
