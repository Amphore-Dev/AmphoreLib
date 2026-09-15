import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PageHeader } from "./PageHeader";

describe("PageHeader", () => {
	it("renders the title and count", () => {
		render(<PageHeader title="Commandes" totalCount={12} />);
		expect(screen.getByText("Commandes")).toBeInTheDocument();
		expect(screen.getByText("12 results")).toBeInTheDocument();
	});

	it("shows a loading label instead of the count while loading", () => {
		render(<PageHeader title="Commandes" isLoading totalCount={12} />);
		expect(screen.getByText("Loading...")).toBeInTheDocument();
	});

	it("calls onBack when the back button is clicked", () => {
		const onBack = vi.fn();
		render(<PageHeader title="Commandes" onBack={onBack} />);
		fireEvent.click(screen.getByRole("button", { name: "Back" }));
		expect(onBack).toHaveBeenCalled();
	});

	it("renders buttons and calls their onClick", () => {
		const onClick = vi.fn();
		render(
			<PageHeader
				title="Commandes"
				buttons={[{ label: "Créer", onClick }]}
			/>
		);
		fireEvent.click(screen.getByRole("button", { name: "Créer" }));
		expect(onClick).toHaveBeenCalled();
	});

	it("hides a button flagged as hidden", () => {
		render(
			<PageHeader
				title="Commandes"
				buttons={[{ label: "Créer", hidden: true }]}
			/>
		);
		expect(
			screen.queryByRole("button", { name: "Créer" })
		).not.toBeInTheDocument();
	});

	it("renders a search input and forwards changes", () => {
		const onSearchChange = vi.fn();
		render(
			<PageHeader
				title="Commandes"
				searchValue=""
				onSearchChange={onSearchChange}
			/>
		);
		expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
	});

	it("renders tabs and switches the active one", () => {
		const onSelectTab = vi.fn();
		render(
			<PageHeader
				title="Commandes"
				tabs={[
					{ value: "open", label: "Ouvertes" },
					{ value: "closed", label: "Fermées" },
				]}
				selectedTabId="open"
				onSelectTab={onSelectTab}
			/>
		);
		fireEvent.click(screen.getByRole("tab", { name: "Fermées" }));
		expect(onSelectTab).toHaveBeenCalledWith("closed");
	});

	it("uses a tab's own buttons when it's active (underTabs)", () => {
		const onClick = vi.fn();
		render(
			<PageHeader
				title="Commandes"
				tabs={[
					{
						value: "open",
						label: "Ouvertes",
						buttons: [{ label: "Action ouverte", onClick }],
					},
					{ value: "closed", label: "Fermées" },
				]}
				selectedTabId="open"
			/>
		);
		expect(
			screen.getByRole("button", { name: "Action ouverte" })
		).toBeInTheDocument();
	});
});
