import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { Spinner } from "./Spinner";

describe("Spinner", () => {
	it("has role=status with a default accessible label", () => {
		render(<Spinner />);
		expect(screen.getByRole("status")).toHaveTextContent("Loading");
	});

	it("uses a custom label when given", () => {
		render(<Spinner label="Enregistrement en cours" />);
		expect(screen.getByRole("status")).toHaveTextContent(
			"Enregistrement en cours"
		);
	});

	it("defaults to color=primary and size=md", () => {
		render(<Spinner data-testid="spinner" />);
		const spinner = screen.getByTestId("spinner");
		expect(spinner).toHaveAttribute("data-color", "primary");
		expect(spinner).toHaveAttribute("data-size", "md");
	});

	it("applies the given color and size", () => {
		render(<Spinner data-testid="spinner" color="danger" size="lg" />);
		const spinner = screen.getByTestId("spinner");
		expect(spinner).toHaveAttribute("data-color", "danger");
		expect(spinner).toHaveAttribute("data-size", "lg");
	});

	it("is block by default (no inline class)", () => {
		render(<Spinner data-testid="spinner" />);
		expect(screen.getByTestId("spinner").className).not.toMatch(/inline/);
	});

	it("applies the inline class when inline is set", () => {
		render(<Spinner data-testid="spinner" inline />);
		expect(screen.getByTestId("spinner").className).toMatch(/inline/);
	});

	it("keeps a custom className alongside the inline class", () => {
		render(<Spinner data-testid="spinner" className="custom" inline />);
		const spinner = screen.getByTestId("spinner");
		expect(spinner).toHaveClass("custom");
		expect(spinner.className).toMatch(/inline/);
	});

	it("falls back to AmphoreProvider's config.defaults.size when no size prop is given", () => {
		render(
			<AmphoreProvider config={{ defaults: { size: "lg" } }}>
				<Spinner data-testid="spinner" />
			</AmphoreProvider>
		);
		expect(screen.getByTestId("spinner")).toHaveAttribute(
			"data-size",
			"lg"
		);
	});

	it("an explicit size prop wins over AmphoreProvider's default", () => {
		render(
			<AmphoreProvider config={{ defaults: { size: "lg" } }}>
				<Spinner data-testid="spinner" size="sm" />
			</AmphoreProvider>
		);
		expect(screen.getByTestId("spinner")).toHaveAttribute(
			"data-size",
			"sm"
		);
	});
});
