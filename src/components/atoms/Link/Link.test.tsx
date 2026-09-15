import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Link } from "./Link";

describe("Link", () => {
	it("renders an anchor with the given href and text", () => {
		render(<Link href="/about">À propos</Link>);
		const link = screen.getByRole("link", { name: "À propos" });
		expect(link).toHaveAttribute("href", "/about");
	});

	it("defaults to color=primary and underline=hover", () => {
		render(<Link href="/about">À propos</Link>);
		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("data-color", "primary");
		expect(link).toHaveAttribute("data-underline", "hover");
	});

	it("applies the given color and underline", () => {
		render(
			<Link href="/about" color="danger" underline="always">
				À propos
			</Link>
		);
		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("data-color", "danger");
		expect(link).toHaveAttribute("data-underline", "always");
	});

	it("adds target=_blank and rel=noopener when external", () => {
		render(
			<Link href="https://example.com" external>
				Site externe
			</Link>
		);
		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("target", "_blank");
		expect(link).toHaveAttribute("rel", "noopener noreferrer");
	});

	it("does not add target/rel when not external", () => {
		render(<Link href="/about">À propos</Link>);
		const link = screen.getByRole("link");
		expect(link).not.toHaveAttribute("target");
		expect(link).not.toHaveAttribute("rel");
	});

	it("when disabled, drops href and removes it from the tab order", () => {
		render(
			<Link href="/about" disabled>
				À propos
			</Link>
		);
		const link = screen.getByText("À propos");
		expect(link).not.toHaveAttribute("href");
		expect(link).toHaveAttribute("aria-disabled", "true");
		expect(link).toHaveAttribute("tabIndex", "-1");
	});

	it("forwards native anchor props and a custom className", () => {
		render(
			<Link href="/about" className="custom" data-testid="link">
				À propos
			</Link>
		);
		const link = screen.getByTestId("link");
		expect(link).toHaveClass("custom");
	});
});
