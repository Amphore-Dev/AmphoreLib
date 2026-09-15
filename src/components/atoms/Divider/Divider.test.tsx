import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Divider } from "./Divider";

describe("Divider", () => {
	it("renders with role=separator, horizontal by default", () => {
		render(<Divider data-testid="divider" />);
		const divider = screen.getByTestId("divider");
		expect(divider).toHaveAttribute("role", "separator");
		expect(divider).toHaveAttribute("aria-orientation", "horizontal");
	});

	it("sets aria-orientation=vertical when orientation=vertical", () => {
		render(<Divider data-testid="divider" orientation="vertical" />);
		expect(screen.getByTestId("divider")).toHaveAttribute(
			"aria-orientation",
			"vertical"
		);
	});

	it("renders the label between two lines when given (horizontal)", () => {
		render(<Divider label="ou" />);
		expect(screen.getByText("ou")).toBeInTheDocument();
		expect(screen.getByRole("separator")).toHaveTextContent("ou");
	});

	it("ignores label when orientation=vertical", () => {
		render(<Divider label="ou" orientation="vertical" />);
		expect(screen.queryByText("ou")).not.toBeInTheDocument();
	});

	it("forwards native div props and a custom className", () => {
		render(
			<Divider
				data-testid="divider"
				className="custom"
				aria-label="Séparateur"
			/>
		);
		const divider = screen.getByTestId("divider");
		expect(divider).toHaveClass("custom");
		expect(divider).toHaveAttribute("aria-label", "Séparateur");
	});
});
