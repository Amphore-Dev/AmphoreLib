import React from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AmphoreProvider } from "./AmphoreProvider";
import { useAmphoreDefaults } from "./useAmphoreDefaults";

function Probe() {
	const defaults = useAmphoreDefaults();
	return <span data-testid="probe">{defaults.size ?? "none"}</span>;
}

describe("useAmphoreDefaults", () => {
	it("returns an empty object outside any provider", () => {
		render(<Probe />);
		expect(screen.getByTestId("probe")).toHaveTextContent("none");
	});

	it("reads config.defaults.size from the nearest AmphoreProvider", () => {
		render(
			<AmphoreProvider config={{ defaults: { size: "sm" } }}>
				<Probe />
			</AmphoreProvider>
		);
		expect(screen.getByTestId("probe")).toHaveTextContent("sm");
	});

	it("the innermost provider wins for nested providers", () => {
		render(
			<AmphoreProvider config={{ defaults: { size: "lg" } }}>
				<AmphoreProvider config={{ defaults: { size: "sm" } }}>
					<Probe />
				</AmphoreProvider>
			</AmphoreProvider>
		);
		expect(screen.getByTestId("probe")).toHaveTextContent("sm");
	});
});
