import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Slider } from "./Slider";

describe("Slider", () => {
	it("renders the current value as the input's value", () => {
		render(<Slider label="Volume" value={40} onChange={() => {}} />);
		expect(screen.getByRole("slider")).toHaveValue("40");
	});

	it("shows the label and the current value by default", () => {
		render(<Slider label="Volume" value={40} onChange={() => {}} />);
		expect(screen.getByText("Volume")).toBeInTheDocument();
		expect(screen.getByText("40")).toBeInTheDocument();
	});

	it("hides the value display when showValue=false", () => {
		render(
			<Slider
				label="Volume"
				value={40}
				onChange={() => {}}
				showValue={false}
			/>
		);
		expect(screen.queryByText("40")).not.toBeInTheDocument();
	});

	it("calls onChange with a number on drag/change", () => {
		const onChange = vi.fn();
		render(<Slider label="Volume" value={40} onChange={onChange} />);
		fireEvent.change(screen.getByRole("slider"), {
			target: { value: "75" },
		});
		expect(onChange).toHaveBeenCalledWith(75);
	});

	it("respects min/max/step", () => {
		render(
			<Slider
				label="Volume"
				value={5}
				onChange={() => {}}
				min={0}
				max={10}
				step={5}
			/>
		);
		const slider = screen.getByRole("slider");
		expect(slider).toHaveAttribute("min", "0");
		expect(slider).toHaveAttribute("max", "10");
		expect(slider).toHaveAttribute("step", "5");
	});

	it("doesn't render a visible thumb by default", () => {
		const { container } = render(
			<Slider label="Volume" value={40} onChange={() => {}} />
		);
		expect(
			container.querySelector('[class*="thumb"]')
		).not.toBeInTheDocument();
	});

	it("renders a visible thumb when showThumb is given", () => {
		const { container } = render(
			<Slider label="Volume" value={40} onChange={() => {}} showThumb />
		);
		expect(container.querySelector('[class*="thumb"]')).toBeInTheDocument();
	});

	it("centered mode grows the fill from the middle of the range", () => {
		const { container } = render(
			<Slider
				label="Balance"
				value={75}
				onChange={() => {}}
				min={0}
				max={100}
				centered
			/>
		);
		const fill = container.querySelector('[class*="fill"]') as HTMLElement;
		expect(fill.style.left).toBe("50%");
		expect(fill.style.width).toBe("25%");
	});

	it("disables the input when disabled", () => {
		render(
			<Slider label="Volume" value={40} onChange={() => {}} disabled />
		);
		expect(screen.getByRole("slider")).toBeDisabled();
	});

	it("shows an error message and aria-invalid when error is given", () => {
		render(
			<Slider
				label="Volume"
				value={40}
				onChange={() => {}}
				error="Valeur invalide"
			/>
		);
		const slider = screen.getByRole("slider");
		expect(slider).toHaveAttribute("aria-invalid", "true");
		expect(slider).toHaveAttribute("aria-describedby");
		expect(screen.getByText("Valeur invalide")).toBeInTheDocument();
	});
});
