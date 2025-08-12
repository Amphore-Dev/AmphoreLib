import React, {
	forwardRef,
	InputHTMLAttributes,
	useId,
	useRef,
	useImperativeHandle,
} from "react";

import { cn } from "@utils/cn";

import "./Checkbox.scss";

export interface ICheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
	indeterminate?: boolean;
	label?: string | React.ReactNode;
	className?: string;
	labelClassName?: string;
	wrapperClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, ICheckboxProps>(
	(
		{
			label,
			indeterminate,
			className,
			labelClassName,
			wrapperClassName,
			...props
		},
		ref
	) => {
		const parentRef = useRef<HTMLDivElement>(null);
		const inputRef = useRef<HTMLInputElement>(null);
		const autoId = props.id ?? useId();

		// 👉 expose la ref du <input> vers l'extérieur
		useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

		const handleKeyDown = (
			event: React.KeyboardEvent<HTMLInputElement>
		) => {
			if (event.key === "Enter") {
				event.preventDefault();
				inputRef.current?.click();
			} else if (event.key === "Tab") {
				const container = parentRef.current?.parentElement;
				if (!container) return;

				const checkboxes = Array.from(
					container.querySelectorAll<HTMLInputElement>(
						"input[data-checkbox]:not(:disabled)"
					)
				);

				const currentIndex = checkboxes.indexOf(inputRef.current!);

				if (event.shiftKey) {
					if (currentIndex > 0) {
						event.preventDefault();
						checkboxes[currentIndex - 1]?.focus();
					}
				} else {
					if (currentIndex < checkboxes.length - 1) {
						event.preventDefault();
						checkboxes[currentIndex + 1]?.focus();
					}
				}
			}
		};

		const blurCapture = {
			onBlurCapture: () => {
				parentRef.current?.removeAttribute("data-mouse-down");
			},
			onMouseUpCapture: () => {
				parentRef.current?.setAttribute("data-mouse-down", "true");
			},
		};

		return (
			<div
				ref={parentRef}
				className={cn([
					"amphorelib__checkbox",
					props.disabled && "disabled",
					!!label && "withLabel",
					wrapperClassName,
				])}
				data-amphore-lib-checkbox
				{...blurCapture}
			>
				<input
					ref={inputRef}
					id={autoId}
					data-checkbox
					data-indeterminate={indeterminate}
					type="checkbox"
					onKeyDown={handleKeyDown}
					{...props}
					className={cn(["amphorelib__checkbox-input", className])}
					{...blurCapture}
				/>
				{label && (
					<label
						htmlFor={autoId}
						className={cn([
							"amphorelib__checkbox-label",
							labelClassName,
						])}
						{...blurCapture}
					>
						{label}
					</label>
				)}
			</div>
		);
	}
);

Checkbox.displayName = "Checkbox";
