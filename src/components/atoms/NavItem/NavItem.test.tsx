import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { NavItem } from "./NavItem";

describe("NavItem", () => {
	it("renders an anchor with the given href and label", () => {
		render(<NavItem href="/tasks">Tasks</NavItem>);
		const link = screen.getByRole("link", { name: "Tasks" });
		expect(link).toHaveAttribute("href", "/tasks");
	});

	it("marks itself active via data-active and aria-current", () => {
		render(
			<NavItem href="/tasks" isActive>
				Tasks
			</NavItem>
		);
		const link = screen.getByRole("link", { name: "Tasks" });
		expect(link).toHaveAttribute("data-active", "true");
		expect(link).toHaveAttribute("aria-current", "page");
	});

	it("doesn't set data-active/aria-current when not active", () => {
		render(<NavItem href="/tasks">Tasks</NavItem>);
		const link = screen.getByRole("link", { name: "Tasks" });
		expect(link).not.toHaveAttribute("data-active");
		expect(link).not.toHaveAttribute("aria-current");
	});

	it("hides children when reduced, keeping only the icon", () => {
		render(
			<NavItem href="/tasks" picto="home" isReduced>
				Tasks
			</NavItem>
		);
		expect(screen.queryByText("Tasks")).not.toBeInTheDocument();
	});

	it("shows children as a Tooltip on hover when reduced", async () => {
		render(
			<NavItem href="/tasks" isReduced>
				Tasks
			</NavItem>
		);
		const link = screen.getByRole("link");
		await userEvent.hover(link);
		expect(await screen.findByRole("tooltip")).toHaveTextContent("Tasks");
	});

	it("never shows a tooltip when not reduced, even on hover", async () => {
		render(<NavItem href="/tasks">Tasks</NavItem>);
		await userEvent.hover(screen.getByRole("link"));
		expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
	});

	it("spreads native anchor props through, e.g. an onClick for SPA routing", () => {
		const onClick = vi.fn();
		render(
			<NavItem href="/tasks" onClick={onClick}>
				Tasks
			</NavItem>
		);
		fireEvent.click(screen.getByRole("link"));
		expect(onClick).toHaveBeenCalled();
	});
});
