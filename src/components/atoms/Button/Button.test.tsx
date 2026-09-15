import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { Button } from "./Button";

describe("Button", () => {
	it("renders its label", () => {
		render(<Button label="Enregistrer" />);
		expect(
			screen.getByRole("button", { name: "Enregistrer" })
		).toBeInTheDocument();
	});

	it("applies color, variant and size as independent data-attributes", () => {
		render(
			<Button
				label="Supprimer"
				color="danger"
				variant="outline"
				size="lg"
			/>
		);
		const btn = screen.getByRole("button", { name: "Supprimer" });
		expect(btn).toHaveAttribute("data-color", "danger");
		expect(btn).toHaveAttribute("data-variant", "outline");
		expect(btn).toHaveAttribute("data-size", "lg");
	});

	it("defaults to color=primary, variant=solid and size=md", () => {
		render(<Button label="Défaut" />);
		const btn = screen.getByRole("button", { name: "Défaut" });
		expect(btn).toHaveAttribute("data-color", "primary");
		expect(btn).toHaveAttribute("data-variant", "solid");
		expect(btn).toHaveAttribute("data-size", "md");
	});

	it("falls back to AmphoreProvider's config.defaults.size when no size prop is given", () => {
		render(
			<AmphoreProvider config={{ defaults: { size: "lg" } }}>
				<Button label="Défaut global" />
			</AmphoreProvider>
		);
		expect(
			screen.getByRole("button", { name: "Défaut global" })
		).toHaveAttribute("data-size", "lg");
	});

	it("an explicit size prop wins over AmphoreProvider's default", () => {
		render(
			<AmphoreProvider config={{ defaults: { size: "lg" } }}>
				<Button label="Explicite" size="sm" />
			</AmphoreProvider>
		);
		expect(
			screen.getByRole("button", { name: "Explicite" })
		).toHaveAttribute("data-size", "sm");
	});

	it("lets any color render as outline or ghost", () => {
		render(<Button label="Danger ghost" color="danger" variant="ghost" />);
		const btn = screen.getByRole("button", { name: "Danger ghost" });
		expect(btn).toHaveAttribute("data-color", "danger");
		expect(btn).toHaveAttribute("data-variant", "ghost");
	});

	it("renders as link", () => {
		render(<Button label="Ajouter" variant="link" />);
		expect(screen.getByRole("button", { name: "Ajouter" })).toHaveAttribute(
			"data-variant",
			"link"
		);
	});

	it("disables the button and blocks clicks while isLoading", async () => {
		const onClick = vi.fn();
		render(<Button label="Envoyer" isLoading onClick={onClick} />);
		const btn = screen.getByRole("button", { name: "Envoyer" });

		expect(btn).toBeDisabled();
		expect(btn).toHaveAttribute("data-loading", "true");

		await userEvent.click(btn);
		expect(onClick).not.toHaveBeenCalled();
	});

	it("respects an explicit disabled prop", () => {
		render(<Button label="Bloqué" disabled />);
		expect(screen.getByRole("button", { name: "Bloqué" })).toBeDisabled();
	});

	it("renders a leading picto when given", () => {
		render(<Button label="Rechercher" picto="search" />);
		expect(screen.getByTestId("search")).toBeInTheDocument();
	});

	it("scales the picto's size with the button's own size", () => {
		render(<Button label="Rechercher" picto="search" size="lg" />);
		const svg = screen
			.getByTestId("search")
			.querySelector("svg") as unknown as HTMLElement;
		expect(svg).toHaveStyle({ width: "1.5rem", height: "1.5rem" });
	});

	it("hides the picto while isLoading — the spinner takes its place", () => {
		const { container } = render(
			<Button label="Envoyer" picto="search" isLoading />
		);
		expect(screen.queryByTestId("search")).not.toBeInTheDocument();
		expect(container.querySelector("[aria-hidden]")).toBeInTheDocument();
	});

	it("fires onClick when enabled", async () => {
		const onClick = vi.fn();
		render(<Button label="Go" onClick={onClick} />);
		await userEvent.click(screen.getByRole("button", { name: "Go" }));
		expect(onClick).toHaveBeenCalledTimes(1);
	});
});
