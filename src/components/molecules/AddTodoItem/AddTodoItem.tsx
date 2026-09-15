import React, { useState } from "react";

import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { cn } from "@utils/cn";

import { TLabel, TSize } from "@interfaces/index";

import { Button } from "../../atoms/Button/Button";
import { Input } from "../../atoms/Input/Input";
import { TextArea } from "../../atoms/TextArea/TextArea";

import styles from "./AddTodoItem.module.scss";

export interface IAddTodoItemProps {
	onAdd: (text: string) => void;
	/** Defaults to "Add…" (or `AddTodoItem.placeholder` from the nearest AmphoreProvider — see useAmphoreLabels). */
	placeholder?: TLabel;
	/** Defaults to "Add" (or `common.add`/`AddTodoItem.buttonLabel` from the nearest AmphoreProvider). */
	buttonLabel?: TLabel;
	/** Types into an auto-growing `TextArea` instead of an `Input` — Enter still submits, Shift+Enter inserts a newline. Pair with `TodoList.multiline` so the added rows can display what was typed. Defaults to false. */
	multiline?: boolean;
	size?: TSize;
	className?: string;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TAddTodoItemLabels = Pick<
	IAddTodoItemProps,
	"placeholder" | "buttonLabel"
>;

/**
 * V2 AddTodoItem — an input + button pair for appending to a `TodoList`
 * (or anything else keyed the same way). The typed draft is the one piece
 * of local, uncontrolled state in this whole family: it has no meaning to
 * a consumer until submitted, unlike `TodoList.items`, which is why it
 * isn't lifted the way every other field's value is. Enter submits without
 * losing focus (the input stays mounted, value just clears) — `Input`
 * isn't a `forwardRef` component, so there's no refocus-after-click path
 * for the button either.
 */
export const AddTodoItem: React.FC<IAddTodoItemProps> = ({
	onAdd,
	placeholder: placeholderProp,
	buttonLabel: buttonLabelProp,
	multiline = false,
	size,
	className = "",
}) => {
	const [draft, setDraft] = useState("");
	const { resolve } = useAmphoreLabels("AddTodoItem");
	const placeholder = resolve("placeholder", placeholderProp);
	const buttonLabel = resolve("buttonLabel", buttonLabelProp, "add");

	const submit = () => {
		const next = draft.trim();
		if (!next) return;
		onAdd(next);
		setDraft("");
	};

	// Shared by both fields — Enter submits; Shift+Enter is left to the
	// TextArea for a newline (a plain Input has none to insert anyway).
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			submit();
		}
	};

	return (
		<div className={cn([styles.row, className])}>
			{multiline ? (
				<TextArea
					value={draft}
					onChange={setDraft}
					placeholder={placeholder}
					size={size}
					autoGrow
					rows={1}
					resizable={false}
					wrapperClassName={styles.input}
					onKeyDown={handleKeyDown}
				/>
			) : (
				<Input
					value={draft}
					onChange={setDraft}
					placeholder={placeholder}
					size={size}
					wrapperClassName={styles.input}
					onKeyDown={handleKeyDown}
				/>
			)}
			<Button variant="outline" size={size} onClick={submit} picto="add">
				{buttonLabel}
			</Button>
		</div>
	);
};
