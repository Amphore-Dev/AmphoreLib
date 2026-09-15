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

import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { cn } from "@utils/cn";

import { TLabel, TSize } from "@interfaces/index";

import { Card } from "../../atoms/Card/Card";
import { Picto } from "../../atoms/Picto/Picto";

import styles from "./Modal.module.scss";

export interface IModalProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	children?: React.ReactNode;
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
	className?: string;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TModalLabels = Pick<IModalProps, "closeLabel">;

/**
 * V2 Modal — dialog overlay on floating-ui's Dialog primitives
 * (FloatingOverlay + FloatingFocusManager for the focus trap). No portal —
 * FloatingOverlay is already `position:fixed`, and a portal breaks under
 * Storybook's docs-page embed (see memory/amphorelib-v2-conventions.md).
 * Panel is `<Card elevation={4} noPadding>`, not a hand-rolled div.
 */
export const Modal: React.FC<IModalProps> = ({
	open,
	onClose,
	title,
	children,
	footer,
	size = "md",
	closeOnOverlayClick = true,
	closeOnEscape = true,
	hideCloseButton = false,
	closeLabel: closeLabelProp,
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

	return (
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
					{(title || !hideCloseButton) && (
						<div className={styles.header}>
							{title && (
								<h2 id={titleId} className={styles.title}>
									{title}
								</h2>
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
};
