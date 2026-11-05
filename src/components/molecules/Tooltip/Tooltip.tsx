import React, { cloneElement, forwardRef, useState } from "react";

import {
	flip,
	offset,
	safePolygon,
	shift,
	useClick,
	useDismiss,
	useFloating,
	useFocus,
	useHover,
	useInteractions,
	useMergeRefs,
	useRole,
	type Placement,
} from "@floating-ui/react";

import { AmphorePortal } from "@theme/AmphorePortal";

import { useEscapeLayer } from "@hooks/index";

import { cn } from "@utils/cn";

import styles from "./Tooltip.module.scss";

export interface ITooltipProps extends Omit<
	React.ComponentPropsWithoutRef<"div">,
	"content" | "children"
> {
	content: React.ReactNode;
	/** Single element — cloned to attach the trigger's ref/hover/focus handlers. */
	children: React.ReactElement;
	placement?: Placement;
	disabled?: boolean;
	/** Renders the tooltip into `document.body` via AmphorePortal (theme scope re-applied) — escapes any ancestor stacking context/`transform`/`overflow` that would trap or clip it. Defaults to false (inline, `position: fixed`). */
	portal?: boolean;
	className?: string;
}

const TooltipBase: React.ForwardRefRenderFunction<
	HTMLDivElement,
	ITooltipProps
> = (
	{
		content,
		children,
		placement = "top",
		disabled = false,
		portal = false,
		className = "",
		style,
		...props
	},
	ref
) => {
	const [open, setOpen] = useState(false);

	const { refs, floatingStyles, context } = useFloating({
		open: disabled ? false : open,
		onOpenChange: setOpen,
		placement,
		strategy: "fixed",
		middleware: [offset(6), flip({ padding: 8 }), shift({ padding: 8 })],
	});

	const hover = useHover(context, {
		move: false,
		enabled: !disabled,
		handleClose: safePolygon(),
	});
	const focus = useFocus(context, { enabled: !disabled });
	const tap = useClick(context, {
		ignoreMouse: true,
		keyboardHandlers: false,
		enabled: !disabled,
	});
	const dismiss = useDismiss(context, { escapeKey: false });
	useEscapeLayer(open && !disabled, () => setOpen(false));
	const role = useRole(context, { role: "tooltip" });

	const { getReferenceProps, getFloatingProps } = useInteractions([
		hover,
		focus,
		tap,
		dismiss,
		role,
	]);

	// Preserves whatever ref the child already carries (its own DOM ref, a
	// forwardRef from another component...) instead of silently overwriting
	// it — a plain `ref={refs.setReference}` would break the child's own use
	// of its ref.
	const childRef = (children as unknown as { ref?: React.Ref<unknown> }).ref;
	const mergedRef = useMergeRefs([refs.setReference, childRef ?? null]);
	const floatingRef = useMergeRefs([refs.setFloating, ref]);

	const trigger = cloneElement(
		children,
		getReferenceProps({ ...children.props, ref: mergedRef })
	);

	const floating = open && !disabled && !!content && (
		<div
			{...getFloatingProps(props)}
			ref={floatingRef}
			style={{ ...style, ...floatingStyles }}
			className={cn([styles.tooltip, className])}
		>
			{content}
		</div>
	);

	return (
		<>
			{trigger}
			{portal ? <AmphorePortal>{floating}</AmphorePortal> : floating}
		</>
	);
};

/**
 * V2 Tooltip — hover/focus-triggered (tap on touch), non-interactive text hint
 * (role="tooltip"). Display-only, unlike Popover (click, interactive
 * content) — a separate component, not a variant. Inline
 * (`strategy:"fixed"`) by default, `portal` opts into AmphorePortal (see
 * memory/amphorelib-v2-conventions.md).
 *
 * Touch has no hover: iOS only fires the emulated mouse events hover relies
 * on for elements it deems clickable, so a tooltip on a plain element
 * never opened there. A tap now toggles it (useClick with `ignoreMouse`,
 * so a mouse click doesn't fight the hover), and a tap elsewhere closes it.
 *
 * Keyboard stays out of that: focus already opens the tooltip, and useClick's
 * key handling would swallow Space on any control nested in the trigger (it
 * only spares real buttons). `safePolygon` keeps it open while the pointer
 * travels onto it, so someone zoomed in can read what's under the cursor
 * (WCAG 1.4.13).
 *
 * No root element of its own: native props and `ref` go to the floating
 * bubble, the trigger keeps whatever its own element was given.
 */
export const Tooltip = forwardRef(TooltipBase);
Tooltip.displayName = "Tooltip";
