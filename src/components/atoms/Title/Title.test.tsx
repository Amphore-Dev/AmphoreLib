import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Title } from "./Title";

describe("Title", () => {
	it("renders an h1 by default", () => {
		render(<Title>Hello</Title>);
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
			"Hello"
		);
	});

	it("renders the tag given via `as`", () => {
		render(<Title as="h3">Hello</Title>);
		expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
	});

	it("defaults the visual size to `as` when `size` isn't given", () => {
		render(<Title as="h4">Hello</Title>);
		expect(screen.getByRole("heading", { level: 4 })).toHaveAttribute(
			"data-size",
			"h4"
		);
	});

	it("lets `size` decouple the visual scale from the semantic tag", () => {
		render(
			<Title as="h2" size="h5">
				Hello
			</Title>
		);
		const heading = screen.getByRole("heading", { level: 2 });
		expect(heading).toHaveAttribute("data-size", "h5");
	});

	it("sets data-color when color is given", () => {
		render(<Title color="danger">Hello</Title>);
		expect(screen.getByRole("heading")).toHaveAttribute(
			"data-color",
			"danger"
		);
	});

	it("forwards native heading props and a custom className", () => {
		render(
			<Title className="custom" aria-label="Titre">
				Hello
			</Title>
		);
		const heading = screen.getByRole("heading");
		expect(heading).toHaveClass("custom");
		expect(heading).toHaveAttribute("aria-label", "Titre");
	});
});
