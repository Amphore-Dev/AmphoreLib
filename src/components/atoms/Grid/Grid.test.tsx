import { Fragment } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Grid } from "./Grid";

describe("Grid", () => {
	it("renders its children as direct children, no wrapping", () => {
		const { container } = render(
			<Grid columns={2}>
				<div className="a">A</div>
				<div className="b">B</div>
			</Grid>
		);
		expect(screen.getByText("A")).toBeInTheDocument();
		expect(screen.getByText("B")).toBeInTheDocument();
		const grid = container.firstChild as HTMLElement;
		// Every child is a real direct child of the grid — no extra
		// per-item wrapper element the way FlexGrid adds one.
		expect(grid.children).toHaveLength(2);
		expect(grid.children[0]).toHaveClass("a");
		expect(grid.children[1]).toHaveClass("b");
	});

	it("sets the column-count CSS variable", () => {
		const { container } = render(
			<Grid columns={3}>
				<div>A</div>
			</Grid>
		);
		const grid = container.firstChild as HTMLElement;
		expect(grid.style.getPropertyValue("--_column-count")).toBe("3");
	});

	it("doesn't set the column-count variable without `columns`", () => {
		const { container } = render(
			<Grid>
				<div>A</div>
			</Grid>
		);
		const grid = container.firstChild as HTMLElement;
		expect(grid.style.getPropertyValue("--_column-count")).toBe("");
	});

	it("stays transparent to a Fragment holding several fields — each becomes its own grid item, not one opaque cell", () => {
		// The whole reason this atom exists alongside FlexGrid: passing a
		// `<Fragment>` grouping several fields as one logical unit (e.g. one
		// per data group) doesn't collapse them into a single grid cell.
		// FlexGrid can't offer this — its `Children.map` sees the Fragment
		// as *one* React child and wraps that whole thing in one
		// FlexGridItem. Grid does no children processing at all: it renders
		// `{children}` as-is, so React unwraps the Fragment into the div's
		// own direct DOM children, same as if there were no Fragment.
		const { container } = render(
			<Grid columns={2}>
				<Fragment>
					<div>Field 1</div>
					<div>Field 2</div>
				</Fragment>
				<div>Field 3</div>
			</Grid>
		);
		const grid = container.firstChild as HTMLElement;
		expect(grid.children).toHaveLength(3);
	});

	it("forwards a custom className", () => {
		const { container } = render(
			<Grid columns={2} className="custom-grid">
				<div>A</div>
			</Grid>
		);
		expect(container.querySelector(".custom-grid")).toBeInTheDocument();
	});
});
