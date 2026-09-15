import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TSummaryListItem } from "@interfaces/index";

import { SummaryList } from "./SummaryList";

const items: TSummaryListItem[] = [
	{ label: "Nom", value: "Alice" },
	{ label: "Email", value: "alice@example.com" },
];

describe("SummaryList", () => {
	it("renders each item (label and value) via SummaryListItem", () => {
		render(<SummaryList items={items} />);
		expect(screen.getByText("Nom")).toBeInTheDocument();
		expect(screen.getByText("Alice")).toBeInTheDocument();
		expect(screen.getByText("Email")).toBeInTheDocument();
		expect(screen.getByText("alice@example.com")).toBeInTheDocument();
	});

	it("renders a real <dl> for vertical/horizontal layouts", () => {
		const { container } = render(<SummaryList items={items} />);
		expect(container.querySelector("dl")).toBeInTheDocument();
	});

	it("defaults divider to false", () => {
		const { container } = render(<SummaryList items={items} />);
		expect(container.querySelector("dl")).toHaveAttribute(
			"data-divider",
			"false"
		);
	});

	it("sets data-divider when given", () => {
		const { container } = render(<SummaryList items={items} divider />);
		expect(container.querySelector("dl")).toHaveAttribute(
			"data-divider",
			"true"
		);
	});

	it("passes `layout` down to each item's `direction` (vertical/horizontal)", () => {
		const { container } = render(
			<SummaryList items={items} layout="horizontal" />
		);
		const rows = container.querySelectorAll("[data-direction]");
		expect(rows.length).toBe(items.length);
		rows.forEach((row) => {
			expect(row).toHaveAttribute("data-direction", "horizontal");
		});
	});

	it('renders items via Grid (not a <dl>) for layout="grid", forwarding gridConfig', () => {
		const { container } = render(
			<SummaryList
				items={items}
				layout="grid"
				gridConfig={{ columns: 3 }}
			/>
		);
		expect(container.querySelector("dl")).not.toBeInTheDocument();
		const grid = container.firstChild as HTMLElement;
		expect(grid.style.getPropertyValue("--_column-count")).toBe("3");
	});

	it("defaults gridConfig's columns to 4", () => {
		const { container } = render(
			<SummaryList items={items} layout="grid" />
		);
		const grid = container.firstChild as HTMLElement;
		expect(grid.style.getPropertyValue("--_column-count")).toBe("4");
	});
});
