import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ColorPicker } from "./ColorPicker";

describe("ColorPicker", () => {
	it("renders without crashing and shows a text input for the value", () => {
		render(<ColorPicker value="#ff0000" onChange={() => {}} />);
		expect(screen.getAllByRole("textbox").length).toBeGreaterThan(0);
	});

	it("forwards a custom className to the wrapper", () => {
		const { container } = render(
			<ColorPicker
				value="#ff0000"
				onChange={() => {}}
				className="custom"
			/>
		);
		expect(container.querySelector(".custom")).toBeInTheDocument();
	});

	it("sets data-no-padding when noPadding is given", () => {
		const { container } = render(
			<ColorPicker value="#ff0000" onChange={() => {}} noPadding />
		);
		expect(container.firstChild).toHaveAttribute("data-no-padding", "true");
	});

	it("sets data-no-elevation when noElevation is given", () => {
		const { container } = render(
			<ColorPicker value="#ff0000" onChange={() => {}} noElevation />
		);
		expect(container.firstChild).toHaveAttribute(
			"data-no-elevation",
			"true"
		);
	});

	it("accepts an onChange callback without crashing", () => {
		const onChange = vi.fn();
		render(<ColorPicker value="#00ff00" onChange={onChange} />);
		// react-gcolor-picker's internal interaction surface (swatches, hue/
		// saturation canvas) isn't reliably drivable in jsdom (no real layout,
		// no canvas) — this only confirms the wiring doesn't throw on mount.
		expect(onChange).not.toHaveBeenCalled();
	});
});
