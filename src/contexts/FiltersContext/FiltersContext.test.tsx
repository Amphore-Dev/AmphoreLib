import React from "react";

import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createFiltersContext } from "./FiltersContext";

type TPlanningFilters = { status?: string | null; tab?: string };
type TSlices = { planning: TPlanningFilters };

const { Provider, useFiltersContext } = createFiltersContext<TSlices>();

const Consumer: React.FC<{
	updateUrlParams?: boolean;
	onReady?: (ctx: ReturnType<typeof useFiltersContext<"planning">>) => void;
}> = ({ updateUrlParams = false, onReady }) => {
	const ctx = useFiltersContext("planning", {
		updateUrlParams,
		params: { status: true },
	});
	onReady?.(ctx);
	return (
		<div>
			<span data-testid="status">{ctx.filters.status ?? "∅"}</span>
			<span data-testid="page">{ctx.filters.page}</span>
			<button onClick={() => ctx.setFilter("status", "open")}>
				setStatus
			</button>
		</div>
	);
};

describe("createFiltersContext / useFiltersContext", () => {
	beforeEach(() => {
		window.sessionStorage.clear();
		window.history.replaceState(null, "", "/");
	});
	afterEach(() => {
		window.history.replaceState(null, "", "/");
	});

	it("starts from the slice's default values", () => {
		render(
			<Provider defaultFilters={{ planning: { status: null } }}>
				<Consumer />
			</Provider>
		);
		expect(screen.getByTestId("status")).toHaveTextContent("∅");
	});

	it("updates a single filter via setFilter and resets the page", () => {
		render(
			<Provider defaultFilters={{ planning: { status: null } }}>
				<Consumer />
			</Provider>
		);
		act(() => screen.getByText("setStatus").click());
		expect(screen.getByTestId("status")).toHaveTextContent("open");
		expect(screen.getByTestId("page")).toHaveTextContent("1");
	});

	it("persists filters to sessionStorage under the given storageKey", () => {
		render(
			<Provider
				defaultFilters={{ planning: { status: null } }}
				storageKey="test-filters"
			>
				<Consumer />
			</Provider>
		);
		act(() => screen.getByText("setStatus").click());
		const saved = JSON.parse(
			window.sessionStorage.getItem("test-filters") || "{}"
		);
		expect(saved.planning.status).toBe("open");
	});

	it("doesn't throw when sessionStorage access fails (e.g. private browsing)", () => {
		const original = window.sessionStorage.setItem;
		window.sessionStorage.setItem = () => {
			throw new DOMException("QuotaExceededError");
		};
		expect(() =>
			render(
				<Provider
					defaultFilters={{ planning: { status: null } }}
					storageKey="test-filters"
				>
					<Consumer />
				</Provider>
			)
		).not.toThrow();
		window.sessionStorage.setItem = original;
	});

	it("syncs the URL from state once updateUrlParams is on, without a setTimeout race", () => {
		render(
			<Provider defaultFilters={{ planning: { status: null } }}>
				<Consumer updateUrlParams />
			</Provider>
		);
		// The init effect resolves synchronously (no `setTimeout` guard) — a
		// change fired right after mount must already sync through, not be
		// dropped by a sync effect that thinks init hasn't happened yet.
		act(() => screen.getByText("setStatus").click());
		expect(window.location.search).toContain("status=open");
	});

	it("initializes state from an existing URL param", () => {
		window.history.replaceState(null, "", "/?status=closed");
		render(
			<Provider defaultFilters={{ planning: { status: null } }}>
				<Consumer updateUrlParams />
			</Provider>
		);
		expect(screen.getByTestId("status")).toHaveTextContent("closed");
	});

	describe("a key declared false in params", () => {
		const ParamsConsumer: React.FC<{
			onReady?: (
				ctx: ReturnType<typeof useFiltersContext<"planning">>
			) => void;
		}> = ({ onReady }) => {
			const ctx = useFiltersContext("planning", {
				updateUrlParams: true,
				params: { status: true, tab: false, page: false },
			});
			onReady?.(ctx);
			return (
				<div>
					<span data-testid="tab">{ctx.filters.tab ?? "∅"}</span>
					<button onClick={() => ctx.setFilter("tab", "details")}>
						setTab
					</button>
					<button onClick={() => ctx.setFilter("status", "open")}>
						setStatus
					</button>
				</div>
			);
		};

		const renderParams = (
			onReady?: React.ComponentProps<typeof ParamsConsumer>["onReady"]
		) =>
			render(
				<Provider
					defaultFilters={{ planning: { status: null, tab: "main" } }}
				>
					<ParamsConsumer onReady={onReady} />
				</Provider>
			);

		it("is never written to the URL", () => {
			renderParams();
			act(() => screen.getByText("setTab").click());
			act(() => screen.getByText("setStatus").click());
			expect(screen.getByTestId("tab")).toHaveTextContent("details");
			expect(window.location.search).toBe("?status=open");
		});

		it("is removed from the URL, next to no other managed param", () => {
			window.history.replaceState(null, "", "/?tab=old&other=1");
			renderParams();
			expect(window.location.search).toBe("?other=1");
		});

		it("is removed from the URL, next to a managed param", () => {
			window.history.replaceState(null, "", "/?tab=old&status=closed");
			renderParams();
			expect(window.location.search).toBe("?status=closed");
		});

		it("isn't read from the URL", () => {
			window.history.replaceState(null, "", "/?tab=old&status=closed");
			renderParams();
			expect(screen.getByTestId("tab")).toHaveTextContent("main");
		});

		it("stays out of getParams, except the pagination a request needs", () => {
			let ctx: ReturnType<typeof useFiltersContext<"planning">>;
			renderParams((next) => {
				ctx = next;
			});
			act(() => screen.getByText("setTab").click());
			act(() => ctx.setPagination({ page: 3 }));
			expect(ctx!.getParams()).toEqual({ limit: "20", page: "3" });
			expect(ctx!.getQueryKeys()).toContain("page=3");
		});
	});

	it("leaves a key missing from params alone in the URL", () => {
		window.history.replaceState(null, "", "/?other=1");
		render(
			<Provider defaultFilters={{ planning: { status: null } }}>
				<Consumer updateUrlParams />
			</Provider>
		);
		act(() => screen.getByText("setStatus").click());
		expect(window.location.search).toBe("?other=1&status=open");
	});

	it("throws when used outside a Provider", () => {
		const BadConsumer = () => {
			useFiltersContext("planning");
			return null;
		};
		expect(() => render(<BadConsumer />)).toThrow(
			/must be used within a FiltersProvider/
		);
	});
});
