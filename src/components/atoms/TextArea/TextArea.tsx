import React, { useEffect, useId, useRef } from "react";

import { useAmphoreDefaults } from "@theme/useAmphoreDefaults";

import { cn } from "@utils/cn";

import { TColor, TSize } from "@interfaces/index";

import { InputErrorMessage } from "../InputErrorMessage/InputErrorMessage";

import styles from "./TextArea.module.scss";

export interface ITextAreaProps extends Omit<
	React.TextareaHTMLAttributes<HTMLTextAreaElement>,
	"onChange" | "value" | "size" | "color"
> {
	/** Controlled value. Always `string` — pass `""`, never `null`/`undefined`, to stay controlled. */
	value?: string;
	onChange?: (
		value: string,
		e: React.ChangeEvent<HTMLTextAreaElement>
	) => void;
	label?: string;
	error?: string;
	hideError?: boolean;
	size?: TSize;
	color?: TColor;
	/** Number of visible text rows. Defaults to 3. */
	rows?: number;
	/** Shows a live "x / maxLength" counter under the field. */
	showCharCounter?: boolean;
	/** Lets the field be dragged taller/shorter. Defaults to true. Works together with `autoGrow` — a manual drag sets a floor autoGrow won't shrink below, but content can still grow past it. */
	resizable?: boolean;
	/** Grows/shrinks the field height to fit its content instead of scrolling. Combines with manual resize rather than replacing it. */
	autoGrow?: boolean;
	/** Caps `autoGrow` at this many rows — grows normally up to it, then scrolls internally instead of growing further. No effect without `autoGrow`. */
	maxRows?: number;
	className?: string;
	wrapperClassName?: string;
}

const MIN_HEIGHT_PX = 48;

/**
 * V2 TextArea — fully controlled (value/onChange only), no ambient
 * form-library awareness, same rule as every other field (see
 * memory/react-library-fields-audit.md). Shares Input's field box/text
 * styles via src/styles/_field.scss.
 *
 * Resize handle is custom-drawn (pointer events), not the native
 * `resize: vertical` corner: styling that UA-drawn affordance
 * (`::-webkit-resizer`) turned out to not tolerate either `transform` or
 * `width`/`height` without going invisible in Chrome/Safari, and Firefox
 * exposes no equivalent hook at all. A hand-rolled handle sizes and themes
 * consistently everywhere instead.
 */
export const TextArea: React.FC<ITextAreaProps> = ({
	value = "",
	onChange,
	label,
	error,
	hideError = false,
	size: sizeProp,
	color = "primary",
	rows = 3,
	showCharCounter = false,
	resizable = true,
	autoGrow = false,
	maxRows,
	disabled = false,
	required = false,
	maxLength,
	className = "",
	wrapperClassName = "",
	id,
	...props
}) => {
	const { size: defaultSize } = useAmphoreDefaults();
	const size = sizeProp ?? defaultSize ?? "md";
	const generatedId = useId();
	const inputId = id ?? generatedId;
	const errorId = `${inputId}-error`;
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	// Set once the user drags the handle. From then on, autoGrow treats it as
	// a floor — it won't shrink the field back below a height the user chose
	// themselves, but content can still grow past it. Persists across value
	// changes on purpose: a manual resize is a standing preference, not a
	// one-off override the next keystroke should silently discard.
	const manualHeightRef = useRef<number | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onChange?.(e.target.value, e);
	};

	// "height: auto" first forces the browser to recompute scrollHeight from
	// the *current* content rather than the previous fixed height (which
	// would otherwise never shrink back down as text is removed).
	//
	// maxRows caps the grown height via getComputedStyle — line-height and
	// padding come from --amp-space-*/font tokens, themeable per
	// AmphoreProvider, so a hardcoded pixel constant here would silently
	// drift from whatever a consumer's theme actually renders.
	useEffect(() => {
		if (!autoGrow) return;
		const textarea = textareaRef.current;
		if (!textarea) return;

		textarea.style.height = "auto";
		const scrollHeight = textarea.scrollHeight;

		let cap = Infinity;
		if (maxRows) {
			const cs = getComputedStyle(textarea);
			const lineHeight = parseFloat(cs.lineHeight) || 0;
			const paddingY =
				parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
			const borderY =
				parseFloat(cs.borderTopWidth) +
				parseFloat(cs.borderBottomWidth);
			cap = maxRows * lineHeight + paddingY + borderY;
		}

		const contentHeight = Math.min(scrollHeight, cap);
		const nextHeight = Math.max(
			contentHeight,
			manualHeightRef.current ?? 0
		);
		textarea.style.height = `${nextHeight}px`;

		// Only touch overflow when maxRows actually creates something to
		// scroll — forcing "hidden" unconditionally here (regardless of
		// maxRows) was the bug: it clipped content with no way to reach it
		// the moment the field was smaller than what it held, including
		// right after a manual drag shrank it below scrollHeight.
		if (maxRows) {
			textarea.style.overflowY = scrollHeight > cap ? "auto" : "hidden";
		}
	}, [autoGrow, maxRows, value]);

	const handleResizeStart = (e: React.PointerEvent) => {
		const textarea = textareaRef.current;
		if (!textarea || disabled) return;

		e.preventDefault();
		const startY = e.clientY;
		const startHeight = textarea.offsetHeight;

		const handlePointerMove = (moveEvent: PointerEvent) => {
			const nextHeight = Math.max(
				MIN_HEIGHT_PX,
				startHeight + (moveEvent.clientY - startY)
			);
			textarea.style.height = `${nextHeight}px`;
			if (autoGrow) manualHeightRef.current = nextHeight;
		};

		const handlePointerUp = () => {
			document.removeEventListener("pointermove", handlePointerMove);
			document.removeEventListener("pointerup", handlePointerUp);
		};

		document.addEventListener("pointermove", handlePointerMove);
		document.addEventListener("pointerup", handlePointerUp);
	};

	return (
		<div className={cn([styles.wrapper, wrapperClassName])}>
			{label && (
				<label className={styles.label} htmlFor={inputId}>
					{label}
					{required && <span className={styles.required}>*</span>}
				</label>
			)}

			<div
				className={cn([styles.field, className])}
				data-size={size}
				data-color={color}
				data-disabled={disabled || undefined}
				data-invalid={!!error || undefined}
			>
				<textarea
					{...props}
					ref={textareaRef}
					id={inputId}
					rows={rows}
					maxLength={maxLength}
					className={styles.textarea}
					value={value}
					disabled={disabled}
					required={required}
					aria-invalid={!!error}
					aria-describedby={error && !hideError ? errorId : undefined}
					onChange={handleChange}
				/>

				{resizable && !disabled && (
					<div
						className={styles.resizeHandle}
						onPointerDown={handleResizeStart}
						data-testid="textarea-resize-handle"
						aria-hidden
					/>
				)}
			</div>

			<div className={styles.footer}>
				{!hideError && (
					<InputErrorMessage id={errorId}>{error}</InputErrorMessage>
				)}
				{showCharCounter && maxLength && (
					<span className={styles.counter}>
						{value.length} / {maxLength}
					</span>
				)}
			</div>
		</div>
	);
};
