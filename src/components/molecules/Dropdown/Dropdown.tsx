import React, { useRef, useState } from "react";

import {
	flip,
	offset,
	shift,
	size,
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
	useListNavigation,
	useMergeRefs,
	useRole,
	type Placement,
} from "@floating-ui/react";

import type { TMenuItem } from "@interfaces/index";

import { MenuList } from "./MenuList";

export interface IDropdownProps {
	items: TMenuItem[];
	/** Single element — cloned to attach the trigger's ref/click handler. */
	children: React.ReactElement;
	placement?: Placement;
	disabled?: boolean;
	className?: string;
}

/**
 * V2 Dropdown — click-triggered action menu (role="menu"/"menuitem", real
 * roving DOM focus). Triggers one-off actions, doesn't persist a value
 * (unlike Select). Menu rendering itself lives in shared `MenuList` (also
 * used by ContextMenu). No portal, `strategy:"fixed"` instead (see
 * memory/amphorelib-v2-conventions.md). Trigger must be forwardRef.
 */
export function Dropdown({
	items,
	children,
	placement = "bottom-start",
	disabled = false,
	className = "",
}: IDropdownProps) {
	const [open, setOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const listRef = useRef<Array<HTMLButtonElement | null>>([]);

	const { refs, floatingStyles, context } = useFloating({
		open: disabled ? false : open,
		onOpenChange: setOpen,
		placement,
		strategy: "fixed",
		middleware: [
			offset(4),
			flip({
				padding: 8,
				// Past the usual top/bottom flip: "right"/"left" give the
				// menu a full side of the trigger instead of needing it all
				// above or below — the last resort before `size` below has
				// to clamp height and scroll.
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

	const click = useClick(context, { enabled: !disabled });
	const dismiss = useDismiss(context);
	const role = useRole(context, { role: "menu" });
	const listNav = useListNavigation(context, {
		listRef,
		activeIndex,
		onNavigate: setActiveIndex,
		loop: true,
	});

	const { getReferenceProps, getFloatingProps, getItemProps } =
		useInteractions([click, dismiss, role, listNav]);

	const childRef = (children as unknown as { ref?: React.Ref<unknown> }).ref;
	const mergedRef = useMergeRefs([refs.setReference, childRef ?? null]);

	const trigger = React.cloneElement(
		children,
		getReferenceProps({ ...children.props, ref: mergedRef })
	);

	const handleSelect = (item: TMenuItem) => {
		if (item.disabled) return;
		item.onClick(item);
		setOpen(false);
	};

	return (
		<>
			{trigger}
			{open && (
				<MenuList
					items={items}
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
			)}
		</>
	);
}
