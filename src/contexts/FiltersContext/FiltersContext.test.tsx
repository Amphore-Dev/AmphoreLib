import React from "react";

import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createFiltersContext } from "./FiltersContext";

type TPlanningFilters = { status?: string | null };
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
