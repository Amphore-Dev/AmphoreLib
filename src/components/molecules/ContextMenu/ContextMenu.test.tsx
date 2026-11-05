import React from "react";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import {
	expectInline,
	expectPortaledWithScope,
} from "../../../../tests/expectPortal";

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
	portal = false,
}: {
	onEdit: (row: TRow) => void;
	disabled?: boolean;
	portal?: boolean;
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
				portal={portal}
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

	describe("portal", () => {
		it("renders the menu inline by default", () => {
			const { container } = render(<TestList onEdit={() => {}} />);
			fireEvent.contextMenu(screen.getByText("Ligne A"));
			expectInline(container, screen.getByRole("menu"));
		});

		it("renders into document.body with the theme scope when portal is set, and items still resolve per row", async () => {
			const user = userEvent.setup();
			const onEdit = vi.fn();
			const { container } = render(
				<AmphoreProvider>
					<TestList onEdit={onEdit} portal />
				</AmphoreProvider>
			);
			fireEvent.contextMenu(screen.getByText("Ligne B"));
			expectPortaledWithScope(container, screen.getByRole("menu"));
			await user.click(
				screen.getByRole("menuitem", { name: "Modifier" })
			);
			expect(onEdit).toHaveBeenCalledWith(ROWS[1]);
			expect(screen.queryByRole("menu")).not.toBeInTheDocument();
		});
	});
});

describe("ContextMenu keyboard", () => {
	const Row: React.FC<{ onEdit?: () => void }> = ({ onEdit = () => {} }) => {
		const menu = useContextMenu();
		return (
			<>
				<button type="button" onClick={(e) => menu.show(e, undefined)}>
					More
				</button>
				<ContextMenu
					menu={menu}
					aria-label="Row actions"
					items={[
						{ label: "Edit", onClick: onEdit },
						{ label: "Archive", onClick: () => {}, disabled: true },
						{ label: "Delete", onClick: () => {} },
					]}
				/>
			</>
		);
	};

	it("opens from the keyboard under its trigger, not in the corner", async () => {
		const user = userEvent.setup();
		let position: { x: number; y: number } | null = null;
		const Probe = () => {
			const menu = useContextMenu();
			position = menu.state;
			return (
				<button type="button" onClick={(e) => menu.show(e, undefined)}>
					More
				</button>
			);
		};
		render(<Probe />);
		const trigger = screen.getByRole("button", { name: "More" });
		trigger.getBoundingClientRect = () =>
			({ left: 120, bottom: 240 }) as DOMRect;

		trigger.focus();
		await user.keyboard("{Enter}");

		expect(position).toMatchObject({ x: 120, y: 240 });
	});

	it("focuses the first item, skips disabled ones, and restores focus", async () => {
		const user = userEvent.setup();
		render(<Row />);
		const trigger = screen.getByRole("button", { name: "More" });

		trigger.focus();
		await user.keyboard("{Enter}");
		await waitFor(() =>
			expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus()
		);

		await user.keyboard("{ArrowDown}");
		expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();

		await user.keyboard("{Escape}");
		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
		await waitFor(() => expect(trigger).toHaveFocus());
	});

	it("runs an item with Enter", async () => {
		const user = userEvent.setup();
		const onEdit = vi.fn();
		render(<Row onEdit={onEdit} />);

		screen.getByRole("button", { name: "More" }).focus();
		await user.keyboard("{Enter}");
		await waitFor(() =>
			expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus()
		);
		await user.keyboard("{Enter}");

		expect(onEdit).toHaveBeenCalledTimes(1);
	});
});
