import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
	it("is hidden from screen readers", () => {
		render(<Skeleton data-testid="skeleton" />);
		expect(screen.getByTestId("skeleton")).toHaveAttribute(
			"aria-hidden",
			"true"
		);
	});

	it("defaults to variant=text", () => {
		render(<Skeleton data-testid="skeleton" />);
		expect(screen.getByTestId("skeleton")).toHaveAttribute(
			"data-variant",
			"text"
		);
	});

	it("applies the given variant", () => {
		render(<Skeleton data-testid="skeleton" variant="circle" />);
		expect(screen.getByTestId("skeleton")).toHaveAttribute(
			"data-variant",
			"circle"
		);
	});

	it("applies width/height as inline style", () => {
		render(<Skeleton data-testid="skeleton" width={120} height="2rem" />);
		const skeleton = screen.getByTestId("skeleton");
		expect(skeleton).toHaveStyle({ width: "120px", height: "2rem" });
	});

	it("forwards a custom className", () => {
		render(<Skeleton data-testid="skeleton" className="custom" />);
		expect(screen.getByTestId("skeleton")).toHaveClass("custom");
	});
});
