import React, { useState } from "react";

import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { TColor, TLabel, TSize } from "@interfaces/index";

import { Button } from "../../atoms/Button/Button";
import { Modal } from "../Modal/Modal";

import styles from "./ConfirmModal.module.scss";

export interface IConfirmModalProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void | Promise<void>;
	/** Defaults to `onClose`. */
	onCancel?: () => void;
	title?: string;
	children?: React.ReactNode;
	/** Defaults to "Cancel" (or `common.cancel`/`ConfirmModal.cancelText` from the nearest AmphoreProvider — see useAmphoreLabels). */
	cancelText?: TLabel;
	/** Defaults to "Confirm" (or `common.confirm`/`ConfirmModal.confirmText` from the nearest AmphoreProvider). */
	confirmText?: TLabel;
	/** Tints the confirm button — e.g. "danger" for a destructive action. */
	confirmColor?: TColor;
	size?: TSize;
	className?: string;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TConfirmModalLabels = Pick<
	IConfirmModalProps,
	"cancelText" | "confirmText"
>;

/**
 * V2 ConfirmModal — a Modal preset (fixed Cancel/Confirm footer, `onConfirm`
 * can be async, the confirm button shows a loading state while it settles).
 * v1's version accepted a fully custom `buttons` array (render props, string
 * sentinels for "confirm"/"cancel") — dropped: for anything beyond a plain
 * confirm/cancel pair, using `Modal` directly is simpler than fighting this
 * component's escape hatch. Doesn't auto-close on confirm (same as v1) —
 * the caller decides when to close, e.g. after its own side effect
 * succeeds.
 */
export const ConfirmModal: React.FC<IConfirmModalProps> = ({
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
	className = "",
}) => {
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
			open={open}
			onClose={onClose}
			title={title}
			size={size}
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
					>
						{cancelText}
					</Button>
					<Button
						color={confirmColor}
						onClick={handleConfirm}
						isLoading={isLoading}
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
