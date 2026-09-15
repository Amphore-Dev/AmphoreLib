import React, { useEffect, useRef, useState } from "react";

import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { cn } from "@utils/cn";

import { TLabel, TSize } from "@interfaces/index";

import { Input } from "../../atoms/Input/Input";
import { Picto } from "../../atoms/Picto/Picto";
import { TextArea } from "../../atoms/TextArea/TextArea";

import styles from "./TodoItem.module.scss";

export interface ITodoItemProps {
	text: string;
	/** Slot rendered before the text — a badge, an icon, an avatar. Generic on purpose: a domain-specific concern (e.g. a parsed ticket id) belongs in the consumer building this node, not in this component. */
	before?: React.ReactNode;
	onTextChange?: (text: string) => void;
	onRemove?: () => void;
	/** Click-to-edit the text inline. Defaults to true. */
	editable?: boolean;
	/** Shows the remove (×) button. Defaults to true. */
	removable?: boolean;
	/** Lets the text wrap over several lines, and edit in an auto-growing `TextArea` (Shift+Enter for a newline). `false` keeps the row to one line — the text is clipped with an ellipsis and edited in a plain `Input`. Defaults to true. */
	multiline?: boolean;
	/** Renders the drag handle when passed, spread onto its `<button>` — TodoList wires the actual pointer/keyboard behavior; omit to render without one (a non-reorderable list, or a single item used standalone). */
	dragHandleProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
	/** Visual state while this row is being dragged — set by TodoList, not read from here. */
	dragging?: boolean;
	/** Prefix for the remove button's aria-label, rendered as `${removeLabel}: ${text}`. Defaults to "Remove" (or `common.remove`/`TodoItem.removeLabel` from the nearest AmphoreProvider — see useAmphoreLabels). No effect without `removable`. */
	removeLabel?: TLabel;
	size?: TSize;
	className?: string;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TTodoItemLabels = Pick<ITodoItemProps, "removeLabel">;

/**
 * V2 TodoItem — one row: optional drag handle, an optional leading slot,
 * click-to-edit text (a `TextArea` with `autoGrow`, swapped in on click),
 * and an optional remove button. Reorder mechanics live in TodoList (it
 * needs to measure siblings) — this component only renders the handle
 * `dragHandleProps` is spread onto and reports its own text edits/removal.
 */
export const TodoItem: React.FC<ITodoItemProps> = ({
	text,
	before,
	onTextChange,
	onRemove,
	editable = true,
	removable = true,
	multiline = false,
	dragHandleProps,
	dragging = false,
	removeLabel: removeLabelProp,
	size = "md",
	className = "",
}) => {
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(text);
	const editorRef = useRef<HTMLDivElement>(null);
	const { resolve } = useAmphoreLabels("TodoItem");
	const removeLabel = resolve("removeLabel", removeLabelProp, "remove");

	// Neither TextArea nor Input is a `forwardRef` component, so the only
	// way to reach the real field is through its wrapper — same reasoning
	// as Select's own `useEffect`-driven focus (see its comment): the user
	// just clicked to edit, moving focus into the field they're about to
	// type into is expected, not disorienting, jsx-a11y/no-autofocus
	// notwithstanding.
	useEffect(() => {
		if (!editing) return;
		const field = editorRef.current?.querySelector<
			HTMLTextAreaElement | HTMLInputElement
		>("textarea, input");
		field?.focus();
		field?.setSelectionRange(field.value.length, field.value.length);
	}, [editing]);

	const startEdit = () => {
		if (!editable) return;
		setDraft(text);
		setEditing(true);
	};

	const commit = () => {
		setEditing(false);
		const next = draft.trim();
		if (next && next !== text) onTextChange?.(next);
	};

	const cancel = () => setEditing(false);

	// Shared by both editors — Enter commits (Shift+Enter is left to the
	// TextArea for a newline; a plain Input has no newline to insert anyway).
	const handleEditorKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			commit();
		} else if (e.key === "Escape") {
			e.preventDefault();
			cancel();
		}
	};

	return (
		<li
			className={cn([styles.row, className])}
			data-size={size}
			data-dragging={dragging || undefined}
			data-multiline={multiline}
		>
			{dragHandleProps && (
				<button
					type="button"
					className={styles.handle}
					{...dragHandleProps}
				>
					<Picto icon="gripVertical" className={styles.handleIcon} />
				</button>
			)}

			{before && <span className={styles.before}>{before}</span>}

			{editing ? (
				<div ref={editorRef} className={styles.editorWrapper}>
					{multiline ? (
						<TextArea
							value={draft}
							onChange={setDraft}
							autoGrow
							rows={1}
							resizable={false}
							hideError
							className={styles.editor}
							onBlur={commit}
							onKeyDown={handleEditorKeyDown}
						/>
					) : (
						<Input
							value={draft}
							onChange={setDraft}
							hideError
							className={styles.editor}
							onBlur={commit}
							onKeyDown={handleEditorKeyDown}
						/>
					)}
				</div>
			) : editable ? (
				<button
					type="button"
					className={styles.text}
					onClick={startEdit}
				>
					{text}
				</button>
			) : (
				<span className={styles.text}>{text}</span>
			)}

			{removable && !editing && (
				<button
					type="button"
					className={styles.remove}
					onClick={onRemove}
					aria-label={`${removeLabel}: ${text}`}
				>
					<Picto icon="cross" className={styles.removeIcon} />
				</button>
			)}
		</li>
	);
};
