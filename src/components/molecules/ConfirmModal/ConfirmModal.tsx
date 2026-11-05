import React, { forwardRef, useState } from "react";

import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { deriveTestId } from "@utils/UTestId";

import { ITestIdProps, TColor, TLabel, TSize } from "@interfaces/index";

import { Button } from "../../atoms/Button/Button";
import { Modal } from "../Modal/Modal";

import styles from "./ConfirmModal.module.scss";

export interface IConfirmModalProps
	extends Omit<React.ComponentPropsWithoutRef<"div">, "title">, ITestIdProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void | Promise<void>;
	/** Defaults to `onClose`. */
	onCancel?: () => void;
	title?: string;
	/** Defaults to "Cancel" (or `common.cancel`/`ConfirmModal.cancelText` from the nearest AmphoreProvider — see useAmphoreLabels). */
	cancelText?: TLabel;
	/** Defaults to "Confirm" (or `common.confirm`/`ConfirmModal.confirmText` from the nearest AmphoreProvider). */
	confirmText?: TLabel;
	/** Tints the confirm button — e.g. "danger" for a destructive action. */
	confirmColor?: TColor;
	size?: TSize;
	/** Forwarded to Modal — renders into `document.body` via AmphorePortal. Defaults to false. */
	portal?: boolean;
	className?: string;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TConfirmModalLabels = Pick<
	IConfirmModalProps,
	"cancelText" | "confirmText"
>;

const ConfirmModalBase: React.ForwardRefRenderFunction<
	HTMLDivElement,
	IConfirmModalProps
> = (
	{
		open,
		onClose,
		onConfirm,
		onCancel,
		title,
		children,
		cancelText: cancelTextProp,
		confirmText: confirmTextProp,
		confirmColor = "primary",
		size = "sm",
		portal = false,
		className = "",
		...props
	},
	ref
) => {
	const [isLoading, setIsLoading] = useState(false);
	const { resolve } = useAmphoreLabels("ConfirmModal");
	const cancelText = resolve("cancelText", cancelTextProp, "cancel");
	const confirmText = resolve("confirmText", confirmTextProp, "confirm");

	const handleConfirm = async () => {
		setIsLoading(true);
		// Swallowed, not rethrown: React's onClick never awaits this handler,
		// so an uncaught rejection here would surface as an unhandled promise
		// rejection with no way for a consumer to attach their own handling
		// anyway (the promise itself isn't exposed anywhere). A failing
		// onConfirm should report its own error (toast, etc.) — this only
		// tracks whether the button should show a loading state.
		try {
			await onConfirm();
		} catch {
			// see above
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal
			{...props}
			ref={ref}
			open={open}
			onClose={onClose}
			title={title}
			size={size}
			portal={portal}
			className={className}
			// While confirming, closing any other way (overlay click, Escape,
			// the header ×) would abandon an in-flight action with no way for
			// the caller to know — only the explicit Cancel button (itself
			// disabled while loading) can dismiss it.
			closeOnOverlayClick={!isLoading}
			closeOnEscape={!isLoading}
			hideCloseButton={isLoading}
			footer={
				<div className={styles.actions}>
					<Button
						variant="outline"
						onClick={onCancel ?? onClose}
						disabled={isLoading}
						data-testid={deriveTestId(
							props["data-testid"],
							"secondary"
						)}
					>
						{cancelText}
					</Button>
					<Button
						color={confirmColor}
						onClick={handleConfirm}
						isLoading={isLoading}
						data-testid={deriveTestId(
							props["data-testid"],
							"primary"
						)}
					>
						{confirmText}
					</Button>
				</div>
			}
		>
			{children}
		</Modal>
	);
};

/**
 * V2 ConfirmModal — a Modal preset (fixed Cancel/Confirm footer, `onConfirm`
 * can be async, the confirm button shows a loading state while it settles).
 * v1's version accepted a fully custom `buttons` array (render props, string
 * sentinels for "confirm"/"cancel") — dropped: for anything beyond a plain
 * confirm/cancel pair, using `Modal` directly is simpler than fighting this
 * component's escape hatch. Doesn't auto-close on confirm (same as v1) —
 * the caller decides when to close, e.g. after its own side effect
 * succeeds.
 *
 * Native props and `ref` go to Modal's dialog panel. Derived testids: Modal's
 * own, plus `-primary` (confirm) and `-secondary` (cancel).
 */
export const ConfirmModal = forwardRef(ConfirmModalBase);
ConfirmModal.displayName = "ConfirmModal";
