import React, { cloneElement, useState } from "react";

import {
	flip,
	offset,
	shift,
	useDismiss,
	useFloating,
	useFocus,
	useHover,
	useInteractions,
	useMergeRefs,
	useRole,
	type Placement,
} from "@floating-ui/react";

import { cn } from "@utils/cn";

import styles from "./Tooltip.module.scss";

export interface ITooltipProps {
	content: React.ReactNode;
	/** Single element — cloned to attach the trigger's ref/hover/focus handlers. */
	children: React.ReactElement;
	placement?: Placement;
	disabled?: boolean;
	className?: string;
}

/**
 * V2 Tooltip — hover/focus-triggered, non-interactive text hint
 * (role="tooltip"). Display-only, unlike Popover (click, interactive
 * content) — a separate component, not a variant. No portal,
 * `strategy:"fixed"` instead (see memory/amphorelib-v2-conventions.md).
 */
export const Tooltip: React.FC<ITooltipProps> = ({
	content,
	children,
	placement = "top",
	disabled = false,
	className = "",
}) => {
	const [open, setOpen] = useState(false);

	const { refs, floatingStyles, context } = useFloating({
		open: disabled ? false : open,
		onOpenChange: setOpen,
		placement,
		strategy: "fixed",
		middleware: [offset(6), flip({ padding: 8 }), shift({ padding: 8 })],
	});

	const hover = useHover(context, { move: false, enabled: !disabled });
	const focus = useFocus(context, { enabled: !disabled });
	const dismiss = useDismiss(context);
	const role = useRole(context, { role: "tooltip" });

	const { getReferenceProps, getFloatingProps } = useInteractions([
		hover,
		focus,
		dismiss,
		role,
	]);

	// Preserves whatever ref the child already carries (its own DOM ref, a
	// forwardRef from another component...) instead of silently overwriting
	// it — a plain `ref={refs.setReference}` would break the child's own use
	// of its ref.
	const childRef = (children as unknown as { ref?: React.Ref<unknown> }).ref;
	const mergedRef = useMergeRefs([refs.setReference, childRef ?? null]);

	const trigger = cloneElement(
		children,
		getReferenceProps({ ...children.props, ref: mergedRef })
	);

	return (
		<>
			{trigger}
			{open && !disabled && !!content && (
				<div
					ref={refs.setFloating}
					style={floatingStyles}
					className={cn([styles.tooltip, className])}
					{...getFloatingProps()}
				>
					{content}
				</div>
			)}
		</>
	);
};
