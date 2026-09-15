import React from "react";

import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { useStandaloneSearchParams } from "./useStandaloneSearchParams";

const TestComponent = () => {
	const adapter = useStandaloneSearchParams();
	return (
		<div>
			<span data-testid="foo">{adapter.getParam("foo") ?? "∅"}</span>
			<button
				onClick={() =>
					adapter.setParams((prev) => {
						const next = new URLSearchParams(prev);
						next.set("foo", "bar");
						return next;
					})
				}
			>
				set
			</button>
			<button
				onClick={() =>
					adapter.setParams(
						(prev) => {
							const next = new URLSearchParams(prev);
							next.set("foo", "pushed");
							return next;
						},
						{ replace: false }
					)
				}
			>
				push
			</button>
		</div>
	);
};

describe("useStandaloneSearchParams", () => {
	beforeEach(() => {
		window.history.replaceState(null, "", "/page");
	});
	afterEach(() => {
		window.history.replaceState(null, "", "/");
	});

	it("reads an absent param as undefined", () => {
		render(<TestComponent />);
		expect(screen.getByTestId("foo")).toHaveTextContent("∅");
	});

	it("reads an existing URL param", () => {
		window.history.replaceState(null, "", "/page?foo=baz");
		render(<TestComponent />);
		expect(screen.getByTestId("foo")).toHaveTextContent("baz");
	});

	it("updates the URL and re-renders on setParams (replace)", () => {
		render(<TestComponent />);
		act(() => screen.getByText("set").click());
		expect(screen.getByTestId("foo")).toHaveTextContent("bar");
		expect(window.location.search).toBe("?foo=bar");
	});

	it("uses history.pushState when replace is false", () => {
		render(<TestComponent />);
		const lengthBefore = window.history.length;
		act(() => screen.getByText("push").click());
		expect(window.history.length).toBeGreaterThan(lengthBefore);
		expect(screen.getByTestId("foo")).toHaveTextContent("pushed");
	});
});
