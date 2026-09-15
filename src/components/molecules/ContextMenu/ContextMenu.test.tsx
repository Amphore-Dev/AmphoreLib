import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ContextMenu } from "./ContextMenu";
import { useContextMenu } from "./useContextMenu";

type TRow = { id: string; label: string };

const ROWS: TRow[] = [
	{ id: "a", label: "Ligne A" },
	{ id: "b", label: "Ligne B" },
];

function TestList({
	onEdit,
	disabled = false,
}: {
	onEdit: (row: TRow) => void;
	disabled?: boolean;
}) {
	const menu = useContextMenu<TRow>();

	return (
		<div>
			{ROWS.map((row) => (
				<div key={row.id} onContextMenu={(e) => menu.show(e, row)}>
					{row.label}
				</div>
			))}
			<ContextMenu
				menu={menu}
				disabled={disabled}
				items={(row) => [
					{ label: "Modifier", onClick: () => onEdit(row) },
					{ label: "Archiver", onClick: () => {}, disabled: true },
					{ label: "Supprimer", onClick: () => {}, color: "danger" },
				]}
			/>
		</div>
	);
}

describe("ContextMenu (shared menu, controller-based)", () => {
	it("does not render the menu until a trigger calls menu.show", () => {
		render(<TestList onEdit={() => {}} />);
		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
	});

	it("opens on right-click of a trigger, with one menuitem per resolved item", () => {
		render(<TestList onEdit={() => {}} />);
		fireEvent.contextMenu(screen.getByText("Ligne A"));
		expect(screen.getByRole("menu")).toBeInTheDocument();
		expect(screen.getAllByRole("menuitem")).toHaveLength(3);
	});

	it("resolves items against the row that was right-clicked — same shared menu, different data per trigger", async () => {
		const user = userEvent.setup();
		const onEdit = vi.fn();
		render(<TestList onEdit={onEdit} />);

		fireEvent.contextMenu(screen.getByText("Ligne A"));
		await user.click(screen.getByRole("menuitem", { name: "Modifier" }));
		expect(onEdit).toHaveBeenLastCalledWith(ROWS[0]);

		fireEvent.contextMenu(screen.getByText("Ligne B"));
		await user.click(screen.getByRole("menuitem", { name: "Modifier" }));
		expect(onEdit).toHaveBeenLastCalledWith(ROWS[1]);
	});

	it("only one menu instance ever exists, regardless of how many triggers there are", () => {
		render(<TestList onEdit={() => {}} />);
		fireEvent.contextMenu(screen.getByText("Ligne A"));
		expect(screen.getAllByRole("menu")).toHaveLength(1);
	});

	it("does not call onClick when clicking a disabled item", async () => {
		const user = userEvent.setup();
		render(<TestList onEdit={() => {}} />);
		fireEvent.contextMenu(screen.getByText("Ligne A"));
		await user.click(screen.getByRole("menuitem", { name: "Archiver" }));
		expect(screen.queryByRole("menu")).toBeInTheDocument();
	});

	it("never opens when disabled", () => {
		render(<TestList onEdit={() => {}} disabled />);
		fireEvent.contextMenu(screen.getByText("Ligne A"));
		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
	});

	it("closes on Escape", () => {
		render(<TestList onEdit={() => {}} />);
		fireEvent.contextMenu(screen.getByText("Ligne A"));
		expect(screen.getByRole("menu")).toBeInTheDocument();
		fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
	});

	it("closes the current menu and reopens at the new trigger when a different row is right-clicked", () => {
		render(<TestList onEdit={() => {}} />);
		fireEvent.contextMenu(screen.getByText("Ligne A"));
		expect(screen.getAllByRole("menu")).toHaveLength(1);
		fireEvent.contextMenu(screen.getByText("Ligne B"));
		expect(screen.getAllByRole("menu")).toHaveLength(1);
	});
});
