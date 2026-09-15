import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Th } from "./Th";

describe("Th", () => {
	it("renders its children with role=columnheader", () => {
		render(<Th>Nom</Th>);
		expect(screen.getByRole("columnheader")).toHaveTextContent("Nom");
	});

	it("calls onSort on click when sortable", () => {
		const onSort = vi.fn();
		render(
			<Th sortable onSort={onSort}>
				Nom
			</Th>
		);
		fireEvent.click(screen.getByRole("columnheader"));
		expect(onSort).toHaveBeenCalledTimes(1);
	});

	it("doesn't call onSort on click when not sortable", () => {
		const onSort = vi.fn();
		render(<Th onSort={onSort}>Nom</Th>);
		fireEvent.click(screen.getByRole("columnheader"));
		expect(onSort).not.toHaveBeenCalled();
	});

	it("sets aria-sort based on sortDirection", () => {
		const { rerender } = render(
			<Th sortable sortDirection="asc">
				Nom
			</Th>
		);
		expect(screen.getByRole("columnheader")).toHaveAttribute(
			"aria-sort",
			"ascending"
		);
		rerender(
			<Th sortable sortDirection="desc">
				Nom
			</Th>
		);
		expect(screen.getByRole("columnheader")).toHaveAttribute(
			"aria-sort",
			"descending"
		);
	});

	it("shows a placeholder sort indicator when sortable but not the active sort column", () => {
		render(<Th sortable>Nom</Th>);
		expect(screen.getByText("-")).toBeInTheDocument();
	});

	it("is focusable and calls onSort on Enter/Space when sortable", () => {
		const onSort = vi.fn();
		render(
			<Th sortable onSort={onSort}>
				Nom
			</Th>
		);
		const header = screen.getByRole("columnheader");
		expect(header).toHaveAttribute("tabIndex", "0");
		fireEvent.keyDown(header, { key: "Enter" });
		expect(onSort).toHaveBeenCalledTimes(1);
		fireEvent.keyDown(header, { key: " " });
		expect(onSort).toHaveBeenCalledTimes(2);
	});

	it("is not focusable when not sortable", () => {
		render(<Th>Nom</Th>);
		expect(screen.getByRole("columnheader")).not.toHaveAttribute(
			"tabIndex"
		);
	});

	it("sets data-sticky when given", () => {
		render(<Th sticky="right">Nom</Th>);
		expect(screen.getByRole("columnheader")).toHaveAttribute(
			"data-sticky",
			"right"
		);
	});
});
