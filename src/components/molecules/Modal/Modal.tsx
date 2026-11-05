import React, { forwardRef } from "react";

import {
	FloatingFocusManager,
	FloatingOverlay,
	useDismiss,
	useFloating,
	useId as useFloatingId,
	useInteractions,
	useMergeRefs,
	useRole,
} from "@floating-ui/react";

import { AmphorePortal } from "@theme/AmphorePortal";
import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { deriveTestId } from "@utils/UTestId";
import { cn } from "@utils/cn";

import { ITestIdProps, TLabel, TSize } from "@interfaces/index";

import { Card } from "../../atoms/Card/Card";
import { Picto } from "../../atoms/Picto/Picto";

import styles from "./Modal.module.scss";

export interface IModalProps
	extends Omit<React.ComponentPropsWithoutRef<"div">, "title">, ITestIdProps {
	open: boolean;
	onClose: () => void;
	title?: React.ReactNode;
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
 *
 * Native props and `ref` go to the panel, the `role="dialog"` element.
 * Derived testids: `-overlay`, `-title`, `-close`, `-content`, `-footer`.
 */
const ModalBase: React.ForwardRefRenderFunction<HTMLDivElement, IModalProps> = (
	{
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
		...props
	},
	ref
) => {
	const titleId = useFloatingId();
	const { resolve } = useAmphoreLabels("Modal");
	const closeLabel = resolve("closeLabel", closeLabelProp, "close");

	const { refs, context } = useFloating({
		open,
		onOpenChange: (next) => {
			if (!next) onClose();
		},
	});

	// Outside press on `click`, not floating-ui's default `pointerdown`: on
	// touch, closing on pointerdown unmounts the overlay before the tap's
	// click fires, so that click lands on whatever sat under the overlay.
	const dismiss = useDismiss(context, {
		outsidePress: closeOnOverlayClick,
		outsidePressEvent: "click",
		escapeKey: closeOnEscape,
	});
	const role = useRole(context, { role: "dialog" });

	const { getFloatingProps } = useInteractions([dismiss, role]);
	const panelRef = useMergeRefs([refs.setFloating, ref]);
	const testId = props["data-testid"];

	if (!open) return null;

	const overlay = (
		<FloatingOverlay
			className={styles.overlay}
			lockScroll
			data-testid={deriveTestId(testId, "overlay")}
		>
			<FloatingFocusManager context={context}>
				<Card
					aria-labelledby={title ? titleId : undefined}
					{...getFloatingProps(props)}
					ref={panelRef}
					elevation={4}
					noPadding
					className={cn([styles.panel, className])}
					data-size={size}
				>
					{(title || !hideCloseButton || header) && (
						<div className={styles.header}>
							{title && (
								<h2
									id={titleId}
									className={styles.title}
									data-testid={deriveTestId(testId, "title")}
								>
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
									data-testid={deriveTestId(testId, "close")}
								>
									<Picto icon="cross" />
								</button>
							)}
						</div>
					)}

					{/* Own scroll container: header/footer stay put, only this
					    scrolls when content exceeds the panel's max-height. */}
					<div
						className={styles.body}
						data-testid={deriveTestId(testId, "content")}
					>
						{children}
					</div>

					{footer && (
						<div
							className={styles.footer}
							data-testid={deriveTestId(testId, "footer")}
						>
							{footer}
						</div>
					)}
				</Card>
			</FloatingFocusManager>
		</FloatingOverlay>
	);

	return portal ? <AmphorePortal>{overlay}</AmphorePortal> : overlay;
};

export const Modal = forwardRef(ModalBase);
Modal.displayName = "Modal";
