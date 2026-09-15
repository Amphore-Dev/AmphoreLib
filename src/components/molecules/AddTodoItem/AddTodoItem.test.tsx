import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AddTodoItem } from "./AddTodoItem";

describe("AddTodoItem", () => {
	it("calls onAdd and clears the draft on Enter", () => {
		const onAdd = vi.fn();
		render(<AddTodoItem onAdd={onAdd} />);
		const input = screen.getByPlaceholderText("Add…");
		fireEvent.change(input, { target: { value: "Nouvelle tâche" } });
		fireEvent.keyDown(input, { key: "Enter" });
		expect(onAdd).toHaveBeenCalledWith("Nouvelle tâche");
		expect(input).toHaveValue("");
	});

	it("calls onAdd on button click", () => {
		const onAdd = vi.fn();
		render(<AddTodoItem onAdd={onAdd} buttonLabel="Add" />);
		const input = screen.getByPlaceholderText("Add…");
		fireEvent.change(input, { target: { value: "Via le bouton" } });
		fireEvent.click(screen.getByRole("button", { name: "Add" }));
		expect(onAdd).toHaveBeenCalledWith("Via le bouton");
	});

	it("types into a textarea when multiline — Enter submits, Shift+Enter does not", () => {
		const onAdd = vi.fn();
		render(<AddTodoItem onAdd={onAdd} multiline />);
		const field = screen.getByPlaceholderText("Add…");
		expect(field.tagName).toBe("TEXTAREA");
		fireEvent.change(field, { target: { value: "Nouvelle tâche" } });
		fireEvent.keyDown(field, { key: "Enter", shiftKey: true });
		expect(onAdd).not.toHaveBeenCalled();
		fireEvent.keyDown(field, { key: "Enter" });
		expect(onAdd).toHaveBeenCalledWith("Nouvelle tâche");
	});

	it("does not call onAdd for an empty or blank draft", () => {
		const onAdd = vi.fn();
		render(<AddTodoItem onAdd={onAdd} />);
		const input = screen.getByPlaceholderText("Add…");
		fireEvent.change(input, { target: { value: "   " } });
		fireEvent.keyDown(input, { key: "Enter" });
		expect(onAdd).not.toHaveBeenCalled();
	});

	it("uses a custom placeholder", () => {
		render(<AddTodoItem onAdd={() => {}} placeholder="Nouvelle tâche…" />);
		expect(
			screen.getByPlaceholderText("Nouvelle tâche…")
		).toBeInTheDocument();
	});
});
