import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TodoList, TTodoItem } from "./TodoList";

const items: TTodoItem[] = [
	{ id: "a", text: "Première tâche" },
	{ id: "b", text: "Deuxième tâche" },
	{ id: "c", text: "Troisième tâche" },
];

// Three stacked 40px rows — jsdom never computes real layout, so the
// reorder algorithm (which measures sibling midpoints) needs rects stubbed.
const stubRects = (container: HTMLElement) => {
	const rows = container.querySelectorAll("li");
	rows.forEach((row, i) => {
		row.getBoundingClientRect = () =>
			({ top: i * 40, height: 40, bottom: i * 40 + 40 }) as DOMRect;
	});
};

describe("TodoList", () => {
	it("renders every item's text", () => {
		render(<TodoList items={items} onChange={() => {}} />);
		expect(screen.getByText("Première tâche")).toBeInTheDocument();
		expect(screen.getByText("Deuxième tâche")).toBeInTheDocument();
		expect(screen.getByText("Troisième tâche")).toBeInTheDocument();
	});

	it("calls onChange with the edited text in place", () => {
		const onChange = vi.fn();
		render(<TodoList items={items} onChange={onChange} />);
		fireEvent.click(screen.getByText("Deuxième tâche"));
		const editor = screen.getByDisplayValue("Deuxième tâche");
		fireEvent.change(editor, { target: { value: "Deuxième, modifiée" } });
		fireEvent.keyDown(editor, { key: "Enter" });
		expect(onChange).toHaveBeenCalledWith([
			{ id: "a", text: "Première tâche" },
			{ id: "b", text: "Deuxième, modifiée" },
			{ id: "c", text: "Troisième tâche" },
		]);
	});

	it("calls onChange without the removed item", () => {
		const onChange = vi.fn();
		render(<TodoList items={items} onChange={onChange} />);
		fireEvent.click(
			screen.getByRole("button", { name: "Remove: Première tâche" })
		);
		expect(onChange).toHaveBeenCalledWith([
			{ id: "b", text: "Deuxième tâche" },
			{ id: "c", text: "Troisième tâche" },
		]);
	});

	it("hides drag handles when reorderable is false", () => {
		render(
			<TodoList items={items} onChange={() => {}} reorderable={false} />
		);
		expect(
			screen.queryByRole("button", { name: /^Move/i })
		).not.toBeInTheDocument();
	});

	it("reorders past a sibling's midpoint while dragging", () => {
		const onChange = vi.fn();
		const { container } = render(
			<TodoList items={items} onChange={onChange} />
		);
		stubRects(container);

		const handles = screen.getAllByRole("button", { name: /^Move/i });
		fireEvent.pointerDown(handles[0], { clientY: 10 });
		// Between row 0's midpoint (20) and row 1's (60) -> drops at index 1.
		fireEvent(window, new PointerEvent("pointermove", { clientY: 40 }));

		expect(onChange).toHaveBeenCalledWith([
			{ id: "b", text: "Deuxième tâche" },
			{ id: "a", text: "Première tâche" },
			{ id: "c", text: "Troisième tâche" },
		]);
	});

	it("reorders by one with arrow keys, without a drag", () => {
		const onChange = vi.fn();
		render(<TodoList items={items} onChange={onChange} />);
		const handles = screen.getAllByRole("button", { name: /^Move/i });
		fireEvent.keyDown(handles[1], { key: "ArrowUp" });
		expect(onChange).toHaveBeenCalledWith([
			{ id: "b", text: "Deuxième tâche" },
			{ id: "a", text: "Première tâche" },
			{ id: "c", text: "Troisième tâche" },
		]);
	});
});
