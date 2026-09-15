import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { Progress } from "./Progress";

describe("Progress", () => {
	it("renders role=progressbar with the given value", () => {
		render(<Progress value={40} label="Téléchargement" />);
		const bar = screen.getByRole("progressbar");
		expect(bar).toHaveAttribute("aria-valuenow", "40");
		expect(bar).toHaveAttribute("aria-valuemin", "0");
		expect(bar).toHaveAttribute("aria-valuemax", "100");
	});

	it("clamps value between 0 and 100", () => {
		const { rerender } = render(<Progress value={150} />);
		expect(screen.getByRole("progressbar")).toHaveAttribute(
			"aria-valuenow",
			"100"
		);
		rerender(<Progress value={-20} />);
		expect(screen.getByRole("progressbar")).toHaveAttribute(
			"aria-valuenow",
			"0"
		);
	});

	it("defaults value to 0 when not given", () => {
		render(<Progress />);
		expect(screen.getByRole("progressbar")).toHaveAttribute(
			"aria-valuenow",
			"0"
		);
	});

	it("has no aria-valuenow when indeterminate", () => {
		render(<Progress indeterminate />);
		expect(screen.getByRole("progressbar")).not.toHaveAttribute(
			"aria-valuenow"
		);
	});

	it("shows a rounded percentage label when showValue is true", () => {
		render(<Progress value={33.7} showValue />);
		expect(screen.getByText("34%")).toBeInTheDocument();
	});

	it("does not show a value label when indeterminate, even with showValue", () => {
		render(<Progress indeterminate showValue />);
		expect(screen.queryByText(/%/)).not.toBeInTheDocument();
	});

	it("defaults to size=md", () => {
		render(<Progress />);
		expect(screen.getByRole("progressbar")).toHaveAttribute(
			"data-size",
			"md"
		);
	});

	it("falls back to AmphoreProvider's config.defaults.size when no size prop is given", () => {
		render(
			<AmphoreProvider config={{ defaults: { size: "lg" } }}>
				<Progress />
			</AmphoreProvider>
		);
		expect(screen.getByRole("progressbar")).toHaveAttribute(
			"data-size",
			"lg"
		);
	});

	it("an explicit size prop wins over AmphoreProvider's default", () => {
		render(
			<AmphoreProvider config={{ defaults: { size: "lg" } }}>
				<Progress size="sm" />
			</AmphoreProvider>
		);
		expect(screen.getByRole("progressbar")).toHaveAttribute(
			"data-size",
			"sm"
		);
	});
});
