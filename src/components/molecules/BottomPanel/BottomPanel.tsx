import React, { PropsWithChildren, useEffect, useRef, useState } from "react";

import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { cn } from "@utils/cn";

import type { TLabel } from "@interfaces/index";

import { Card } from "../../atoms/Card/Card";

import styles from "./BottomPanel.module.scss";

export interface IBottomPanelProps extends PropsWithChildren {
	/** Controlled — same convention as Modal/ConfirmModal. `false` doesn't unmount the panel, it docks it to `minHeight` (a peeking handle, not gone) — for a version that's fully gone, don't render this at all. */
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Expanded height in px, restored on reopen. Defaults to 500. */
	defaultHeight?: number;
	/** Collapsed (docked) height in px. Defaults to 48. */
	minHeight?: number;
	/** Cap on how tall a drag can make it, as a fraction of the viewport height (0-1). Defaults to 0.9. */
	maxHeightRatio?: number;
	/** Ending a drag below this height (px) closes the panel instead of snapping back to its dragged height. Defaults to 200. */
	closeThreshold?: number;
	/** aria-label for the panel's `role="dialog"` container while open. Defaults to "Panel open" (or `BottomPanel.openLabel` from the nearest AmphoreProvider — see useAmphoreLabels). */
	openLabel?: TLabel;
	/** aria-label for the panel's `role="dialog"` container while collapsed (docked). Defaults to "Panel collapsed" (or `BottomPanel.collapsedLabel` from the nearest AmphoreProvider). */
	collapsedLabel?: TLabel;
	/** aria-label for the drag handle while open (tapping/dragging it collapses the panel). Defaults to "Collapse panel" (or `BottomPanel.collapseLabel` from the nearest AmphoreProvider). */
	collapseLabel?: TLabel;
	/** aria-label for the drag handle while collapsed (tapping/dragging it expands the panel). Defaults to "Expand panel" (or `BottomPanel.expandLabel` from the nearest AmphoreProvider). */
	expandLabel?: TLabel;
	className?: string;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TBottomPanelLabels = Pick<
	IBottomPanelProps,
	"openLabel" | "collapsedLabel" | "collapseLabel" | "expandLabel"
>;

const DRAG_THRESHOLD = 4;

/**
 * V2 BottomPanel — a draggable bottom sheet: a handle you tap to toggle
 * open/closed, or drag to resize (and drag past `closeThreshold` to close).
 * No portal — `position: fixed` already escapes normal layout without one
 * (same reasoning as Modal's FloatingOverlay). Reusable on its own (a
 * mobile action sheet, say) — SidePanel uses it as its own mobile
 * fallback, but this doesn't know anything about that.
 */
export const BottomPanel: React.FC<IBottomPanelProps> = ({
	open,
	onOpenChange,
	defaultHeight = 500,
	minHeight = 48,
	maxHeightRatio = 0.9,
	closeThreshold = 200,
	openLabel: openLabelProp,
	collapsedLabel: collapsedLabelProp,
	collapseLabel: collapseLabelProp,
	expandLabel: expandLabelProp,
	className = "",
	children,
}) => {
	const { resolve } = useAmphoreLabels("BottomPanel");
	const openLabel = resolve("openLabel", openLabelProp);
	const collapsedLabel = resolve("collapsedLabel", collapsedLabelProp);
	const collapseLabel = resolve("collapseLabel", collapseLabelProp);
	const expandLabel = resolve("expandLabel", expandLabelProp);
	const [height, setHeight] = useState(defaultHeight);
	const [dragging, setDragging] = useState(false);

	// Mirrors `height`/`open` for the pointerup handler below — it's added
	// to `window`, not a React element, so its closure would otherwise
	// always see the value from the render it was created in, not the
	// latest one.
	const heightRef = useRef(height);
	heightRef.current = height;
	const openRef = useRef(open);
	openRef.current = open;

	const draggingRef = useRef(false);
	const movedRef = useRef(false);
	const startYRef = useRef(0);
	const startHeightRef = useRef(0);

	const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
		draggingRef.current = true;
		setDragging(true);
		movedRef.current = false;
		startYRef.current = "touches" in e ? e.touches[0].clientY : e.clientY;
		startHeightRef.current = open ? height : minHeight;
		e.preventDefault();
	};

	useEffect(() => {
		const maxHeight = window.innerHeight * maxHeightRatio;

		const onMove = (e: MouseEvent | TouchEvent) => {
			if (!draggingRef.current) return;
			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
			const delta = startYRef.current - clientY;
			if (Math.abs(delta) > DRAG_THRESHOLD) movedRef.current = true;
			if (!movedRef.current) return;
			setHeight(
				Math.min(
					maxHeight,
					Math.max(minHeight, startHeightRef.current + delta)
				)
			);
		};

		const onEnd = () => {
			if (!draggingRef.current) return;
			draggingRef.current = false;
			setDragging(false);

			if (!movedRef.current) {
				// A tap, not a drag — toggle regardless of direction.
				onOpenChange(!openRef.current);
			} else if (heightRef.current <= closeThreshold) {
				onOpenChange(false);
				setHeight(defaultHeight);
			} else {
				onOpenChange(true);
			}
			movedRef.current = false;
		};

		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", onEnd);
		window.addEventListener("touchmove", onMove);
		window.addEventListener("touchend", onEnd);
		return () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onEnd);
			window.removeEventListener("touchmove", onMove);
			window.removeEventListener("touchend", onEnd);
		};
	}, [
		closeThreshold,
		defaultHeight,
		maxHeightRatio,
		minHeight,
		onOpenChange,
	]);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key !== "Enter" && e.key !== " ") return;
		e.preventDefault();
		onOpenChange(!open);
	};

	return (
		<Card
			elevation={4}
			noPadding
			className={cn([styles.panel, className])}
			style={{ height: open ? height : minHeight }}
			data-dragging={dragging || undefined}
			role="dialog"
			aria-label={open ? openLabel : collapsedLabel}
		>
			<button
				type="button"
				className={styles.handle}
				onMouseDown={handlePointerDown}
				onTouchStart={handlePointerDown}
				onKeyDown={handleKeyDown}
				aria-expanded={open}
				aria-label={open ? collapseLabel : expandLabel}
			>
				<span className={styles.grip} />
			</button>

			<div className={styles.content} hidden={!open}>
				{children}
			</div>
		</Card>
	);
};
