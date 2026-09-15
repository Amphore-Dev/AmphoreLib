import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Card } from "./Card";

describe("Card", () => {
	it("renders its children", () => {
		render(<Card>Contenu</Card>);
		expect(screen.getByText("Contenu")).toBeInTheDocument();
	});

	it("has no elevation or no-padding by default", () => {
		render(<Card data-testid="card">Contenu</Card>);
		const card = screen.getByTestId("card");
		expect(card).not.toHaveAttribute("data-elevation");
		expect(card).not.toHaveAttribute("data-no-padding");
	});

	it("sets data-elevation to the given level", () => {
		render(
			<Card data-testid="card" elevation={3}>
				Contenu
			</Card>
		);
		expect(screen.getByTestId("card")).toHaveAttribute(
			"data-elevation",
			"3"
		);
	});

	it("sets data-no-padding when noPadding", () => {
		render(
			<Card data-testid="card" noPadding>
				Contenu
			</Card>
		);
		expect(screen.getByTestId("card")).toHaveAttribute(
			"data-no-padding",
			"true"
		);
	});

	it("forwards native div props and a custom className", () => {
		render(
			<Card data-testid="card" className="custom" aria-label="Ma carte">
				Contenu
			</Card>
		);
		const card = screen.getByTestId("card");
		expect(card).toHaveClass("custom");
		expect(card).toHaveAttribute("aria-label", "Ma carte");
	});
});
