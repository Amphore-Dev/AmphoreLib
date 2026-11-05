import React from "react";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import type { TMenuItem } from "@interfaces/index";

import {
	expectInline,
	expectPortaledWithScope,
} from "../../../../tests/expectPortal";

import { Dropdown } from "./Dropdown";

const makeItems = (onEdit: () => void, onDelete: () => void): TMenuItem[] => [
	{ label: "Modifier", onClick: onEdit, picto: "search" },
	{ label: "Archiver", onClick: () => {}, disabled: true },
	{ label: "Supprimer", onClick: onDelete, color: "danger" },
];

describe("Dropdown", () => {
	it("does not render the menu until the trigger is clicked", () => {
		render(
			<Dropdown
				items={makeItems(
					() => {},
					() => {}
				)}
			>
				<button type="button">Actions</button>
			</Dropdown>
		);
		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
	});

	it("opens the menu with one menuitem per item on trigger click", async () => {
		const user = userEvent.setup();
		render(
			<Dropdown
				items={makeItems(
					() => {},
					() => {}
				)}
			>
				<button type="button">Actions</button>
			</Dropdown>
		);
		await user.click(screen.getByRole("button", { name: "Actions" }));
		expect(screen.getByRole("menu")).toBeInTheDocument();
		expect(screen.getAllByRole("menuitem")).toHaveLength(3);
	});

	it("calls the item's onClick and closes the menu when clicked", async () => {
		const user = userEvent.setup();
		const onEdit = vi.fn();
		render(
			<Dropdown items={makeItems(onEdit, () => {})}>
				<button type="button">Actions</button>
			</Dropdown>
		);
		await user.click(screen.getByRole("button", { name: "Actions" }));
		await user.click(screen.getByRole("menuitem", { name: /Modifier/ }));
		expect(onEdit).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
	});

	it("does not call onClick when clicking a disabled item", async () => {
		const user = userEvent.setup();
		const onArchive = vi.fn();
		render(
			<Dropdown
				items={[
					{ label: "Archiver", onClick: onArchive, disabled: true },
				]}
			>
				<button type="button">Actions</button>
			</Dropdown>
		);
		await user.click(screen.getByRole("button", { name: "Actions" }));
		await user.click(screen.getByRole("menuitem", { name: "Archiver" }));
		expect(onArchive).not.toHaveBeenCalled();
	});

	it("tints an item via data-color", async () => {
		const user = userEvent.setup();
		render(
			<Dropdown
				items={makeItems(
					() => {},
					() => {}
				)}
			>
				<button type="button">Actions</button>
			</Dropdown>
		);
		await user.click(screen.getByRole("button", { name: "Actions" }));
		expect(
			screen.getByRole("menuitem", { name: /Supprimer/ })
		).toHaveAttribute("data-color", "danger");
	});

	it("never opens when disabled", async () => {
		const user = userEvent.setup();
		render(
			<Dropdown
				items={makeItems(
					() => {},
					() => {}
				)}
				disabled
			>
				<button type="button">Actions</button>
			</Dropdown>
		);
		await user.click(screen.getByRole("button", { name: "Actions" }));
		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
	});

	it("skips a hidden item entirely — not rendered, not counted", async () => {
		const user = userEvent.setup();
		render(
			<Dropdown
				items={[
					{ label: "Modifier", onClick: () => {} },
					{ label: "Caché", onClick: () => {}, hidden: true },
					{ label: "Supprimer", onClick: () => {} },
				]}
			>
				<button type="button">Actions</button>
			</Dropdown>
		);
		await user.click(screen.getByRole("button", { name: "Actions" }));
		expect(screen.getAllByRole("menuitem")).toHaveLength(2);
		expect(
			screen.queryByRole("menuitem", { name: "Caché" })
		).not.toBeInTheDocument();
	});

	it("closes on Escape", async () => {
		const user = userEvent.setup();
		render(
			<Dropdown
				items={makeItems(
					() => {},
					() => {}
				)}
			>
				<button type="button">Actions</button>
			</Dropdown>
		);
		await user.click(screen.getByRole("button", { name: "Actions" }));
		expect(screen.getByRole("menu")).toBeInTheDocument();
		await user.keyboard("{Escape}");
		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
	});

	describe("portal", () => {
		it("renders the menu inline by default", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<Dropdown
					items={makeItems(
						() => {},
						() => {}
					)}
				>
					<button type="button">Actions</button>
				</Dropdown>
			);
			await user.click(screen.getByRole("button", { name: "Actions" }));
			expectInline(container, screen.getByRole("menu"));
		});

		it("renders into document.body with the theme scope when portal is set, and items still fire", async () => {
			const user = userEvent.setup();
			const onEdit = vi.fn();
			const { container } = render(
				<AmphoreProvider>
					<Dropdown items={makeItems(onEdit, () => {})} portal>
						<button type="button">Actions</button>
					</Dropdown>
				</AmphoreProvider>
			);
			await user.click(screen.getByRole("button", { name: "Actions" }));
			expectPortaledWithScope(container, screen.getByRole("menu"));
			await user.click(
				screen.getByRole("menuitem", { name: "Modifier" })
			);
			expect(onEdit).toHaveBeenCalledTimes(1);
			expect(screen.queryByRole("menu")).not.toBeInTheDocument();
		});
	});
});

describe("Dropdown keyboard", () => {
	const items = [
		{ label: "Edit", onClick: () => {} },
		{ label: "Archive", onClick: () => {}, disabled: true },
		{ label: "Share", onClick: () => {} },
		{ label: "Delete", onClick: () => {} },
	];

	const setup = async () => {
		const user = userEvent.setup();
		render(
			<>
				<Dropdown items={items}>
					<button type="button">Actions</button>
				</Dropdown>
				<button type="button">After</button>
			</>
		);
		const trigger = screen.getByRole("button", { name: "Actions" });
		trigger.focus();
		await user.keyboard("{Enter}");
		await screen.findByRole("menu", { name: "Actions" });
		await waitFor(() =>
			expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus()
		);
		return { user, trigger };
	};

	it("states what the trigger opens", async () => {
		const { trigger } = await setup();
		expect(trigger).toHaveAttribute("aria-haspopup", "menu");
		expect(trigger).toHaveAttribute("aria-expanded", "true");
	});

	it("moves with the arrows, skipping disabled items, wrapping", async () => {
		const { user } = await setup();

		await user.keyboard("{ArrowDown}");
		expect(screen.getByRole("menuitem", { name: "Share" })).toHaveFocus();

		await user.keyboard("{ArrowUp}{ArrowUp}");
		expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();
	});

	it("goes to the ends with Home and End", async () => {
		const { user } = await setup();

		await user.keyboard("{End}");
		expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveFocus();

		await user.keyboard("{Home}");
		expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
	});

	it("returns focus to the trigger on Escape", async () => {
		const { user, trigger } = await setup();

		await user.keyboard("{Escape}");

		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
		await waitFor(() => expect(trigger).toHaveFocus());
	});

	it("closes on Tab", async () => {
		const { user } = await setup();

		await user.tab();

		await waitFor(() =>
			expect(screen.queryByRole("menu")).not.toBeInTheDocument()
		);
	});
});
