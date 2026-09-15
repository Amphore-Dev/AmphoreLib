import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "../components/atoms/Badge/Badge";

import { AmphoreProvider } from "./AmphoreProvider";

describe("AmphoreProvider theme", () => {
	it("sets no data-amp-theme by default (system mode)", () => {
		render(
			<AmphoreProvider>
				<span data-testid="probe">x</span>
			</AmphoreProvider>
		);
		expect(
			screen.getByTestId("probe").closest(".amp-root")
		).not.toHaveAttribute("data-amp-theme");
	});

	it("sets data-amp-theme='dark' when theme='dark'", () => {
		render(
			<AmphoreProvider theme="dark">
				<span data-testid="probe">x</span>
			</AmphoreProvider>
		);
		expect(
			screen.getByTestId("probe").closest(".amp-root")
		).toHaveAttribute("data-amp-theme", "dark");
	});

	it("sets data-amp-theme='light' when theme='light'", () => {
		render(
			<AmphoreProvider theme="light">
				<span data-testid="probe">x</span>
			</AmphoreProvider>
		);
		expect(
			screen.getByTestId("probe").closest(".amp-root")
		).toHaveAttribute("data-amp-theme", "light");
	});

	it("gives nested providers distinct scope ids, each with its own <style> block", () => {
		render(
			<AmphoreProvider theme="dark">
				<AmphoreProvider
					theme="dark"
					config={{ darkColors: { primary: "#123456" } }}
				>
					<span data-testid="inner">x</span>
				</AmphoreProvider>
			</AmphoreProvider>
		);
		const inner = screen
			.getByTestId("inner")
			.closest(".amp-root") as HTMLElement;
		const outerScope = inner.parentElement
			?.closest(".amp-root")
			?.getAttribute("data-amp-scope");
		const innerScope = inner.getAttribute("data-amp-scope");
		expect(innerScope).toBeTruthy();
		expect(innerScope).not.toBe(outerScope);
	});
});

describe("AmphoreProvider locale", () => {
	it("applies the fr bundle when locale='fr'", () => {
		render(
			<AmphoreProvider locale="fr">
				<Badge onRemove={() => {}}>MYD-1</Badge>
			</AmphoreProvider>
		);
		expect(
			screen.getByRole("button", { name: "Retirer" })
		).toBeInTheDocument();
	});

	it("stays English with no locale prop", () => {
		render(
			<AmphoreProvider>
				<Badge onRemove={() => {}}>MYD-1</Badge>
			</AmphoreProvider>
		);
		expect(
			screen.getByRole("button", { name: "Remove" })
		).toBeInTheDocument();
	});

	it("config.labels overrides a single key on top of locale='fr'", () => {
		render(
			<AmphoreProvider
				locale="fr"
				config={{ labels: { Badge: { removeLabel: "Supprimer" } } }}
			>
				<Badge onRemove={() => {}}>MYD-1</Badge>
			</AmphoreProvider>
		);
		expect(
			screen.getByRole("button", { name: "Supprimer" })
		).toBeInTheDocument();
	});
});
