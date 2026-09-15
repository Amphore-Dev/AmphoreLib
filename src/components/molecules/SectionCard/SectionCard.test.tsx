import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SectionCard } from "./SectionCard";

describe("SectionCard", () => {
	it("renders the title as a heading", () => {
		render(<SectionCard title="Profil">Contenu</SectionCard>);
		expect(
			screen.getByRole("heading", { name: "Profil" })
		).toBeInTheDocument();
	});

	it("renders its children", () => {
		render(<SectionCard title="Profil">Contenu de la section</SectionCard>);
		expect(screen.getByText("Contenu de la section")).toBeInTheDocument();
	});

	it("renders actions when given", () => {
		render(
			<SectionCard title="Profil" actions={<button>Modifier</button>}>
				Contenu
			</SectionCard>
		);
		expect(
			screen.getByRole("button", { name: "Modifier" })
		).toBeInTheDocument();
	});

	it("doesn't render an actions wrapper without actions", () => {
		const { container } = render(
			<SectionCard title="Profil">Contenu</SectionCard>
		);
		expect(
			container.querySelector('[class*="actions"]')
		).not.toBeInTheDocument();
	});

	it("renders a separator between the header and the content", () => {
		render(<SectionCard title="Profil">Contenu</SectionCard>);
		expect(screen.getByRole("separator")).toBeInTheDocument();
	});

	it("forwards Card props (e.g. elevation) and a custom className", () => {
		const { container } = render(
			<SectionCard title="Profil" elevation={2} className="custom">
				Contenu
			</SectionCard>
		);
		const card = container.firstChild as HTMLElement;
		expect(card).toHaveAttribute("data-elevation", "2");
		expect(card).toHaveClass("custom");
	});
});
