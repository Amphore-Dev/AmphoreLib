import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AmphorePortal } from "./AmphorePortal";
import { AmphoreProvider } from "./AmphoreProvider";
import { AmphoreScope } from "./AmphoreScope";

describe("AmphoreScope", () => {
	it("renders children bare when no provider is above", () => {
		const { container } = render(
			<AmphoreScope>
				<span data-testid="probe">x</span>
			</AmphoreScope>
		);
		expect(screen.getByTestId("probe").parentElement).toBe(container);
		expect(
			container.querySelector("[data-amp-scope]")
		).not.toBeInTheDocument();
	});

	it("re-applies the nearest provider's scope attributes and CSS vars", () => {
		render(
			<AmphoreProvider
				theme="dark"
				config={{ colors: { primary: "#123456" } }}
			>
				<AmphoreScope>
					<span data-testid="probe">x</span>
				</AmphoreScope>
			</AmphoreProvider>
		);
		const root = document.querySelector(".amp-root") as HTMLElement;
		const scope = screen.getByTestId("probe").parentElement as HTMLElement;

		expect(scope).not.toBe(root);
		expect(scope).toHaveAttribute(
			"data-amp-scope",
			root.getAttribute("data-amp-scope")
		);
		expect(scope).toHaveAttribute("data-amp-theme", "dark");
		expect(scope).toHaveAttribute(
			"data-amp-density",
			root.getAttribute("data-amp-density")
		);
		expect(scope.style.getPropertyValue("--amp-color-primary")).toBe(
			"#123456"
		);
		expect(scope.getAttribute("style")).toBe(root.getAttribute("style"));
	});

	it("omits data-amp-theme in system mode, like the provider", () => {
		render(
			<AmphoreProvider>
				<AmphoreScope>
					<span data-testid="probe">x</span>
				</AmphoreScope>
			</AmphoreProvider>
		);
		expect(screen.getByTestId("probe").parentElement).not.toHaveAttribute(
			"data-amp-theme"
		);
	});

	it("follows the innermost provider when nested", () => {
		render(
			<AmphoreProvider theme="dark">
				<AmphoreProvider theme="light">
					<AmphoreScope>
						<span data-testid="probe">x</span>
					</AmphoreScope>
				</AmphoreProvider>
			</AmphoreProvider>
		);
		const roots = document.querySelectorAll(".amp-root");
		const inner = roots[1];
		const scope = screen.getByTestId("probe").parentElement;
		expect(scope).toHaveAttribute("data-amp-theme", "light");
		expect(scope).toHaveAttribute(
			"data-amp-scope",
			inner.getAttribute("data-amp-scope")
		);
	});
});

describe("AmphorePortal", () => {
	it("renders outside the provider's DOM, with the scope re-applied", () => {
		render(
			<AmphoreProvider theme="light">
				<AmphorePortal>
					<span data-testid="probe">x</span>
				</AmphorePortal>
			</AmphoreProvider>
		);
		const root = document.querySelector(".amp-root") as HTMLElement;
		const probe = screen.getByTestId("probe");

		expect(root.contains(probe)).toBe(false);
		expect(document.body.contains(probe)).toBe(true);

		const scope = probe.closest("[data-amp-scope]") as HTMLElement;
		expect(scope).toBeInTheDocument();
		expect(root.contains(scope)).toBe(false);
		expect(scope).toHaveAttribute(
			"data-amp-scope",
			root.getAttribute("data-amp-scope")
		);
		expect(scope).toHaveAttribute("data-amp-theme", "light");
		expect(scope.getAttribute("style")).toBe(root.getAttribute("style"));
	});

	it("honors an explicit root", () => {
		const target = document.createElement("div");
		document.body.appendChild(target);
		try {
			render(
				<AmphoreProvider>
					<AmphorePortal root={target}>
						<span data-testid="probe">x</span>
					</AmphorePortal>
				</AmphoreProvider>
			);
			expect(target.contains(screen.getByTestId("probe"))).toBe(true);
		} finally {
			target.remove();
		}
	});
});
