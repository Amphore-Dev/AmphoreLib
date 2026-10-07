import React, { useId, useRef, useState } from "react";

import { useAmphoreDefaults } from "@theme/useAmphoreDefaults";
import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { cn } from "@utils/cn";

import { TColor, TLabel, TSize } from "@interfaces/index";

import { Badge } from "../../atoms/Badge/Badge";
import { InputErrorMessage } from "../../atoms/InputErrorMessage/InputErrorMessage";

import styles from "./ChipInput.module.scss";

export interface IChipInputProps {
	/** Controlled — the chips. Every add/remove calls `onChange` with the next full list. */
	value?: string[];
	onChange?: (value: string[]) => void;
	label?: string;
	placeholder?: string;
	error?: string;
	hideError?: boolean;
	size?: TSize;
	color?: TColor;
	disabled?: boolean;
	required?: boolean;
	id?: string;
	name?: string;
	/** Caps the number of chips: entries past it are not added. Shows a counter (see `showCounter`). */
	maxCount?: number;
	/** Shows a "count / maxCount" counter under the field. Defaults to true when `maxCount` is set. */
	showCounter?: boolean;
	/** What ends a chip while typing or in pasted text. Defaults to commas, semicolons and whitespace. */
	separators?: RegExp;
	/** Applied to every entry before it's checked and added — e.g. `(v) => v.toUpperCase()`. Entries are always trimmed first. */
	normalize?: (value: string) => string;
	/** Marks an entry valid or not. An invalid one is still added, shown in `danger` — unless `rejectInvalid`. */
	validate?: (value: string) => boolean;
	/** Invalid entries are not added: the text stays in the field to be corrected. */
	rejectInvalid?: boolean;
	/** Called with every entry `validate` refused. */
	onInvalidValue?: (value: string) => void;
	/** The same value can appear more than once (compared after `normalize`). Defaults to false. */
	allowDuplicates?: boolean;
	/** Turns the text left in the field into a chip when it loses focus. Defaults to true. */
	addOnBlur?: boolean;
	/** Prefix for each chip's remove button aria-label, rendered as `${removeLabel}: ${chip}`. Defaults to "Remove" (or `common.remove`/`ChipInput.removeLabel` from the nearest AmphoreProvider — see useAmphoreLabels). */
	removeLabel?: TLabel;
	/** Applied to the field box (chips + text), not the outer wrapper — same convention as Input/TextArea. */
	className?: string;
	wrapperClassName?: string;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TChipInputLabels = Pick<IChipInputProps, "removeLabel">;

const DEFAULT_SEPARATORS = /[,;\s]+/;

/**
 * V2 ChipInput — a list of short strings (emails, tags, ticket keys...)
 * typed into one field, each shown as a removable `Badge`. Fully
 * controlled (`value`/`onChange`, a `string[]`): only the text being typed
 * lives here. Ported from v1's ChipInput, minus its withFormikWrapper
 * (wire it from the outside, or through FieldRenderer's `chips` type) and
 * its resize handle (the field grows with its chips instead).
 *
 * A chip is committed by a separator (typed or in pasted text), Enter, or
 * leaving the field; Backspace on an empty field removes the last one.
 */
export const ChipInput: React.FC<IChipInputProps> = ({
	value = [],
	onChange,
	label,
	placeholder,
	error,
	hideError = false,
	size: sizeProp,
	color = "primary",
	disabled = false,
	required = false,
	id,
	name,
	maxCount,
	showCounter,
	separators = DEFAULT_SEPARATORS,
	normalize,
	validate,
	rejectInvalid = false,
	onInvalidValue,
	allowDuplicates = false,
	addOnBlur = true,
	removeLabel: removeLabelProp,
	className = "",
	wrapperClassName = "",
}) => {
	const { size: defaultSize } = useAmphoreDefaults();
	const size = sizeProp ?? defaultSize ?? "md";
	const { resolve } = useAmphoreLabels("ChipInput");
	const removeLabel = resolve("removeLabel", removeLabelProp, "remove");
	const generatedId = useId();
	const inputId = id ?? generatedId;
	const errorId = `${inputId}-error`;
	const counterId = `${inputId}-counter`;
	const inputRef = useRef<HTMLInputElement>(null);
	const [draft, setDraft] = useState("");

	const hasMax = typeof maxCount === "number";
	const isFull = hasMax && value.length >= maxCount;
	const displayCounter = showCounter ?? hasMax;

	const clean = (entry: string) => {
		const trimmed = entry.trim();
		return normalize ? normalize(trimmed) : trimmed;
	};

	const isValid = (chip: string) => !validate || validate(chip);

	/**
	 * Adds what it can of `entries`, in order. Returns the entries left
	 * out — invalid (with `rejectInvalid`) or past `maxCount` — so the
	 * caller can keep them in the field.
	 */
	const addEntries = (entries: string[]): string[] => {
		const next = [...value];
		const rejected: string[] = [];

		for (const entry of entries) {
			const chip = clean(entry);
			if (!chip) continue;
			if (!allowDuplicates && next.includes(chip)) continue;
			if (!isValid(chip)) {
				onInvalidValue?.(chip);
				if (rejectInvalid) {
					rejected.push(entry.trim());
					continue;
				}
			}
			if (hasMax && next.length >= maxCount) {
				// Full: kept in the field rather than silently dropped.
				rejected.push(entry.trim());
				continue;
			}
			next.push(chip);
		}

		if (next.length !== value.length) onChange?.(next);
		return rejected;
	};

	const commitDraft = () => {
		if (!draft.trim()) return;
		setDraft(addEntries([draft]).join(" "));
	};

	// What ends a chip: the separators, plus line breaks, which only ever
	// arrive pasted (a column copied from a sheet, one email per line). A
	// fresh copy without `g`: a global regex's lastIndex would make `test()`
	// alternate between true and false.
	const splitPattern = new RegExp(
		`(?:${separators.source})|[\\r\\n]+`,
		separators.flags.replace("g", "")
	);

	/** Everything before the last separator becomes chips; what follows it is still being typed. */
	const take = (raw: string) => {
		if (!splitPattern.test(raw)) {
			setDraft(raw);
			return;
		}
		const tokens = raw.split(splitPattern);
		const typing = tokens.pop() ?? "";
		const rejected = addEntries(tokens);
		setDraft([...rejected, typing].filter(Boolean).join(" "));
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		take(e.target.value);

	// A text input strips line breaks from whatever is pasted into it
	// (value sanitization), so "a⏎b⏎c" would land as "abc": a paste with a
	// separator or a line break in it is read from the clipboard instead,
	// inserted where the caret is.
	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		const text = e.clipboardData.getData("text");
		if (!splitPattern.test(text)) return;
		e.preventDefault();
		const { selectionStart, selectionEnd } = e.currentTarget;
		const start = selectionStart ?? draft.length;
		const end = selectionEnd ?? draft.length;
		take(draft.slice(0, start) + text + draft.slice(end));
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && draft.trim()) {
			// Only with something to commit: an empty field lets Enter
			// submit the surrounding form as usual.
			e.preventDefault();
			commitDraft();
		} else if (e.key === "Backspace" && !draft && value.length) {
			onChange?.(value.slice(0, -1));
		} else if (e.key === "Escape" && draft) {
			e.preventDefault();
			setDraft("");
		}
	};

	const handleRemove = (index: number) => {
		onChange?.(value.filter((_, i) => i !== index));
		inputRef.current?.focus();
	};

	const describedBy =
		[error && !hideError && errorId, displayCounter && counterId]
			.filter(Boolean)
			.join(" ") || undefined;

	return (
		<div className={cn([styles.wrapper, wrapperClassName])}>
			{label && (
				<label className={styles.label} htmlFor={inputId}>
					{label}
					{required && <span className={styles.required}>*</span>}
				</label>
			)}

			{/* Clicking anywhere in the box (between chips, after them) types
			    into the field — the box itself is not a control, so no role. */}
			{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- the input inside is the keyboard target */}
			<div
				className={cn([styles.field, className])}
				data-size={size}
				data-color={color}
				data-disabled={disabled || undefined}
				data-invalid={!!error || undefined}
				onClick={(e) => {
					if (e.target === e.currentTarget) inputRef.current?.focus();
				}}
			>
				{value.map((chip, index) => (
					<Badge
						key={`${chip}-${index}`}
						color={isValid(chip) ? color : "danger"}
						variant="tint"
						size="sm"
						aria-invalid={!isValid(chip) || undefined}
						onRemove={
							disabled ? undefined : () => handleRemove(index)
						}
						removeLabel={`${removeLabel}: ${chip}`}
					>
						{chip}
					</Badge>
				))}

				<input
					ref={inputRef}
					id={inputId}
					name={name}
					type="text"
					className={styles.input}
					value={draft}
					placeholder={value.length ? undefined : placeholder}
					disabled={disabled}
					required={required && !value.length}
					aria-invalid={!!error}
					aria-describedby={describedBy}
					onChange={handleChange}
					onPaste={handlePaste}
					onKeyDown={handleKeyDown}
					onBlur={() => addOnBlur && commitDraft()}
				/>
			</div>

			{(!hideError || displayCounter) && (
				<div className={styles.footer}>
					{!hideError && (
						<InputErrorMessage id={errorId}>
							{error}
						</InputErrorMessage>
					)}
					{displayCounter && (
						<span
							id={counterId}
							className={styles.counter}
							data-full={isFull || undefined}
							aria-live="polite"
						>
							{hasMax
								? `${value.length} / ${maxCount}`
								: value.length}
						</span>
					)}
				</div>
			)}
		</div>
	);
};
