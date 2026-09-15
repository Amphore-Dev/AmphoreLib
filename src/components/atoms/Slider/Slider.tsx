import React, { useId } from "react";

import { useAmphoreDefaults } from "@theme/useAmphoreDefaults";

import { cn } from "@utils/cn";

import { TColor, TSize } from "@interfaces/index";

import { InputErrorMessage } from "../InputErrorMessage/InputErrorMessage";

import styles from "./Slider.module.scss";

export interface ISliderProps extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"onChange" | "value" | "size" | "color" | "min" | "max" | "step"
> {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
	step?: number;
	label?: string;
	/** Shows the current value next to the label. Defaults to true. */
	showValue?: boolean;
	/** Shows a draggable thumb handle. Off by default, like v1 — a plain fill bar you can grab/click anywhere on. */
	showThumb?: boolean;
	/** Fill grows from the middle of the range instead of from `min` — e.g. a -50/+50 balance control. */
	centered?: boolean;
	error?: string;
	hideError?: boolean;
	size?: TSize;
	color?: TColor;
	disabled?: boolean;
	required?: boolean;
	className?: string;
	wrapperClassName?: string;
}

/**
 * V2 Slider — track/fill/thumb are plain absolutely-positioned divs, fully
 * under our own CSS (no vendor pseudo-element styling — cross-browser
 * support for that turned out too inconsistent, e.g. border-radius
 * silently not applying without extra appearance resets). A real
 * `<input type="range">` sits on top, fully transparent — it's what
 * actually receives drag/keyboard/focus and is the only thing screen
 * readers see; the divs are purely visual, `aria-hidden`.
 */
export const Slider: React.FC<ISliderProps> = ({
	value,
	onChange,
	min = 0,
	max = 100,
	step = 1,
	label,
	showValue = true,
	showThumb = false,
	centered = false,
	error,
	hideError = false,
	size: sizeProp,
	color = "primary",
	disabled = false,
	required = false,
	className = "",
	wrapperClassName = "",
	...props
}) => {
	const { size: defaultSize } = useAmphoreDefaults();
	const size = sizeProp ?? defaultSize ?? "md";
	const generatedId = useId();
	const errorId = `${generatedId}-error`;

	const percent = max === min ? 0 : ((value - min) / (max - min)) * 100;
	const centerPercent =
		max === min ? 0 : (((min + max) / 2 - min) / (max - min)) * 100;
	const fillLeft = centered ? Math.min(percent, centerPercent) : 0;
	const fillWidth = centered ? Math.abs(percent - centerPercent) : percent;

	return (
		<div className={cn([styles.wrapper, wrapperClassName])}>
			{(label || showValue) && (
				<div className={styles.head}>
					{label && (
						<label className={styles.label} htmlFor={generatedId}>
							{label}
							{required && (
								<span className={styles.required}>*</span>
							)}
						</label>
					)}
					{showValue && <span className={styles.value}>{value}</span>}
				</div>
			)}

			<div
				className={cn([styles.field, className])}
				data-size={size}
				data-color={color}
				data-disabled={disabled || undefined}
			>
				<div className={styles.track} aria-hidden>
					<div
						className={styles.fill}
						style={{ left: `${fillLeft}%`, width: `${fillWidth}%` }}
					/>
					{showThumb && (
						<div
							className={styles.thumb}
							style={{ left: `${percent}%` }}
						/>
					)}
				</div>

				<input
					{...props}
					id={generatedId}
					type="range"
					min={min}
					max={max}
					step={step}
					value={value}
					disabled={disabled}
					aria-invalid={!!error}
					aria-describedby={error && !hideError ? errorId : undefined}
					onChange={(e) => onChange(Number(e.target.value))}
					className={styles.input}
				/>
			</div>

			{!hideError && (
				<InputErrorMessage id={errorId}>{error}</InputErrorMessage>
			)}
		</div>
	);
};
