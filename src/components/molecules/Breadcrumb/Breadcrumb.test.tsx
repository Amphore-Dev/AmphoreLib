import React from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Breadcrumb } from "./Breadcrumb";

describe("Breadcrumb", () => {
	it("renders nothing when items is empty", () => {
		const { container } = render(<Breadcrumb items={[]} />);
		expect(container).toBeEmptyDOMElement();
	});

	it("renders nothing when every item is hidden", () => {
		const { container } = render(
			<Breadcrumb items={[{ label: "Accueil", hidden: true }]} />
		);
		expect(container).toBeEmptyDOMElement();
	});

	it("renders every visible item's label", () => {
		render(
			<Breadcrumb
				items={[
					{ label: "Accueil", href: "/" },
					{ label: "Projets", href: "/projects" },
					{ label: "Site vitrine" },
				]}
			/>
		);
		expect(screen.getByText("Accueil")).toBeInTheDocument();
		expect(screen.getByText("Projets")).toBeInTheDocument();
		expect(screen.getByText("Site vitrine")).toBeInTheDocument();
	});

	it("drops a hidden entry from the middle of the trail", () => {
		render(
			<Breadcrumb
				items={[
					{ label: "Accueil", href: "/" },
					{ label: "Masqué", href: "/x", hidden: true },
					{ label: "Projets" },
				]}
			/>
		);
		expect(screen.queryByText("Masqué")).not.toBeInTheDocument();
	});

	it("renders a real link for every entry except the last", () => {
		render(
			<Breadcrumb
				items={[
					{ label: "Accueil", href: "/" },
					{ label: "Projets", href: "/projects" },
					{ label: "Site vitrine", href: "/projects/1" },
				]}
			/>
		);
		expect(screen.getByRole("link", { name: "Accueil" })).toHaveAttribute(
			"href",
			"/"
		);
		expect(screen.getByRole("link", { name: "Projets" })).toHaveAttribute(
			"href",
			"/projects"
		);
		// Last entry is the current page — never a link, even with an href.
		expect(
			screen.queryByRole("link", { name: "Site vitrine" })
		).not.toBeInTheDocument();
		expect(screen.getByText("Site vitrine")).toHaveAttribute(
			"aria-current",
			"page"
		);
	});

	it("renders a plain (non-link) entry when it has no href, even mid-trail", () => {
		render(
			<Breadcrumb
				items={[
					{ label: "Accueil", href: "/" },
					{ label: "Sans lien" },
					{ label: "Actuel" },
				]}
			/>
		);
		expect(
			screen.queryByRole("link", { name: "Sans lien" })
		).not.toBeInTheDocument();
		expect(screen.getByText("Sans lien")).toBeInTheDocument();
	});

	it("renders a separator between entries, but not after the last one", () => {
		const { container } = render(
			<Breadcrumb
				items={[
					{ label: "Accueil", href: "/" },
					{ label: "Projets", href: "/projects" },
					{ label: "Actuel" },
				]}
				separator=">"
			/>
		);
		const separators = container.querySelectorAll("[aria-hidden]");
		expect(separators).toHaveLength(2);
		separators.forEach((el) => expect(el).toHaveTextContent(">"));
	});
});
