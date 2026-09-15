import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NavList, TNavItem } from "./NavList";

const items: TNavItem[] = [
	{ href: "/home", label: "Accueil", isActive: true },
	{ href: "/tasks", label: "Tâches" },
	{ href: "/hidden", label: "Caché", hidden: true },
];

describe("NavList", () => {
	it("renders one link per visible item", () => {
		render(<NavList items={items} />);
		expect(screen.getByRole("link", { name: "Accueil" })).toHaveAttribute(
			"href",
			"/home"
		);
		expect(screen.getByRole("link", { name: "Tâches" })).toHaveAttribute(
			"href",
			"/tasks"
		);
	});

	it("drops hidden items entirely", () => {
		render(<NavList items={items} />);
		expect(screen.queryByText("Caché")).not.toBeInTheDocument();
	});

	it("marks the active item", () => {
		render(<NavList items={items} />);
		expect(screen.getByRole("link", { name: "Accueil" })).toHaveAttribute(
			"aria-current",
			"page"
		);
		expect(
			screen.getByRole("link", { name: "Tâches" })
		).not.toHaveAttribute("aria-current");
	});

	it("hides every item's label in reduced mode", () => {
		render(<NavList items={items} isReduced />);
		expect(screen.queryByText("Accueil")).not.toBeInTheDocument();
		expect(screen.queryByText("Tâches")).not.toBeInTheDocument();
	});

	it("calls onNavigate with the clicked item", () => {
		const onNavigate = vi.fn();
		render(<NavList items={items} onNavigate={onNavigate} />);
		fireEvent.click(screen.getByRole("link", { name: "Tâches" }));
		expect(onNavigate).toHaveBeenCalledWith(items[1], expect.anything());
	});
});
