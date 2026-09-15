import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { IUseFiltersContext, TFiltersModalGroup } from "@interfaces/index";

import { ActiveFilters } from "./ActiveFilters";

type TSlice = { status?: string | null; tags?: string[] };
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
		options: { countCallback: () => Object.keys(filters).length },
		...overrides,
	}) as unknown as IUseFiltersContext<T, "list", TSlice>;

const filterGroups: TFiltersModalGroup[] = [
	{
		fields: [
			{ name: "status", type: "select", label: "Statut", options: [] },
			{ name: "tags", type: "checkbox", label: "Tags", options: [] },
		],
	},
];

describe("ActiveFilters", () => {
	it("renders nothing without filters or rightContent", () => {
		const { container } = render(
			<ActiveFilters
				filters={[]}
				filtersContext={makeFiltersContext({})}
			/>
		);
		expect(container).toBeEmptyDOMElement();
	});

	it("renders a chip per active filter value", () => {
		render(
			<ActiveFilters
				filters={filterGroups}
				filtersContext={makeFiltersContext({ status: "open" })}
			/>
		);
		expect(screen.getByText(/Statut: open/)).toBeInTheDocument();
	});

	it("renders one chip per value for an array filter", () => {
		render(
			<ActiveFilters
				filters={filterGroups}
				filtersContext={makeFiltersContext({ tags: ["a", "b"] })}
			/>
		);
		expect(screen.getByText(/Tags: a/)).toBeInTheDocument();
		expect(screen.getByText(/Tags: b/)).toBeInTheDocument();
	});

	it("clears a single filter when its chip is removed", () => {
		const setFilter = vi.fn();
		render(
			<ActiveFilters
				filters={filterGroups}
				filtersContext={makeFiltersContext(
					{ status: "open" },
					{ setFilter }
				)}
			/>
		);
		screen.getByLabelText("Remove").click();
		expect(setFilter).toHaveBeenCalledWith("status", null);
	});

	it("resets to defaults on the global reset button", () => {
		const setFilters = vi.fn();
		render(
			<ActiveFilters
				filters={filterGroups}
				filtersContext={makeFiltersContext(
					{ status: "open" },
					{
						setFilters,
						options: {
							countCallback: () => 1,
							defaultValues: { status: null },
						},
					}
				)}
			/>
		);
		screen.getByRole("button", { name: "Reset" }).click();
		expect(setFilters).toHaveBeenCalledWith({ status: null }, true);
	});

	it("removes only the clicked value from an array filter, keeping the rest", () => {
		const setFilter = vi.fn();
		render(
			<ActiveFilters
				filters={filterGroups}
				filtersContext={makeFiltersContext(
					{ tags: ["a", "b"] },
					{ setFilter }
				)}
			/>
		);
		screen.getAllByLabelText("Remove")[0].click();
		expect(setFilter).toHaveBeenCalledWith("tags", ["b"]);
	});

	it("renders a period filter's implicit from/to chip and clears both sides on removal", () => {
		const setFilters = vi.fn();
		const periodGroups: TFiltersModalGroup[] = [
			{
				fields: [
					{
						name: "period",
						type: "period",
						label: "Période",
						from: { name: "start" },
						to: { name: "end" },
					},
				],
			},
		];
		render(
			<ActiveFilters
				filters={periodGroups}
				filtersContext={makeFiltersContext(
					{
						start: "2024-01-01",
						end: "2024-01-31",
					} as unknown as TSlice,
					{ setFilters }
				)}
			/>
		);
		expect(
			screen.getByText(/From 2024-01-01 to 2024-01-31/)
		).toBeInTheDocument();
		screen.getByLabelText("Remove").click();
		expect(setFilters).toHaveBeenCalledWith({
			start: null,
			end: null,
		});
	});

	it("uses a period filter's own getFieldValue to render its chip content", () => {
		const periodGroups: TFiltersModalGroup[] = [
			{
				fields: [
					{
						name: "period",
						type: "period",
						label: "Période",
						from: { name: "start" },
						to: { name: "end" },
						getFieldValue: ({
							from,
							to,
						}: {
							from: unknown;
							to: unknown;
						}) => `${String(from)} → ${String(to)}`,
					},
				],
			},
		];
		render(
			<ActiveFilters
				filters={periodGroups}
				filtersContext={makeFiltersContext({
					start: "2024-01-01",
					end: "2024-01-31",
				} as unknown as TSlice)}
			/>
		);
		expect(screen.getByText(/2024-01-01 → 2024-01-31/)).toBeInTheDocument();
	});

	it("uses a filter's own chip() to fully take over its chip content", () => {
		const groups: TFiltersModalGroup[] = [
			{
				fields: [
					{
						name: "status",
						type: "select",
						label: "Statut",
						options: [],
						chip: () => "Statut personnalisé",
					} as TFiltersModalGroup["fields"][number],
				],
			},
		];
		render(
			<ActiveFilters
				filters={groups}
				filtersContext={makeFiltersContext({ status: "open" })}
			/>
		);
		expect(screen.getByText("Statut personnalisé")).toBeInTheDocument();
	});

	it("uses a filter's own valueDisplay to format its chip's value part", () => {
		const groups: TFiltersModalGroup[] = [
			{
				fields: [
					{
						name: "status",
						type: "select",
						label: "Statut",
						options: [],
						valueDisplay: (value: unknown) =>
							`« ${String(value)} »`,
					} as TFiltersModalGroup["fields"][number],
				],
			},
		];
		render(
			<ActiveFilters
				filters={groups}
				filtersContext={makeFiltersContext({ status: "open" })}
			/>
		);
		expect(screen.getByText(/Statut: « open »/)).toBeInTheDocument();
	});

	it("shows rightContent even with zero active filters", () => {
		render(
			<ActiveFilters
				filters={[]}
				filtersContext={makeFiltersContext({})}
				rightContent={<span>Extra</span>}
			/>
		);
		expect(screen.getByText("Extra")).toBeInTheDocument();
	});

	it("expands to show every chip via 'Show more', then collapses via 'Show less'", () => {
		// The overflow logic bails out early (never hides anything) whenever
		// the container's clientWidth is falsy, which jsdom always reports
		// unless stubbed — scoped to this test only, since a global stub
		// would make every *other* test's chips wrongly overflow too (their
		// containers would report the same nonzero width as one chip).
		const clientWidthDescriptor = Object.getOwnPropertyDescriptor(
			HTMLElement.prototype,
			"clientWidth"
		);
		Object.defineProperty(HTMLElement.prototype, "clientWidth", {
			configurable: true,
			value: 300,
		});
		try {
			const manyTags = Array.from({ length: 20 }, (_, i) => `tag-${i}`);
			render(
				<ActiveFilters
					filters={filterGroups}
					filtersContext={makeFiltersContext({ tags: manyTags })}
				/>
			);
			const seeMore = screen.getByRole("button", { name: "Show more" });
			fireEvent.click(seeMore);
			expect(
				screen.getByRole("button", { name: "Show less" })
			).toBeInTheDocument();
			fireEvent.click(screen.getByRole("button", { name: "Show less" }));
			expect(
				screen.getByRole("button", { name: "Show more" })
			).toBeInTheDocument();
		} finally {
			if (clientWidthDescriptor) {
				Object.defineProperty(
					HTMLElement.prototype,
					"clientWidth",
					clientWidthDescriptor
				);
			}
		}
	});
});
