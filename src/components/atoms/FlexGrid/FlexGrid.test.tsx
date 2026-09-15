import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FlexGrid } from "./FlexGrid";
import { FlexGridItem } from "./FlexGridItem";

describe("FlexGrid", () => {
	it("renders its children", () => {
		render(
			<FlexGrid columns={2}>
				<div>A</div>
				<div>B</div>
			</FlexGrid>
		);
		expect(screen.getByText("A")).toBeInTheDocument();
		expect(screen.getByText("B")).toBeInTheDocument();
	});

	it("sets the column-count CSS variable", () => {
		const { container } = render(
			<FlexGrid columns={3}>
				<div>A</div>
			</FlexGrid>
		);
		const grid = container.firstChild as HTMLElement;
		expect(grid.style.getPropertyValue("--_column-count")).toBe("3");
	});

	it("doesn't set the column-count variable without `columns`", () => {
		const { container } = render(
			<FlexGrid>
				<div>A</div>
			</FlexGrid>
		);
		const grid = container.firstChild as HTMLElement;
		expect(grid.style.getPropertyValue("--_column-count")).toBe("");
	});

	it("passes through a plain child wrapped in a FlexGridItem (span 1 by default)", () => {
		const { container } = render(
			<FlexGrid columns={2}>
				<div>A</div>
			</FlexGrid>
		);
		expect(container.querySelectorAll('[class*="item"]')).toHaveLength(1);
	});

	it("respects a plain child's own data-span without double-wrapping", () => {
		const { container } = render(
			<FlexGrid columns={3}>
				<div data-span={2}>A</div>
			</FlexGrid>
		);
		// still exactly one .item wrapper (the auto-wrap), spanning 2.
		const item = container.querySelector('[class*="item"]') as HTMLElement;
		expect(item.style.flex).toContain("2 *");
	});

	it("doesn't double-wrap a child that's already a FlexGridItem", () => {
		const { container } = render(
			<FlexGrid columns={2}>
				<FlexGridItem span={2} className="custom-item">
					A
				</FlexGridItem>
			</FlexGrid>
		);
		expect(container.querySelectorAll(".custom-item")).toHaveLength(1);
	});

	it("forwards a custom className", () => {
		const { container } = render(
			<FlexGrid columns={2} className="custom-grid">
				<div>A</div>
			</FlexGrid>
		);
		expect(container.querySelector(".custom-grid")).toBeInTheDocument();
	});
});

describe("FlexGridItem", () => {
	it("renders its children", () => {
		render(<FlexGridItem>Hello</FlexGridItem>);
		expect(screen.getByText("Hello")).toBeInTheDocument();
	});

	it("sets no explicit flex-basis override for span=1 (default)", () => {
		const { container } = render(<FlexGridItem>Hello</FlexGridItem>);
		const item = container.firstChild as HTMLElement;
		expect(item.style.flex).toBe("");
	});

	it("sets a flex value referencing the span for span > 1", () => {
		const { container } = render(
			<FlexGridItem span={3}>Hello</FlexGridItem>
		);
		const item = container.firstChild as HTMLElement;
		expect(item.style.flex).toContain("3 *");
	});
});
