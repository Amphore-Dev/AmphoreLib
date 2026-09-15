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

	it("sets data-bordered only when bordered", () => {
		const { rerender } = render(
			<Card data-testid="card" elevation={2}>
				Contenu
			</Card>
		);
		expect(screen.getByTestId("card")).not.toHaveAttribute("data-bordered");
		rerender(
			<Card data-testid="card" elevation={2} bordered>
				Contenu
			</Card>
		);
		expect(screen.getByTestId("card")).toHaveAttribute(
			"data-bordered",
			"true"
		);
	});

	it("exposes shadow as px CSS vars, merged with a custom style", () => {
		render(
			<Card
				data-testid="card"
				elevation={2}
				shadow={{ x: -2, y: 0, blur: 0 }}
				style={{ width: 120 }}
			>
				Contenu
			</Card>
		);
		const card = screen.getByTestId("card");
		expect(card.style.getPropertyValue("--_shadow-x")).toBe("-2px");
		expect(card.style.getPropertyValue("--_shadow-y")).toBe("0px");
		expect(card.style.getPropertyValue("--_shadow-blur")).toBe("0px");
		expect(card.style.width).toBe("120px");
	});

	it("only sets the shadow vars given, leaving the rest to CSS defaults", () => {
		render(
			<Card data-testid="card" elevation={2} shadow={{ blur: 8 }}>
				Contenu
			</Card>
		);
		const card = screen.getByTestId("card");
		expect(card.style.getPropertyValue("--_shadow-x")).toBe("");
		expect(card.style.getPropertyValue("--_shadow-y")).toBe("");
		expect(card.style.getPropertyValue("--_shadow-blur")).toBe("8px");
	});

	it("leaves shadow vars unset without shadow", () => {
		render(
			<Card data-testid="card" elevation={2}>
				Contenu
			</Card>
		);
		const card = screen.getByTestId("card");
		expect(card.style.getPropertyValue("--_shadow-x")).toBe("");
		expect(card.style.getPropertyValue("--_shadow-y")).toBe("");
		expect(card.style.getPropertyValue("--_shadow-blur")).toBe("");
	});
});
