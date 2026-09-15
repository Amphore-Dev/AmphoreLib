import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { Input } from "./Input";

describe("Input", () => {
	it("defaults size to md when no prop and no AmphoreProvider default is given", () => {
		const { container } = render(
			<Input label="Nom" value="" onChange={() => {}} />
		);
		expect(container.querySelector("[data-size]")).toHaveAttribute(
			"data-size",
			"md"
		);
	});

	it("falls back to AmphoreProvider's config.defaults.size when no size prop is given", () => {
		const { container } = render(
			<AmphoreProvider config={{ defaults: { size: "lg" } }}>
				<Input label="Nom" value="" onChange={() => {}} />
			</AmphoreProvider>
		);
		expect(container.querySelector("[data-size]")).toHaveAttribute(
			"data-size",
			"lg"
		);
	});

	it("an explicit size prop wins over AmphoreProvider's default", () => {
		const { container } = render(
			<AmphoreProvider config={{ defaults: { size: "lg" } }}>
				<Input label="Nom" value="" onChange={() => {}} size="sm" />
			</AmphoreProvider>
		);
		expect(container.querySelector("[data-size]")).toHaveAttribute(
			"data-size",
			"sm"
		);
	});

	it("renders label and links it to the field", () => {
		render(<Input label="Nom" value="" onChange={() => {}} />);
		const input = screen.getByLabelText("Nom");
		expect(input).toBeInTheDocument();
	});

	it("is fully controlled — value comes only from props", () => {
		render(<Input label="Nom" value="Amphore" onChange={() => {}} />);
		expect(screen.getByLabelText("Nom")).toHaveValue("Amphore");
	});

	it("calls onChange with the new string value, not an event", async () => {
		const onChange = vi.fn();
		render(<Input label="Nom" value="" onChange={onChange} />);
		await userEvent.type(screen.getByLabelText("Nom"), "a");
		expect(onChange).toHaveBeenCalledWith("a", expect.anything());
	});

	it("shows the error message and marks the field invalid", () => {
		render(
			<Input
				label="Email"
				value=""
				onChange={() => {}}
				error="Email invalide"
			/>
		);
		expect(screen.getByRole("alert")).toHaveTextContent("Email invalide");
		const input = screen.getByLabelText("Email");
		expect(input).toHaveAttribute("aria-invalid", "true");
		// A screen reader tabbing into an already-invalid field must hear the
		// error, not just at the moment it appears (role="alert" alone only
		// announces on change) — aria-describedby covers the focus case.
		const describedBy = input.getAttribute("aria-describedby");
		expect(describedBy).toBeTruthy();
		expect(document.getElementById(describedBy!)).toHaveTextContent(
			"Email invalide"
		);
	});

	it("hides the error message when hideError is set", () => {
		render(
			<Input
				label="Email"
				value=""
				onChange={() => {}}
				error="Email invalide"
				hideError
			/>
		);
		expect(screen.queryByRole("alert")).not.toBeInTheDocument();
	});

	it("shows a clear button only when there is a value, and clears on click", async () => {
		const onChange = vi.fn();
		const { rerender } = render(
			<Input label="Recherche" value="" onChange={onChange} isClearable />
		);
		expect(screen.queryByLabelText("Clear")).not.toBeInTheDocument();

		rerender(
			<Input
				label="Recherche"
				value="abc"
				onChange={onChange}
				isClearable
			/>
		);
		await userEvent.click(screen.getByLabelText("Clear"));
		expect(onChange).toHaveBeenCalledWith("", expect.anything());
	});

	it("keeps the clear button keyboard-reachable (no tabIndex=-1)", () => {
		render(
			<Input
				label="Recherche"
				value="abc"
				onChange={() => {}}
				isClearable
			/>
		);
		expect(screen.getByLabelText("Clear")).not.toHaveAttribute(
			"tabindex",
			"-1"
		);
	});

	it("respects disabled", () => {
		render(<Input label="Nom" value="" onChange={() => {}} disabled />);
		expect(screen.getByLabelText("Nom")).toBeDisabled();
	});

	it("renders `after` content, e.g. a custom trailing action", () => {
		render(
			<Input
				label="Mot de passe"
				value=""
				onChange={() => {}}
				after={<span>Trailing</span>}
			/>
		);
		expect(screen.getByText("Trailing")).toBeInTheDocument();
	});

	it("applies className to the field row, not the bare <input> — same convention as Select/DatePicker/TimePicker", () => {
		// Regression: className used to land on the raw <input> instead,
		// so a consumer's own width/positioning classes (e.g. max-w-[500px])
		// only capped the text box itself, leaving the field's clear button
		// stuck wherever the input happened to stop instead of at the
		// field's own right edge.
		render(
			<Input
				label="Nom"
				value=""
				onChange={() => {}}
				className="custom-field"
			/>
		);
		const input = screen.getByLabelText("Nom");
		expect(input.className).not.toContain("custom-field");
		expect(input.parentElement).toHaveClass("custom-field");
	});
});
