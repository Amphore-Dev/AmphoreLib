import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Td } from "./Td";

describe("Td", () => {
	it("renders its children with role=gridcell", () => {
		render(<Td>Hello</Td>);
		expect(screen.getByRole("gridcell")).toHaveTextContent("Hello");
	});

	it("sets data-sticky when given", () => {
		render(<Td sticky="left">Hello</Td>);
		expect(screen.getByRole("gridcell")).toHaveAttribute(
			"data-sticky",
			"left"
		);
	});

	it("forwards native div props and a custom className", () => {
		render(
			<Td className="custom" data-testid="cell">
				Hello
			</Td>
		);
		expect(screen.getByTestId("cell")).toHaveClass("custom");
	});
});
