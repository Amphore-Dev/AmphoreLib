import React, { forwardRef, useEffect, useId, useRef } from "react";

import { useMergeRefs } from "@floating-ui/react";

import { useAmphoreDefaults } from "@theme/useAmphoreDefaults";

import { useDrag, useMediaQuery } from "@hooks/index";

import { deriveTestId } from "@utils/UTestId";
import { cn } from "@utils/cn";

import { ITestIdProps, TColor, TElementProps, TSize } from "@interfaces/index";

import { InputErrorMessage } from "../InputErrorMessage/InputErrorMessage";

import styles from "./TextArea.module.scss";

export interface ITextAreaProps
	extends
		Omit<
			React.ComponentPropsWithoutRef<"textarea">,
			"onChange" | "value" | "color"
		>,
		ITestIdProps {
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
	/** Lets the field be dragged taller/shorter. Defaults to true. Works together with `autoGrow` — a manual drag sets a floor autoGrow won't shrink below, but content can still grow past it. On a touch-first device (`pointer: coarse`) there's no handle: the field grows with its content instead (`autoGrow`, still capped by `maxRows`). */
	resizable?: boolean;
	/** Grows/shrinks the field height to fit its content instead of scrolling. Combines with manual resize rather than replacing it. */
	autoGrow?: boolean;
	/** Caps `autoGrow` at this many rows — grows normally up to it, then scrolls internally instead of growing further. No effect without `autoGrow`. */
	maxRows?: number;
	/** The field box, not the bare `<textarea>` — same convention as Input. */
	className?: string;
	wrapperClassName?: string;
	/** Native props of the outer container (label, field and error message). */
	wrapperProps?: TElementProps<"div">;
}

const MIN_HEIGHT_PX = 48;

const COARSE_POINTER = "(pointer: coarse)";

const TextAreaBase: React.ForwardRefRenderFunction<
	HTMLTextAreaElement,
	ITextAreaProps
> = (
	{
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
		wrapperProps,
		id,
		"aria-describedby": ariaDescribedBy,
		...props
	},
	ref
) => {
	const { size: defaultSize } = useAmphoreDefaults();
	const coarsePointer = useMediaQuery(COARSE_POINTER);
	const showHandle = resizable && !disabled && !coarsePointer;
	const grows = autoGrow || (resizable && coarsePointer);
	const size = sizeProp ?? defaultSize ?? "md";
	const generatedId = useId();
	const inputId = id ?? generatedId;
	const errorId = `${inputId}-error`;
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const mergedRef = useMergeRefs([textareaRef, ref]);
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
		if (!grows) return;
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
	}, [grows, maxRows, value]);

	const startHeightRef = useRef(0);
	const resize = useDrag({
		disabled: !showHandle,
		onStart: () => {
			startHeightRef.current = textareaRef.current?.offsetHeight ?? 0;
		},
		onMove: ({ dy }) => {
			const textarea = textareaRef.current;
			if (!textarea) return;
			const nextHeight = Math.max(
				MIN_HEIGHT_PX,
				startHeightRef.current + dy
			);
			textarea.style.height = `${nextHeight}px`;
			if (grows) manualHeightRef.current = nextHeight;
		},
	});

	return (
		<div
			{...wrapperProps}
			className={cn([
				styles.wrapper,
				wrapperClassName,
				wrapperProps?.className,
			])}
		>
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
					ref={mergedRef}
					id={inputId}
					rows={rows}
					maxLength={maxLength}
					className={styles.textarea}
					value={value}
					disabled={disabled}
					required={required}
					aria-invalid={!!error}
					aria-describedby={
						cn([ariaDescribedBy, error && !hideError && errorId]) ||
						undefined
					}
					onChange={handleChange}
				/>

				{showHandle && (
					<div
						className={styles.resizeHandle}
						{...resize.handleProps}
						data-testid={deriveTestId(
							props["data-testid"],
							"resize-handle"
						)}
						aria-hidden
					/>
				)}
			</div>

			<div className={styles.footer}>
				{!hideError && (
					<InputErrorMessage
						id={errorId}
						data-testid={deriveTestId(
							props["data-testid"],
							"error"
						)}
					>
						{error}
					</InputErrorMessage>
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
 *
 * Touch-first devices get no handle at all: a corner grip is a poor
 * finger target, mobile browsers never show a native one either, and
 * growing with the content does the same job without a gesture. A hybrid
 * device (fine primary pointer, touchscreen too) keeps the handle — it
 * goes through `useDrag`, so a finger drags it as well as a mouse.
 *
 * Native props and `ref` go to the `<textarea>`, `className` to the field
 * box, `wrapperProps` to the outer container. Derived testids:
 * `-resize-handle`, `-error`.
 */
export const TextArea = forwardRef(TextAreaBase);
TextArea.displayName = "TextArea";
