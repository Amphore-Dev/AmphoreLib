import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TSummaryListItem } from "@interfaces/index";

import { SummaryListItem } from "./SummaryListItem";

describe("SummaryListItem", () => {
	it("renders the label and value", () => {
		const item: TSummaryListItem = { label: "Nom", value: "Alice" };
		render(<SummaryListItem {...item} />);
		expect(screen.getByText("Nom")).toBeInTheDocument();
		expect(screen.getByText("Alice")).toBeInTheDocument();
	});

	it("shows a required marker", () => {
		render(<SummaryListItem label="Nom" value="Alice" required />);
		expect(screen.getByText("*")).toBeInTheDocument();
	});

	it("renders the value as a link when href is given", () => {
		render(
			<SummaryListItem
				label="Site"
				value="example.com"
				href="https://example.com"
			/>
		);
		const link = screen.getByRole("link", { name: "example.com" });
		expect(link).toHaveAttribute("href", "https://example.com");
	});

	it("renders the value as a clickable button when onClick is given (no href)", () => {
		const onClick = vi.fn();
		render(
			<SummaryListItem label="Copier" value="abc-123" onClick={onClick} />
		);
		fireEvent.click(screen.getByRole("button", { name: "abc-123" }));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("prefers href over onClick when both are given", () => {
		const onClick = vi.fn();
		render(
			<SummaryListItem
				label="Site"
				value="example.com"
				href="https://example.com"
				onClick={onClick}
			/>
		);
		expect(screen.getByRole("link")).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: "example.com" })
		).not.toBeInTheDocument();
	});

	it("renders a trailing action button", () => {
		const onAction = vi.fn();
		render(
			<SummaryListItem
				label="Mot de passe"
				value="••••••••"
				action={{ label: "Modifier", onClick: onAction }}
			/>
		);
		fireEvent.click(screen.getByRole("button", { name: "Modifier" }));
		expect(onAction).toHaveBeenCalledTimes(1);
	});

	it("renders plain items without a link/button when neither href nor onClick is given", () => {
		render(<SummaryListItem label="Nom" value="Alice" />);
		expect(screen.queryByRole("link")).not.toBeInTheDocument();
		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});

	it("defaults direction to vertical", () => {
		const { container } = render(
			<SummaryListItem label="Nom" value="Alice" />
		);
		expect(container.firstChild).toHaveAttribute(
			"data-direction",
			"vertical"
		);
	});

	it("sets data-direction when given", () => {
		const { container } = render(
			<SummaryListItem label="Nom" value="Alice" direction="horizontal" />
		);
		expect(container.firstChild).toHaveAttribute(
			"data-direction",
			"horizontal"
		);
	});

	it("doesn't apply the outer ellipsis class when maxLines is set (avoids double truncation)", () => {
		render(
			<SummaryListItem
				label="Description"
				value="Texte long"
				maxLines={1}
			/>
		);
		// The text lands in TruncatedTooltipText's own span; its parent is
		// this component's own wrapping span (which must not also truncate).
		const outer = screen.getByText("Texte long").parentElement;
		expect(outer?.className).not.toMatch(/ellipsis/);
	});
});
