import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TodoItem } from "./TodoItem";

describe("TodoItem", () => {
	it("renders the text", () => {
		render(<TodoItem text="Réunion de cadrage" />);
		expect(screen.getByText("Réunion de cadrage")).toBeInTheDocument();
	});

	it("renders the before slot", () => {
		render(<TodoItem text="Tâche" before={<span>MYD-1</span>} />);
		expect(screen.getByText("MYD-1")).toBeInTheDocument();
	});

	it("switches to an editor on click and commits on Enter", () => {
		const onTextChange = vi.fn();
		render(<TodoItem text="Ancien texte" onTextChange={onTextChange} />);
		fireEvent.click(screen.getByText("Ancien texte"));
		const editor = screen.getByDisplayValue("Ancien texte");
		fireEvent.change(editor, { target: { value: "Nouveau texte" } });
		fireEvent.keyDown(editor, { key: "Enter" });
		expect(onTextChange).toHaveBeenCalledWith("Nouveau texte");
	});

	it("cancels the edit on Escape without calling onTextChange", () => {
		const onTextChange = vi.fn();
		render(<TodoItem text="Ancien texte" onTextChange={onTextChange} />);
		fireEvent.click(screen.getByText("Ancien texte"));
		const editor = screen.getByDisplayValue("Ancien texte");
		fireEvent.change(editor, { target: { value: "Changé" } });
		fireEvent.keyDown(editor, { key: "Escape" });
		expect(onTextChange).not.toHaveBeenCalled();
		expect(screen.getByText("Ancien texte")).toBeInTheDocument();
	});

	it("does not allow editing when editable is false", () => {
		render(<TodoItem text="Lecture seule" editable={false} />);
		expect(screen.getByText("Lecture seule").tagName).not.toBe("BUTTON");
	});

	it("calls onRemove when the remove button is clicked", () => {
		const onRemove = vi.fn();
		render(<TodoItem text="À retirer" onRemove={onRemove} />);
		fireEvent.click(
			screen.getByRole("button", { name: "Remove: À retirer" })
		);
		expect(onRemove).toHaveBeenCalled();
	});

	it("hides the remove button when removable is false", () => {
		render(<TodoItem text="Fixe" removable={false} />);
		expect(
			screen.queryByRole("button", { name: "Remove: Fixe" })
		).not.toBeInTheDocument();
	});

	it("renders a drag handle only when dragHandleProps is passed", () => {
		const { rerender } = render(<TodoItem text="Sans poignée" />);
		expect(
			screen.queryByRole("button", { name: /^Move/i })
		).not.toBeInTheDocument();

		rerender(
			<TodoItem
				text="Avec poignée"
				dragHandleProps={{ "aria-label": "Déplacer" }}
			/>
		);
		expect(
			screen.getByRole("button", { name: "Déplacer" })
		).toBeInTheDocument();
	});
});
