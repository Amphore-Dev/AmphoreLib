import React, { cloneElement, useState } from "react";

import {
	flip,
	offset,
	shift,
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
	useMergeRefs,
	useRole,
	type Placement,
} from "@floating-ui/react";

import { cn } from "@utils/cn";

import styles from "./Popover.module.scss";

export interface IPopoverProps {
	content: React.ReactNode;
	/** Single element — cloned to attach the trigger's ref/click handler. */
	children: React.ReactElement;
	placement?: Placement;
	/** Controlled open state. Omit to let Popover manage it internally. */
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** Clicking outside the popover closes it. Defaults to true. */
	closeOnOutsideClick?: boolean;
	/**
	 * Clicking anywhere inside `content` also closes it — e.g. a menu-like
	 * popover where every item is a one-off action, not something that
	 * itself manages `open`/`onOpenChange`. Off by default: interactive
	 * content that isn't "pick one and done" (a form, a color picker with
	 * its own multi-step UI) would otherwise close on its very first click.
	 */
	closeOnClick?: boolean;
	disabled?: boolean;
	className?: string;
}

/**
 * V2 Popover — click-triggered, can hold interactive content. role="dialog",
 * non-modal (no focus trap/page dim, unlike Modal). Separate component from
 * Tooltip (hover/focus, display-only) — different trigger/role, not a flag.
 * Controlled (`open`/`onOpenChange`) or uncontrolled (omit `open`). No
 * portal, `strategy:"fixed"` instead (see memory/amphorelib-v2-conventions.md).
 */
export const Popover: React.FC<IPopoverProps> = ({
	content,
	children,
	placement = "bottom-start",
	open: openProp,
	onOpenChange,
	closeOnOutsideClick = true,
	closeOnClick = false,
	disabled = false,
	className = "",
}) => {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
	const open = disabled ? false : (openProp ?? uncontrolledOpen);

	const setOpen = (next: boolean) => {
		if (openProp === undefined) setUncontrolledOpen(next);
		onOpenChange?.(next);
	};

	const { refs, floatingStyles, context } = useFloating({
		open,
		onOpenChange: setOpen,
		placement,
		strategy: "fixed",
		middleware: [offset(6), flip({ padding: 8 }), shift({ padding: 8 })],
	});

	const click = useClick(context, { enabled: !disabled });
	const dismiss = useDismiss(context, { outsidePress: closeOnOutsideClick });
	const role = useRole(context, { role: "dialog" });

	const { getReferenceProps, getFloatingProps } = useInteractions([
		click,
		dismiss,
		role,
	]);

	const childRef = (children as unknown as { ref?: React.Ref<unknown> }).ref;
	const mergedRef = useMergeRefs([refs.setReference, childRef ?? null]);

	const trigger = cloneElement(
		children,
		getReferenceProps({ ...children.props, ref: mergedRef })
	);

	return (
		<>
			{trigger}
			{open && (
				<div
					ref={refs.setFloating}
					style={floatingStyles}
					className={cn([styles.popover, className])}
					{...getFloatingProps({
						onClick: closeOnClick
							? () => setOpen(false)
							: undefined,
					})}
				>
					{content}
				</div>
			)}
		</>
	);
};
