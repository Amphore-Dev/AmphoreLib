import React from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { TMenuItem } from "@interfaces/index";

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
});
