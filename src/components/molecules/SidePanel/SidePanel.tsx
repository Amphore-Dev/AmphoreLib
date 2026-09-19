import React, { PropsWithChildren } from "react";

import { AmphorePortal } from "@theme/AmphorePortal";
import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { useMediaQuery } from "@hooks/index";

import { cn } from "@utils/cn";

import type { TLabel } from "@interfaces/index";

import { Card, ICardProps } from "../../atoms/Card/Card";
import { Picto } from "../../atoms/Picto/Picto";
import { BottomPanel, IBottomPanelProps } from "../BottomPanel/BottomPanel";
import { IModalProps, Modal } from "../Modal/Modal";

import styles from "./SidePanel.module.scss";

export interface ISidePanelProps extends PropsWithChildren {
	/** Controlled — same convention as Modal/ConfirmModal. */
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: React.ReactNode;
	/**
	 * Extra header content, next to `title` and the close button, in the
	 * row that stays put while the body scrolls — desktop and the mobile
	 * Modal alike (Modal's own `header` slot). With no `title` and
	 * `hideCloseButton`, it's the whole header: a consumer's own heading
	 * and actions, without having to fake a sticky header inside the
	 * padded body. The mobile BottomPanel has no fixed header row: there
	 * it's rendered at the top of the content, like `title`.
	 */
	header?: React.ReactNode;
	/** Hides the built-in header close (×) button — desktop, and the mobile Modal when `mobileMode="modal"`. No effect on the mobile BottomPanel, whose own handle already doubles as that affordance. Defaults to false. */
	hideCloseButton?: boolean;
	/** Below this width (px), renders as `mobileMode` (a BottomPanel sliding up from the bottom by default) instead of a docked side panel. Defaults to 1280. */
	mobileBreakpoint?: number;
	/**
	 * What to render below `mobileBreakpoint`. `"bottomPanel"` (default): a
	 * draggable BottomPanel sheet sliding up from the bottom — tap/drag its
	 * handle to close, no header row. `"modal"`: a centered Modal instead
	 * (dimmed backdrop, header with `title` and the close button, Escape /
	 * outside-click closing through `onOpenChange(false)`) — for detail
	 * content that reads better centered than docked to the bottom edge.
	 * `keepDockedOnMobile` and `bottomPanelProps` only apply to
	 * `"bottomPanel"`; `modalProps` only to `"modal"`.
	 */
	mobileMode?: "bottomPanel" | "modal";
	/**
	 * Desktop only. `false` (default): `position: sticky` — the panel is a
	 * real column, sitting next to the page's own content, which keeps its
	 * width and stays put. `true`: `position: fixed` instead — the panel
	 * floats above the page, full height, without the rest of the layout
	 * making room for it (no dimming backdrop, no outside-click-to-close —
	 * add those yourself around it if this needs to behave like a modal).
	 */
	overlay?: boolean;
	/**
	 * Mobile only, `mobileMode="bottomPanel"` only. `false` (default):
	 * closing behaves the same as desktop — the panel is fully gone,
	 * nothing rendered at all. `true`: closing docks it to a peeking
	 * handle instead (BottomPanel's own native behavior — tap or drag it
	 * back up to reopen), for when there's still something worth peeking
	 * at even while "closed" (a mini player, an ongoing upload). Most
	 * consumers want the default — "closed" meaning nothing selected,
	 * nothing to peek at. Ignored in `"modal"` mode: a closed modal has
	 * nothing to peek at.
	 */
	keepDockedOnMobile?: boolean;
	/** Passed straight to the mobile BottomPanel fallback (defaultHeight, minHeight, closeThreshold...). Ignored when `mobileMode="modal"`. */
	bottomPanelProps?: Partial<
		Omit<IBottomPanelProps, "open" | "onOpenChange" | "children">
	>;
	/**
	 * Passed straight to the mobile Modal fallback when
	 * `mobileMode="modal"` (size, closeOnOverlayClick, closeOnEscape...).
	 * Everything SidePanel already owns (`open`/`onOpenChange`, `title`,
	 * `hideCloseButton`, `closeLabel`, `portal`, `className`) is wired from
	 * SidePanel's own props, not from here. Ignored when
	 * `mobileMode="bottomPanel"`.
	 */
	modalProps?: Partial<
		Omit<
			IModalProps,
			| "open"
			| "onClose"
			| "children"
			| "title"
			| "header"
			| "hideCloseButton"
			| "closeLabel"
			| "portal"
			| "className"
		>
	>;
	/**
	 * Desktop only: passed straight to the docked panel's Card (elevation,
	 * bordered, shadow, style, id, data-* attributes...). `elevation`
	 * overrides the default (2 docked, 4 as `overlay`); `aria-label`
	 * overrides the one derived from a string `title`. What the panel
	 * owns itself (`className`, `noPadding`, `role`, `children`) stays
	 * wired from SidePanel's own props. Ignored on mobile, where the
	 * fallback is a BottomPanel or a Modal, not this Card.
	 */
	cardProps?: Partial<
		Omit<ICardProps, "children" | "className" | "noPadding" | "role">
	>;
	/** aria-label for the close (×) button — desktop, and the mobile Modal when `mobileMode="modal"`. Defaults to "Close" (or `common.close`/`SidePanel.closeLabel` from the nearest AmphoreProvider). No effect on the mobile BottomPanel (see `hideCloseButton`). */
	closeLabel?: TLabel;
	/**
	 * Renders into `document.body` via AmphorePortal (theme scope
	 * re-applied) — the `overlay` desktop panel and the mobile fallback
	 * (BottomPanel or Modal) both. No effect in the default sticky desktop
	 * mode: a real layout column can't be portaled, it has to sit in the
	 * flow next to the page. Defaults to false.
	 */
	portal?: boolean;
	className?: string;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TSidePanelLabels = Pick<ISidePanelProps, "closeLabel">;

/**
 * V2 SidePanel — a docked detail panel: a sticky right-hand column on
 * desktop, and below `mobileBreakpoint` either a draggable BottomPanel
 * sliding up from the bottom (default) or a centered Modal
 * (`mobileMode="modal"`). The one legitimate use of `useMediaQuery` in
 * this lib (see its own doc comment) — desktop and mobile aren't the same
 * tree styled differently, they're two different components. Closing
 * behaves the same on both by default (fully gone) — `keepDockedOnMobile`
 * opts the mobile BottomPanel into its own native closed-but-peeking
 * behavior instead, for the cases that actually want it.
 */
export const SidePanel: React.FC<ISidePanelProps> = ({
	open,
	onOpenChange,
	title,
	header,
	hideCloseButton = false,
	mobileBreakpoint = 1280,
	mobileMode = "bottomPanel",
	overlay = false,
	keepDockedOnMobile = false,
	bottomPanelProps,
	modalProps,
	cardProps,
	closeLabel: closeLabelProp,
	portal = false,
	className = "",
	children,
}) => {
	const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint - 1}px)`);
	const { resolve } = useAmphoreLabels("SidePanel");
	const closeLabel = resolve("closeLabel", closeLabelProp, "close");

	if (isMobile && mobileMode === "modal") {
		// Modal's `title` is a plain string (it doubles as the dialog's
		// aria-labelledby heading); a richer ReactNode title goes in the
		// body instead, same as the BottomPanel branch below.
		const titleIsString = typeof title === "string";
		return (
			<Modal
				{...modalProps}
				open={open}
				onClose={() => onOpenChange(false)}
				title={titleIsString ? title : undefined}
				header={header}
				hideCloseButton={hideCloseButton}
				closeLabel={closeLabel}
				portal={portal}
				className={className}
			>
				{title && !titleIsString && (
					<h2 className={styles.mobileTitle}>{title}</h2>
				)}
				{children}
			</Modal>
		);
	}

	if (isMobile) {
		if (!open && !keepDockedOnMobile) return null;

		return (
			<BottomPanel
				{...bottomPanelProps}
				open={open}
				onOpenChange={onOpenChange}
				portal={portal}
				className={className}
			>
				{title && <h2 className={styles.mobileTitle}>{title}</h2>}
				{header}
				{children}
			</BottomPanel>
		);
	}

	if (!open) return null;

	const panel = (
		<Card
			elevation={overlay ? 4 : 2}
			aria-label={typeof title === "string" ? title : undefined}
			{...cardProps}
			noPadding
			className={cn([styles.panel, className])}
			data-overlay={overlay || undefined}
			role="complementary"
		>
			{(title || header || !hideCloseButton) && (
				<div className={styles.header}>
					{title && <h2 className={styles.title}>{title}</h2>}
					{header && (
						<div className={styles.headerSlot}>{header}</div>
					)}
					{!hideCloseButton && (
						<button
							type="button"
							className={styles.close}
							onClick={() => onOpenChange(false)}
							aria-label={closeLabel}
						>
							<Picto icon="cross" />
						</button>
					)}
				</div>
			)}
			<div className={styles.body}>{children}</div>
		</Card>
	);

	return portal && overlay ? <AmphorePortal>{panel}</AmphorePortal> : panel;
};
