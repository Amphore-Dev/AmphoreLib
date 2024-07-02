import React, { useEffect, PropsWithChildren, FC } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from "react-dom";

// Components
import { cn } from "@utils/cn";

import { faTimes } from "@fortawesome/free-solid-svg-icons";

export interface IModalProps extends PropsWithChildren {
	isDisplayed: boolean;
	onClose: () => void;
	closeOnClickOutside?: boolean;
	size?: "s" | "m" | "l" | "auto";
	title?: string;
	className?: string;
	overlayClassName?: string;
	zIndex?: number;
}

const modalSizes = {
	s: "w-[32rem]",
	m: "w-[50rem]",
	l: "w-[75rem]",
	auto: "auto",
};

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
}) => {
	const handleKeyPress = (e: any) => e.code === "Escape" && onClose();

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

	return isDisplayed
		? ReactDOM.createPortal(
				<>
					<div
						className={cn([
							"fixed left-0 top-0 flex h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-70 p-8",
							overlayClassName,
						])}
						onClick={closeOnClickOutside ? onClose : undefined}
						onKeyDown={handleKeyPress}
						role="button"
						tabIndex={-1}
						style={{ zIndex }}
					>
						<div
							className={
								"relative contents h-full w-auto max-w-full cursor-default"
							}
							onClick={(e) => {
								e.stopPropagation();
							}}
							role="button"
							onKeyDown={() => {}}
							tabIndex={-1}
						>
							<div
								style={{ zIndex: zIndex + 1 }}
								className={cn([
									"m-auto h-auto max-w-full rounded-3xl bg-white shadow-xl cursor-auto",
									modalSizes[size],
									className,
								])}
							>
								<div
									className={cn([
										"sticky -top-12 flex w-full justify-between gap-[1rem] rounded-t-3xl p-8 pb-4 bg-white",
									])}
									style={{
										zIndex: zIndex + 2,
									}}
								>
									{!!title?.length && (
										<h2
											className={
												"m-0 break-words p-0 text-2xl font-bold leading-5"
											}
										>
											{title}
										</h2>
									)}
									<button
										onClick={onClose}
										className={
											"ml-auto flex cursor-pointer items-center justify-center border-none bg-transparent outline-none"
										}
									>
										<FontAwesomeIcon
											icon={faTimes}
											className="text-grey-500 text-xl"
										/>
									</button>
								</div>
								<div className={"break-words p-8 pt-2"}>
									{children}
								</div>
							</div>
						</div>
					</div>
				</>,
				document.body
			)
		: null;
};
