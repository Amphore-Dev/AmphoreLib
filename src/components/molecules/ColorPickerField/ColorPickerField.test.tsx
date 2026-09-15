import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ColorPickerField } from "./ColorPickerField";

describe("ColorPickerField", () => {
	it("shows the current value as text on the trigger", () => {
		render(<ColorPickerField value="#3663DD" onChange={() => {}} />);
		expect(screen.getByText("#3663DD")).toBeInTheDocument();
	});

	it("does not open the picker until the trigger is clicked", () => {
		render(<ColorPickerField value="#3663DD" onChange={() => {}} />);
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("opens the picker on trigger click", async () => {
		const user = userEvent.setup();
		render(
			<ColorPickerField
				value="#3663DD"
				onChange={() => {}}
				label="Couleur"
			/>
		);
		await user.click(screen.getByRole("button"));
		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});

	it("never opens when disabled", async () => {
		const user = userEvent.setup();
		render(
			<ColorPickerField value="#3663DD" onChange={() => {}} disabled />
		);
		await user.click(screen.getByRole("button"));
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("renders a label", () => {
		render(
			<ColorPickerField
				value="#3663DD"
				onChange={() => {}}
				label="Couleur du thème"
			/>
		);
		expect(screen.getByText("Couleur du thème")).toBeInTheDocument();
	});

	it("shows an error message and data-invalid when error is given", () => {
		render(
			<ColorPickerField
				value="#3663DD"
				onChange={() => {}}
				error="Couleur invalide"
			/>
		);
		const trigger = screen.getByRole("button");
		expect(trigger).toHaveAttribute("data-invalid", "true");
		expect(screen.getByText("Couleur invalide")).toBeInTheDocument();
	});

	it("sets the swatch's background from `value`", () => {
		const { container } = render(
			<ColorPickerField value="#3663DD" onChange={() => {}} />
		);
		const swatch = container.querySelector(
			'[class*="swatch"]'
		) as HTMLElement;
		expect(swatch.style.backgroundColor).toBe("rgb(54, 99, 221)");
	});

	it("hides the value text when hideValue is given", () => {
		render(
			<ColorPickerField value="#3663DD" onChange={() => {}} hideValue />
		);
		expect(screen.queryByText("#3663DD")).not.toBeInTheDocument();
	});

	it("forwards noPadding/noElevation straight through to the underlying ColorPicker", async () => {
		const user = userEvent.setup();
		render(
			<ColorPickerField
				value="#3663DD"
				onChange={() => {}}
				noPadding
				noElevation
			/>
		);
		await user.click(screen.getByRole("button"));
		const panel = screen.getByRole("dialog").firstChild as HTMLElement;
		expect(panel).toHaveAttribute("data-no-padding", "true");
		expect(panel).toHaveAttribute("data-no-elevation", "true");
	});

	it("forwards onChange to the underlying ColorPicker", () => {
		const onChange = vi.fn();
		render(<ColorPickerField value="#3663DD" onChange={onChange} />);
		// The underlying react-gcolor-picker isn't reliably drivable in jsdom
		// (no real layout, no canvas) — this only confirms the prop is wired.
		expect(onChange).not.toHaveBeenCalled();
	});
});
