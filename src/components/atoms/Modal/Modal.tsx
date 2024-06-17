import React, { useState, useEffect, PropsWithChildren, FC } from "react";
import ReactDOM from "react-dom";

// Components

import { cn } from "@utils/cn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export interface IModalProps extends PropsWithChildren {
	isDisplayed: boolean;
	onClose: () => void;
	closeOnClickOutside?: boolean;
	size?: "s" | "m" | "l" | "auto";
	title?: string;
	className?: string;
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
	children,
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
						className={
							"fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-10 flex items-center justify-center overflow-y-auto overflow-x-hidden p-8"
						}
						onClick={closeOnClickOutside ? onClose : undefined}
						onKeyPress={handleKeyPress}
						role="button"
						tabIndex={-1}
					>
						<div
							className={
								" h-full max-w-full relative w-auto contents cursor-default"
							}
							onClick={(e) => {
								e.stopPropagation();
							}}
						>
							<div
								className={cn([
									"bg-white z-[11] rounded-3xl shadow-xl h-auto max-w-full m-auto",
									modalSizes[size],
									className,
								])}
							>
								<div
									className={cn([
										"z-[12] sticky -top-12 p-8 pb-4 flex gap-[1rem] justify-between w-full rounded-t-3xl",
									])}
								>
									{!!title?.length && (
										<h2
											className={
												"p-0 m-0 leading-5 text-2xl font-bold break-words"
											}
										>
											{title}
										</h2>
									)}
									<button
										onClick={onClose}
										className={
											"flex justify-center items-center bg-transparent border-none cursor-pointer outline-none ml-auto"
										}
									>
										<FontAwesomeIcon
											icon={faTimes}
											className="text-xl text-grey-500"
										/>
									</button>
								</div>
								<div className={"p-8 pt-2 break-words"}>
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
