import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { IUseFiltersContext, TField } from "@interfaces/index";

import { FiltersModal } from "./FiltersModal";

type TSlice = { status?: string | null };
type T = { list: TSlice };

const makeFiltersContext = (
	filters: TSlice,
	overrides: Partial<IUseFiltersContext<T, "list", TSlice>> = {}
): IUseFiltersContext<T, "list", TSlice> =>
	({
		filters,
		filtersKey: "list",
		setFilters: vi.fn(),
		setFilter: vi.fn(),
		options: {},
		...overrides,
	}) as unknown as IUseFiltersContext<T, "list", TSlice>;

const fields: TField[] = [{ name: "status", type: "input", label: "Statut" }];

describe("FiltersModal", () => {
	it("renders nothing when there are no fields", () => {
		const { container } = render(
			<FiltersModal
				filters={[]}
				filtersContext={makeFiltersContext({})}
			/>
		);
		expect(container).toBeEmptyDOMElement();
	});

	it("shows the active filters count as a badge", () => {
		render(
			<FiltersModal
				filters={fields}
				filtersContext={makeFiltersContext(
					{ status: "open" },
					{ options: { countCallback: () => 2 } }
				)}
			/>
		);
		expect(screen.getByText("2")).toBeInTheDocument();
	});

	it("opens the modal on click", () => {
		render(
			<FiltersModal
				filters={fields}
				filtersContext={makeFiltersContext({})}
			/>
		);
		fireEvent.click(screen.getByRole("button", { name: /Filter/ }));
		expect(screen.getByLabelText("Statut")).toBeInTheDocument();
	});

	it("applies filters and closes on submit", async () => {
		const setFilters = vi.fn();
		const onApply = vi.fn();
		render(
			<FiltersModal
				filters={fields}
				onApply={onApply}
				filtersContext={makeFiltersContext({}, { setFilters })}
			/>
		);
		fireEvent.click(screen.getByRole("button", { name: /Filter/ }));
		fireEvent.change(screen.getByLabelText("Statut"), {
			target: { value: "closed" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Apply" }));
		await screen.findByRole("button", { name: /Filter/ });
		expect(setFilters).toHaveBeenCalledWith({ status: "closed" }, true);
		expect(onApply).toHaveBeenCalledWith({ status: "closed" });
	});

	it("shows a reset-form button in the modal", () => {
		render(
			<FiltersModal
				filters={fields}
				filtersContext={makeFiltersContext({})}
			/>
		);
		fireEvent.click(screen.getByRole("button", { name: /Filter/ }));
		expect(
			screen.getByRole("button", { name: "Reset filters" })
		).toBeInTheDocument();
	});
});
