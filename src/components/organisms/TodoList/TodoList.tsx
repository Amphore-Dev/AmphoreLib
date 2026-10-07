import React, { useRef, useState } from "react";

import { useAmphoreDefaults } from "@theme/useAmphoreDefaults";
import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { useAutoScroll, useDrag } from "@hooks/index";

import { cn } from "@utils/cn";

import { TLabel, TSize } from "@interfaces/index";

import { TodoItem } from "../../molecules/TodoItem/TodoItem";

import styles from "./TodoList.module.scss";

export interface TTodoItem {
	id: string;
	text: string;
	/** Same generic leading slot as `TodoItem.before` — a badge, an icon... */
	before?: React.ReactNode;
}

export interface ITodoListProps {
	/** Controlled — every mutation (edit, remove, reorder) calls `onChange` with the next full array, this component holds no list state of its own. */
	items: TTodoItem[];
	onChange: (items: TTodoItem[]) => void;
	/** Forwarded to every row. Defaults to true. */
	editable?: boolean;
	/** Forwarded to every row. Defaults to true. */
	removable?: boolean;
	/** Forwarded to every row — see `TodoItem.multiline`. Defaults to true. */
	multiline?: boolean;
	/** Shows drag handles and wires pointer + arrow-key reordering. Defaults to true. */
	reorderable?: boolean;
	/** aria-label for each row's drag handle. Defaults to "Move (up/down arrows)" (or `TodoList.moveLabel` from the nearest AmphoreProvider — see useAmphoreLabels). No effect without `reorderable`. */
	moveLabel?: TLabel;
	size?: TSize;
	className?: string;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TTodoListLabels = Pick<ITodoListProps, "moveLabel">;

/**
 * V2 TodoList — a controlled, reorderable list of `TodoItem` rows. Reorder
 * is custom pointer-based (no DnD dependency, `useDrag` like every other
 * drag in this lib): a `pointerdown` on a handle starts tracking, `move`
 * measures sibling midpoints to find the drop index and splices `items`
 * immediately (once per index crossed, same as the original prototype this
 * was ported from) — not just on drop. Near the edge of the scroll
 * container (or the screen), `useAutoScroll` scrolls so a long list can be
 * reordered past what's visible — on a phone, the finger on the handle
 * can't scroll it any other way. Arrow-up/down on the handle reorders by
 * one without needing a drag at all.
 */
export const TodoList: React.FC<ITodoListProps> = ({
	items,
	onChange,
	editable = true,
	removable = true,
	multiline = false,
	reorderable = true,
	moveLabel: moveLabelProp,
	size: sizeProp,
	className = "",
}) => {
	const { size: defaultSize } = useAmphoreDefaults();
	const size = sizeProp ?? defaultSize ?? "md";
	const { resolve } = useAmphoreLabels("TodoList");
	const moveLabel = resolve("moveLabel", moveLabelProp);

	const listRef = useRef<HTMLUListElement>(null);
	const itemsRef = useRef(items);
	itemsRef.current = items;
	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;

	const [dragIndex, setDragIndex] = useState<number | null>(null);
	const dragIndexRef = useRef<number | null>(null);

	const move = (from: number, to: number) => {
		const current = itemsRef.current;
		if (to < 0 || to >= current.length || from === to) return;
		const next = [...current];
		const [moved] = next.splice(from, 1);
		next.splice(to, 0, moved);
		onChangeRef.current(next);
	};

	// Last pointer Y, so an auto-scroll step can re-hit-test against rows
	// that just moved under a finger that didn't.
	const pointerYRef = useRef(0);

	const retarget = () => {
		const list = listRef.current;
		const current = dragIndexRef.current;
		if (!list || current === null) return;
		const rows = Array.from(list.children) as HTMLElement[];
		const y = pointerYRef.current;
		let target = rows.length - 1;
		for (let i = 0; i < rows.length; i++) {
			const rect = rows[i].getBoundingClientRect();
			if (y < rect.top + rect.height / 2) {
				target = i;
				break;
			}
		}
		if (target !== current) {
			move(current, target);
			dragIndexRef.current = target;
			setDragIndex(target);
		}
	};

	const autoScroll = useAutoScroll(listRef, { onScroll: retarget });

	const endDrag = () => {
		autoScroll.stop();
		dragIndexRef.current = null;
		setDragIndex(null);
	};

	const drag = useDrag({
		onStart: ({ pointerType }) => {
			setDragIndex(dragIndexRef.current);
			// A short tick confirming the row was picked up — Android only,
			// iOS Safari has no Vibration API (the call is just skipped).
			if (pointerType === "touch") navigator.vibrate?.(10);
		},
		onMove: ({ y }) => {
			pointerYRef.current = y;
			retarget();
			autoScroll.update(y);
		},
		onEnd: endDrag,
	});

	const handleTextChange = (index: number, text: string) => {
		const next = [...items];
		next[index] = { ...next[index], text };
		onChange(next);
	};

	const handleRemove = (index: number) => {
		onChange(items.filter((_, i) => i !== index));
	};

	return (
		<ul ref={listRef} className={cn([styles.list, className])}>
			{items.map((item, index) => (
				<TodoItem
					key={item.id}
					text={item.text}
					before={item.before}
					editable={editable}
					removable={removable}
					multiline={multiline}
					size={size}
					dragging={dragIndex === index}
					onTextChange={(text) => handleTextChange(index, text)}
					onRemove={() => handleRemove(index)}
					dragHandleProps={
						reorderable
							? {
									"aria-label": moveLabel,
									onPointerDown: (e) => {
										dragIndexRef.current = index;
										drag.handleProps.onPointerDown(e);
									},
									onKeyDown: (e) => {
										if (e.key === "ArrowUp") {
											e.preventDefault();
											move(index, index - 1);
										} else if (e.key === "ArrowDown") {
											e.preventDefault();
											move(index, index + 1);
										}
									},
								}
							: undefined
					}
				/>
			))}
		</ul>
	);
};
