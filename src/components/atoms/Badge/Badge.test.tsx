import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { Badge } from "./Badge";

describe("Badge", () => {
	it("renders its children", () => {
		render(<Badge>Nouveau</Badge>);
		expect(screen.getByText("Nouveau")).toBeInTheDocument();
	});

	it("defaults to color=primary, variant=tint and size=md", () => {
		render(<Badge data-testid="badge">Défaut</Badge>);
		const badge = screen.getByTestId("badge");
		expect(badge).toHaveAttribute("data-color", "primary");
		expect(badge).toHaveAttribute("data-variant", "tint");
		expect(badge).toHaveAttribute("data-size", "md");
	});

	it("applies the given color, variant and size", () => {
		render(
			<Badge
				data-testid="badge"
				color="danger"
				variant="outline"
				size="lg"
			>
				Erreur
			</Badge>
		);
		const badge = screen.getByTestId("badge");
		expect(badge).toHaveAttribute("data-color", "danger");
		expect(badge).toHaveAttribute("data-variant", "outline");
		expect(badge).toHaveAttribute("data-size", "lg");
	});

	it("falls back to AmphoreProvider's config.defaults.size when no size prop is given", () => {
		render(
			<AmphoreProvider config={{ defaults: { size: "lg" } }}>
				<Badge data-testid="badge">Défaut global</Badge>
			</AmphoreProvider>
		);
		expect(screen.getByTestId("badge")).toHaveAttribute("data-size", "lg");
	});

	it("an explicit size prop wins over AmphoreProvider's default", () => {
		render(
			<AmphoreProvider config={{ defaults: { size: "lg" } }}>
				<Badge data-testid="badge" size="sm">
					Explicite
				</Badge>
			</AmphoreProvider>
		);
		expect(screen.getByTestId("badge")).toHaveAttribute("data-size", "sm");
	});

	it("has no data-pill by default", () => {
		render(<Badge data-testid="badge">Défaut</Badge>);
		expect(screen.getByTestId("badge")).not.toHaveAttribute("data-pill");
	});

	it("sets data-pill when pill is true", () => {
		render(
			<Badge data-testid="badge" pill>
				Capsule
			</Badge>
		);
		expect(screen.getByTestId("badge")).toHaveAttribute(
			"data-pill",
			"true"
		);
	});

	it("renders a leading picto when provided", () => {
		render(<Badge picto="calendar">Événement</Badge>);
		expect(screen.getByTestId("calendar")).toBeInTheDocument();
	});

	it("accepts an IPictoProps object for the picto, passing extra props through (e.g. rotation)", () => {
		render(
			<Badge picto={{ icon: "calendar", rotation: 90 }}>Événement</Badge>
		);
		const svg = screen.getByTestId("calendar").querySelector("svg");
		expect(svg).toHaveStyle({ transform: "rotate(90deg)" });
	});

	it("shows no remove button by default", () => {
		render(<Badge>Statique</Badge>);
		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});

	it("shows a remove button when onRemove is given, and calls it on click", async () => {
		const user = userEvent.setup();
		const onRemove = vi.fn();
		render(<Badge onRemove={onRemove}>Amovible</Badge>);

		const removeBtn = screen.getByRole("button", { name: "Remove" });
		await user.click(removeBtn);
		expect(onRemove).toHaveBeenCalledTimes(1);
	});

	it("uses a custom removeLabel for the remove button's accessible name", () => {
		render(
			<Badge onRemove={() => {}} removeLabel="Retirer Amphore">
				Amphore
			</Badge>
		);
		expect(
			screen.getByRole("button", { name: "Retirer Amphore" })
		).toBeInTheDocument();
	});

	it("forwards native span props and a custom className", () => {
		render(
			<Badge data-testid="badge" className="custom" aria-label="Statut">
				Actif
			</Badge>
		);
		const badge = screen.getByTestId("badge");
		expect(badge).toHaveClass("custom");
		expect(badge).toHaveAttribute("aria-label", "Statut");
	});
});
