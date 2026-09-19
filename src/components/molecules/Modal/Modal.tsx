import React from "react";

import {
	FloatingFocusManager,
	FloatingOverlay,
	useDismiss,
	useFloating,
	useId as useFloatingId,
	useInteractions,
	useRole,
} from "@floating-ui/react";

import { AmphorePortal } from "@theme/AmphorePortal";
import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { cn } from "@utils/cn";

import { TLabel, TSize } from "@interfaces/index";

import { Card } from "../../atoms/Card/Card";
import { Picto } from "../../atoms/Picto/Picto";

import styles from "./Modal.module.scss";

export interface IModalProps {
	open: boolean;
	onClose: () => void;
	title?: React.ReactNode;
	children?: React.ReactNode;
	/**
	 * Extra header content, in the same sticky row as `title` and the close
	 * button, taking whatever width is left between them. With no `title`
	 * and `hideCloseButton`, it *is* the header — for a consumer bringing
	 * its own (a heading plus its own action buttons, say) that still
	 * needs the row to stay put while the body scrolls under it.
	 */
	header?: React.ReactNode;
	footer?: React.ReactNode;
	/** Controls the panel's max-width. Defaults to "md". */
	size?: TSize;
	/** Clicking the overlay (outside the panel) closes the modal. Defaults to true. */
	closeOnOverlayClick?: boolean;
	/** Pressing Escape closes the modal. Defaults to true. */
	closeOnEscape?: boolean;
	/** Hides the built-in header close (×) button. Defaults to false. */
	hideCloseButton?: boolean;
	/** aria-label for the header close (×) button. Defaults to "Close" (or `common.close`/`Modal.closeLabel` from the nearest AmphoreProvider — see useAmphoreLabels). No effect when `hideCloseButton`. */
	closeLabel?: TLabel;
	/**
	 * Render into `document.body` (via AmphorePortal) instead of inline.
	 * Escapes any ancestor stacking context / `transform` / `overflow` that
	 * would otherwise trap or clip the overlay. The theme is re-applied
	 * inside the portal, so styling is identical either way. Defaults to
	 * false — inline, covering the viewport from wherever it's rendered.
	 */
	portal?: boolean;
	className?: string;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TModalLabels = Pick<IModalProps, "closeLabel">;

/**
 * V2 Modal — dialog overlay on floating-ui's Dialog primitives
 * (FloatingOverlay + FloatingFocusManager for the focus trap). Inline by
 * default — FloatingOverlay is already `position:fixed`, so it covers the
 * viewport without a portal. Opt into one with `portal` (AmphorePortal,
 * which re-applies the theme scope — a bare FloatingPortal would render
 * unstyled). Panel is `<Card elevation={4} noPadding>`, not a hand-rolled
 * div.
 */
export const Modal: React.FC<IModalProps> = ({
	open,
	onClose,
	title,
	children,
	header,
	footer,
	size = "md",
	closeOnOverlayClick = true,
	closeOnEscape = true,
	hideCloseButton = false,
	closeLabel: closeLabelProp,
	portal = false,
	className = "",
}) => {
	const titleId = useFloatingId();
	const { resolve } = useAmphoreLabels("Modal");
	const closeLabel = resolve("closeLabel", closeLabelProp, "close");

	const { refs, context } = useFloating({
		open,
		onOpenChange: (next) => {
			if (!next) onClose();
		},
	});

	const dismiss = useDismiss(context, {
		outsidePress: closeOnOverlayClick,
		escapeKey: closeOnEscape,
	});
	const role = useRole(context, { role: "dialog" });

	const { getFloatingProps } = useInteractions([dismiss, role]);

	if (!open) return null;

	const overlay = (
		<FloatingOverlay className={styles.overlay} lockScroll>
			<FloatingFocusManager context={context}>
				<Card
					ref={refs.setFloating}
					elevation={4}
					noPadding
					className={cn([styles.panel, className])}
					data-size={size}
					aria-labelledby={title ? titleId : undefined}
					{...getFloatingProps()}
				>
					{(title || !hideCloseButton || header) && (
						<div className={styles.header}>
							{title && (
								<h2 id={titleId} className={styles.title}>
									{title}
								</h2>
							)}
							{header && (
								<div className={styles.headerSlot}>
									{header}
								</div>
							)}
							{!hideCloseButton && (
								<button
									type="button"
									className={styles.close}
									onClick={onClose}
									aria-label={closeLabel}
								>
									<Picto icon="cross" />
								</button>
							)}
						</div>
					)}

					{/* Own scroll container: header/footer stay put, only this
					    scrolls when content exceeds the panel's max-height. */}
					<div className={styles.body}>{children}</div>

					{footer && <div className={styles.footer}>{footer}</div>}
				</Card>
			</FloatingFocusManager>
		</FloatingOverlay>
	);

	return portal ? <AmphorePortal>{overlay}</AmphorePortal> : overlay;
};
