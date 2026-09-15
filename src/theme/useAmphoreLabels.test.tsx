import React from "react";

import { render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "../components/atoms/Badge/Badge";

import { AmphoreDefaultsContext } from "./AmphoreDefaultsContext";
import { useAmphoreLabels } from "./useAmphoreLabels";

describe("useAmphoreLabels", () => {
	it("falls back to the en bundle (context default) with no provider at all", () => {
		const { result } = renderHook(() => useAmphoreLabels("Badge"));
		expect(result.current.resolve("removeLabel", undefined, "remove")).toBe(
			"Remove"
		);
	});

	it("common wins over the en default", () => {
		const { result } = renderHook(() => useAmphoreLabels("Badge"), {
			wrapper: ({ children }) => (
				<AmphoreDefaultsContext.Provider
					value={{ labels: { common: { remove: "Retirer" } } }}
				>
					{children}
				</AmphoreDefaultsContext.Provider>
			),
		});
		expect(result.current.resolve("removeLabel", undefined, "remove")).toBe(
			"Retirer"
		);
	});

	it("the component's own label wins over common", () => {
		const { result } = renderHook(() => useAmphoreLabels("Badge"), {
			wrapper: ({ children }) => (
				<AmphoreDefaultsContext.Provider
					value={{
						labels: {
							common: { remove: "Retirer" },
							Badge: { removeLabel: "Supprimer" },
						},
					}}
				>
					{children}
				</AmphoreDefaultsContext.Provider>
			),
		});
		expect(result.current.resolve("removeLabel", undefined, "remove")).toBe(
			"Supprimer"
		);
	});

	it("the instance prop wins over everything", () => {
		const { result } = renderHook(() => useAmphoreLabels("Badge"), {
			wrapper: ({ children }) => (
				<AmphoreDefaultsContext.Provider
					value={{
						labels: {
							common: { remove: "Retirer" },
							Badge: { removeLabel: "Supprimer" },
						},
					}}
				>
					{children}
				</AmphoreDefaultsContext.Provider>
			),
		});
		expect(result.current.resolve("removeLabel", "Discard", "remove")).toBe(
			"Discard"
		);
	});

	it("resolves end-to-end through real rendering", () => {
		render(
			<AmphoreDefaultsContext.Provider
				value={{ labels: { Badge: { removeLabel: "Retirer" } } }}
			>
				<Badge onRemove={() => {}}>MYD-1</Badge>
			</AmphoreDefaultsContext.Provider>
		);
		expect(
			screen.getByRole("button", { name: "Retirer" })
		).toBeInTheDocument();
	});
});
