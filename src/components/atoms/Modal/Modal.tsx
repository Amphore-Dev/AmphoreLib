import React, {
	useEffect,
	PropsWithChildren,
	FC,
	useMemo,
	useLayoutEffect,
} from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactDOM from "react-dom";

import { Picto } from "../Picto/Picto";

// Components
import { cn } from "@utils/cn";

import "./Modal.scss";

export type TModalTitle = string | ((props: IModalHeaderProps) => JSX.Element);

export interface IModalHeaderProps {
	title: TModalTitle;
	onClose: () => void;
}

export interface IModalProps extends PropsWithChildren {
	isDisplayed: boolean;
	onClose: () => void;
	closeOnClickOutside?: boolean;
	size?: "s" | "m" | "l" | "auto";
	title?: TModalTitle;
	header?: (props: IModalHeaderProps) => JSX.Element;
	className?: string;
	overlayClassName?: string;
	zIndex?: number;
	portal?: boolean;
}

export const Modal: FC<IModalProps> = ({
	isDisplayed,
	onClose,
	closeOnClickOutside = true,
	size = "m",
	title = "",
	className = "",
	overlayClassName = "",
	children,
	zIndex = 10,
	header,
	portal = true,
}) => {
	const overlayRef = React.useRef<HTMLDivElement>(null);
	const modalHeaderRef = React.useRef<HTMLDivElement>(null);

	gsap.registerPlugin(ScrollTrigger);

	const handleKeyPress = (e: React.KeyboardEvent) =>
		e.code === "Escape" && onClose();

	useEffect(() => {
		if (isDisplayed) {
			document.body.style.position = "fixed";
			document.body.style.top = `-${window.scrollY}px`;
			document.body.style.right = "0";
			document.body.style.left = "0";
			document.body.style.maxHeight = "100vh";
		} else {
			const scrollY = document.body.style.top;
			document.body.style.position = "";
			document.body.style.top = "";
			window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
		}

		return () => {
			const scrollY = document.body.style.top;
			document.body.style.position = "";
			document.body.style.top = "";
			window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
		};
	}, [isDisplayed]);

	const ModalTitle = useMemo(() => {
		if (typeof title === "string") {
			return <h2 className="modal-title">{title}</h2>;
		}

		return title({ title, onClose });
	}, [title]);

	useLayoutEffect(() => {
		if (!isDisplayed) return;
		setTimeout(() => {
			gsap.to(modalHeaderRef.current, {
				scrollTrigger: {
					trigger: modalHeaderRef.current,
					scroller: overlayRef.current,
					start: "top top",
					end: "+=100% top",
					onUpdate: ({ progress }) => {
						if (!modalHeaderRef.current) return;
						modalHeaderRef.current.style.boxShadow = `0 0 1rem rgba(0, 0, 0, ${0.3 * progress})`;
					},
				},
			});
		}, 100); // delay to wait for the modal to be fully rendered
	}, [isDisplayed]);

	const dom = (
		<>
			<div
				ref={overlayRef}
				className={cn([
					"modal-overlay",
					!closeOnClickOutside && "modal-overlay--no-click",
					overlayClassName,
				])}
				data-al-modal
				onClick={closeOnClickOutside ? onClose : undefined}
				onKeyDown={handleKeyPress}
				role="button"
				tabIndex={-1}
				style={{ zIndex }}
			>
				<div
					className={"modal-wrapper"}
					onClick={(e) => {
						e.stopPropagation();
					}}
					role="button"
					onKeyDown={() => {}}
					tabIndex={-1}
				>
					<div
						style={{ zIndex: zIndex + 1 }}
						className={cn(["modal-content", size, className])}
					>
						<div
							className={cn(["modal-header"])}
							style={{
								zIndex: zIndex + 2,
							}}
							ref={modalHeaderRef}
						>
							{!header ? (
								<>
									{ModalTitle}
									<button
										onClick={onClose}
										className={"modal-close-button"}
									>
										<Picto
											icon={"cross"}
											className="modal-close-icon"
										/>
									</button>
								</>
							) : (
								header?.({ title, onClose })
							)}
						</div>
						<div className={"modal-body"}>{children}</div>
					</div>
				</div>
			</div>
		</>
	);

	return isDisplayed
		? portal
			? ReactDOM.createPortal(dom, document.body)
			: dom
		: null;
};
