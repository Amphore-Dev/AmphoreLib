import React, { PropsWithChildren } from "react";

import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { useMediaQuery } from "@hooks/index";

import { cn } from "@utils/cn";

import type { TLabel } from "@interfaces/index";

import { Card } from "../../atoms/Card/Card";
import { Picto } from "../../atoms/Picto/Picto";
import { BottomPanel, IBottomPanelProps } from "../BottomPanel/BottomPanel";

import styles from "./SidePanel.module.scss";

export interface ISidePanelProps extends PropsWithChildren {
	/** Controlled — same convention as Modal/ConfirmModal. */
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: React.ReactNode;
	/** Hides the built-in header close (×) button. Desktop only — the mobile BottomPanel's own handle already doubles as that affordance. Defaults to false. */
	hideCloseButton?: boolean;
	/** Below this width (px), renders as a BottomPanel sliding up from the bottom instead of a docked side panel. Defaults to 1280. */
	mobileBreakpoint?: number;
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
	 * Mobile only. `false` (default): closing behaves the same as desktop
	 * — the panel is fully gone, nothing rendered at all. `true`: closing
	 * docks it to a peeking handle instead (BottomPanel's own native
	 * behavior — tap or drag it back up to reopen), for when there's
	 * still something worth peeking at even while "closed" (a mini
	 * player, an ongoing upload). Most consumers want the default —
	 * "closed" meaning nothing selected, nothing to peek at.
	 */
	keepDockedOnMobile?: boolean;
	/** Passed straight to the mobile BottomPanel fallback (defaultHeight, minHeight, closeThreshold...). */
	bottomPanelProps?: Partial<
		Omit<IBottomPanelProps, "open" | "onOpenChange" | "children">
	>;
	/** aria-label for the desktop close (×) button. Defaults to "Close" (or `common.close`/`SidePanel.closeLabel` from the nearest AmphoreProvider). Desktop only, no effect on mobile (see `hideCloseButton`). */
	closeLabel?: TLabel;
	className?: string;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TSidePanelLabels = Pick<ISidePanelProps, "closeLabel">;

/**
 * V2 SidePanel — a docked detail panel: a sticky right-hand column on
 * desktop, a draggable BottomPanel sliding up from the bottom below
 * `mobileBreakpoint`. The one legitimate use of `useMediaQuery` in this
 * lib (see its own doc comment) — desktop and mobile aren't the same tree
 * styled differently, they're two different components. Closing behaves
 * the same on both by default (fully gone) — `keepDockedOnMobile` opts
 * mobile into BottomPanel's own native closed-but-peeking behavior
 * instead, for the cases that actually want it.
 */
export const SidePanel: React.FC<ISidePanelProps> = ({
	open,
	onOpenChange,
	title,
	hideCloseButton = false,
	mobileBreakpoint = 1280,
	overlay = false,
	keepDockedOnMobile = false,
	bottomPanelProps,
	closeLabel: closeLabelProp,
	className = "",
	children,
}) => {
	const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint - 1}px)`);
	const { resolve } = useAmphoreLabels("SidePanel");
	const closeLabel = resolve("closeLabel", closeLabelProp, "close");

	if (isMobile) {
		if (!open && !keepDockedOnMobile) return null;

		return (
			<BottomPanel
				{...bottomPanelProps}
				open={open}
				onOpenChange={onOpenChange}
				className={className}
			>
				{title && <h2 className={styles.mobileTitle}>{title}</h2>}
				{children}
			</BottomPanel>
		);
	}

	if (!open) return null;

	return (
		<Card
			elevation={overlay ? 4 : 2}
			noPadding
			className={cn([styles.panel, className])}
			data-overlay={overlay || undefined}
			role="complementary"
			aria-label={typeof title === "string" ? title : undefined}
		>
			{(title || !hideCloseButton) && (
				<div className={styles.header}>
					{title && <h2 className={styles.title}>{title}</h2>}
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
};
