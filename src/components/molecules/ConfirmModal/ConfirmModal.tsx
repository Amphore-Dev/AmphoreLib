import React, { Fragment } from "react";

import { Button, IModalProps, Modal } from "../../atoms";

import { cn } from "@utils/cn";

import "./ConfirmModal.scss";

export interface IConfirmModalCallback {
	onConfirm: () => Promise<any> | any;
	onCancel?: () => void;
	onClose: () => void;
}

export interface IConfirmModalProps extends IConfirmModalCallback, IModalProps {
	text?: string;
	cancelText?: string;
	confirmText?: string;
	children?: React.ReactNode;
	buttons?: (
		| React.ReactNode
		| ((props: IConfirmModalCallback) => React.ReactNode)
		| "confirm"
		| "cancel"
	)[];
}

export const ConfirmModal: React.FC<IConfirmModalProps> = (
	props: IConfirmModalProps
) => {
	const { isDisplayed, onConfirm, onClose, onCancel } = props;
	const [isLoading, setIsLoading] = React.useState(false);

	const handleConfirm = () => {
		let res = onConfirm();
		setIsLoading(true);
		if (!res?.then) {
			res = new Promise((resolve) => resolve(res));
		}
		res.then(
			() => {
				setIsLoading(false);
			},
			() => {
				setIsLoading(false);
			}
		);
	};

	const cancelButton = () => (
		<Button
			color="primary"
			outline
			className="cancelButton !text-primary-500 dark:!text-primary-300"
			onClick={onCancel ?? onClose}
			disabled={isLoading}
		>
			{props.cancelText ?? "global.cancel"}
		</Button>
	);

	const confirmButton = () => (
		<Button color="primary" onClick={handleConfirm} isLoading={isLoading}>
			{props.confirmText ?? "global.confirm"}
		</Button>
	);
	return (
		<Modal
			size={props.size ?? "s"}
			className={cn(["ConfirmModal al__confirm-modal", props.className])}
			title={props.title}
			{...props}
			onClose={onClose}
		>
			<div className="al__confirm-modal__content">
				<div className="al__confirm-modal__text">
					{props.children ?? props.text}
				</div>
				<div className="al__confirm-modal__actions">
					{props.buttons?.length ? (
						props.buttons.map((button, key) => {
							return (
								<Fragment key={key}>
									{(button === "confirm" &&
										confirmButton()) ||
										(button === "cancel" &&
											cancelButton()) ||
										(typeof button === "function"
											? button({
													onConfirm: handleConfirm,
													onCancel: onCancel,
													onClose: onClose,
												})
											: button)}
								</Fragment>
							);
						})
					) : (
						<>
							{cancelButton()}
							{confirmButton()}
						</>
					)}
				</div>
			</div>
		</Modal>
	);
};
