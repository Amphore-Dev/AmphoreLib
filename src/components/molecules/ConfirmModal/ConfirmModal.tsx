import React, { Fragment } from "react";

// import { t } from "i18next";

import { cn } from "@utils/index";

import { Button, IModalProps, Modal } from "@components/atoms";

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
			isDisplayed={isDisplayed}
			onClose={onClose}
			size={props.size ?? "s"}
			className={cn([
				"ConfirmModal !min-w-[90%] sm:!min-w-[70%] md:!min-w-0",
				"dark:[&>div:first-child]:bg-neutral-800 dark:[&>div:first-child]:text-white dark:bg-neutral-800 dark:text-white",
				props.className,
			])}
			title={props.title}
		>
			<div className="flex flex-col text-left gap-m">
				<div className="mb-5">{props.children ?? props.text}</div>
				<div className="flex flex-wrap-reverse justify-end gap-4 [&>*]:w-full sm:[&>*]:w-auto">
					{!!props.buttons?.length ? (
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
