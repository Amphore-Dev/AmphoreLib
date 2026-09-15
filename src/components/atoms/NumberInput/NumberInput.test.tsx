import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { NumberInput } from "./NumberInput";

describe("NumberInput", () => {
	it("renders the given value as text", () => {
		render(<NumberInput label="Quantité" value={5} onChange={() => {}} />);
		expect(screen.getByLabelText("Quantité")).toHaveValue("5");
	});

	it("renders an empty field when value is null", () => {
		render(
			<NumberInput label="Quantité" value={null} onChange={() => {}} />
		);
		expect(screen.getByLabelText("Quantité")).toHaveValue("");
	});

	it("calls onChange live while typing a complete number", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<NumberInput label="Quantité" value={null} onChange={onChange} />
		);
		await user.type(screen.getByLabelText("Quantité"), "42");
		expect(onChange).toHaveBeenLastCalledWith(42);
	});

	it("allows typing a bare '-' or a trailing '.' without committing yet", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<NumberInput label="Quantité" value={null} onChange={onChange} />
		);
		const input = screen.getByLabelText("Quantité");
		await user.type(input, "-");
		expect(input).toHaveValue("-");
		expect(onChange).not.toHaveBeenCalled();
	});

	it("on blur, commits null for an empty or incomplete value", () => {
		const onChange = vi.fn();
		render(
			<NumberInput label="Quantité" value={null} onChange={onChange} />
		);
		const input = screen.getByLabelText("Quantité");
		fireEvent.change(input, { target: { value: "-" } });
		fireEvent.blur(input);
		expect(onChange).toHaveBeenCalledWith(null);
	});

	it("on blur, clamps the value to min/max", () => {
		const onChange = vi.fn();
		render(
			<NumberInput
				label="Quantité"
				value={null}
				onChange={onChange}
				min={0}
				max={10}
			/>
		);
		const input = screen.getByLabelText("Quantité");
		fireEvent.change(input, { target: { value: "999" } });
		fireEvent.blur(input);
		expect(onChange).toHaveBeenCalledWith(10);
	});

	it("increments by step when the up stepper is clicked", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<NumberInput
				label="Quantité"
				value={3}
				onChange={onChange}
				step={2}
			/>
		);
		await user.click(screen.getByRole("button", { name: "Increase" }));
		expect(onChange).toHaveBeenCalledWith(5);
	});

	it("decrements by step when the down stepper is clicked", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<NumberInput label="Quantité" value={3} onChange={onChange} />);
		await user.click(screen.getByRole("button", { name: "Decrease" }));
		expect(onChange).toHaveBeenCalledWith(2);
	});

	it("treats a null value as 0 when stepping", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<NumberInput label="Quantité" value={null} onChange={onChange} />
		);
		await user.click(screen.getByRole("button", { name: "Increase" }));
		expect(onChange).toHaveBeenCalledWith(1);
	});

	it("disables the up stepper at max, and the down stepper at min", () => {
		render(
			<NumberInput
				label="Quantité"
				value={5}
				onChange={() => {}}
				min={0}
				max={5}
			/>
		);
		expect(screen.getByRole("button", { name: "Increase" })).toBeDisabled();
		expect(
			screen.getByRole("button", { name: "Decrease" })
		).not.toBeDisabled();
	});

	it("disables both steppers and the field when disabled", () => {
		render(
			<NumberInput
				label="Quantité"
				value={5}
				onChange={() => {}}
				disabled
			/>
		);
		expect(screen.getByLabelText("Quantité")).toBeDisabled();
		expect(screen.getByRole("button", { name: "Increase" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "Decrease" })).toBeDisabled();
	});

	it("displays the decimal separator for the en-US default locale", () => {
		render(<NumberInput label="Prix" value={12.5} onChange={() => {}} />);
		expect(screen.getByLabelText("Prix")).toHaveValue("12.5");
	});

	it("groups thousands when at rest (not focused)", () => {
		render(
			<NumberInput label="Montant" value={1234.5} onChange={() => {}} />
		);
		const shown = (screen.getByLabelText("Montant") as HTMLInputElement)
			.value;
		expect(shown).toBe("1,234.5");
	});

	it("pads/rounds to a fixed decimals count once committed", async () => {
		const user = userEvent.setup();
		render(
			<NumberInput
				label="Prix"
				value={5}
				onChange={() => {}}
				decimals={2}
			/>
		);
		await user.click(screen.getByRole("button", { name: "Increase" }));
		expect(screen.getByLabelText("Prix")).toHaveValue("6.00");
	});

	it("switches to the plain, group-separator-free form on focus for easy editing", () => {
		render(
			<NumberInput label="Montant" value={1234.5} onChange={() => {}} />
		);
		const input = screen.getByLabelText("Montant");
		fireEvent.focus(input);
		expect(input).toHaveValue("1234.5");
	});

	it("accepts a period as the decimal separator while typing (en-US)", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<NumberInput label="Prix" value={null} onChange={onChange} />);
		await user.type(screen.getByLabelText("Prix"), "3.5");
		expect(onChange).toHaveBeenLastCalledWith(3.5);
	});

	it("renders the after node when given, after the steppers", () => {
		render(
			<NumberInput
				label="Durée"
				value={25}
				onChange={() => {}}
				after="j"
			/>
		);
		expect(screen.getByText("j")).toBeInTheDocument();
	});

	it("renders no after slot when not given", () => {
		render(<NumberInput label="Quantité" value={5} onChange={() => {}} />);
		expect(screen.queryByText("j")).not.toBeInTheDocument();
	});

	it("shows an error message and aria-invalid when error is given", () => {
		render(
			<NumberInput
				label="Quantité"
				value={5}
				onChange={() => {}}
				error="Requis"
			/>
		);
		const input = screen.getByLabelText("Quantité");
		expect(input).toHaveAttribute("aria-invalid", "true");
		expect(screen.getByText("Requis")).toBeInTheDocument();
	});

	it("applies className to the field row, not the bare <input> — same convention as Select/DatePicker/TimePicker", () => {
		render(
			<NumberInput
				label="Quantité"
				value={5}
				onChange={() => {}}
				className="custom-field"
			/>
		);
		const input = screen.getByLabelText("Quantité");
		expect(input.className).not.toContain("custom-field");
		expect(input.parentElement).toHaveClass("custom-field");
	});
});
