import React, { PropsWithChildren, useRef, useState } from "react";

import { AmphorePortal } from "@theme/AmphorePortal";
import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { useDrag } from "@hooks/index";

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
	/** Renders the sheet into `document.body` via AmphorePortal (theme scope re-applied) — escapes any ancestor `transform`/`filter`/`contain` that would turn its `position: fixed` into a local one, or a stacking context that would trap its z-index. Defaults to false (inline). */
	portal?: boolean;
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
 * Inline by default — `position: fixed` escapes normal layout without a
 * portal (same reasoning as Modal's FloatingOverlay); `portal` opts into
 * AmphorePortal for the ancestors that break that. Reusable on its own (a
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
	portal = false,
	className = "",
	children,
}) => {
	const { resolve } = useAmphoreLabels("BottomPanel");
	const openLabel = resolve("openLabel", openLabelProp);
	const collapsedLabel = resolve("collapsedLabel", collapsedLabelProp);
	const collapseLabel = resolve("collapseLabel", collapseLabelProp);
	const expandLabel = resolve("expandLabel", expandLabelProp);
	const [height, setHeight] = useState(defaultHeight);
	const startHeightRef = useRef(0);

	const drag = useDrag({
		axis: "y",
		threshold: DRAG_THRESHOLD,
		onStart: () => {
			startHeightRef.current = open ? height : minHeight;
		},
		onMove: ({ dy }) => {
			const maxHeight = window.innerHeight * maxHeightRatio;
			setHeight(
				Math.min(
					maxHeight,
					Math.max(minHeight, startHeightRef.current - dy)
				)
			);
		},
		onEnd: ({ moved, cancelled }) => {
			if (!moved) {
				// A tap, not a drag — toggle regardless of direction. A
				// cancelled press (the browser took the gesture) isn't a tap.
				if (!cancelled) onOpenChange(!open);
			} else if (height <= closeThreshold) {
				onOpenChange(false);
				setHeight(defaultHeight);
			} else {
				onOpenChange(true);
			}
		},
	});

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key !== "Enter" && e.key !== " ") return;
		e.preventDefault();
		onOpenChange(!open);
	};

	const panel = (
		<Card
			elevation={4}
			noPadding
			className={cn([styles.panel, className])}
			style={{ height: open ? height : minHeight }}
			data-dragging={drag.isDragging || undefined}
			role="dialog"
			aria-label={open ? openLabel : collapsedLabel}
		>
			<button
				type="button"
				className={styles.handle}
				{...drag.handleProps}
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

	return portal ? <AmphorePortal>{panel}</AmphorePortal> : panel;
};
