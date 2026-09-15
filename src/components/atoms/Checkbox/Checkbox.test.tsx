import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
	it("renders unchecked by default and links its label", () => {
		render(<Checkbox label="Facture envoyée" onChange={() => {}} />);
		const checkbox = screen.getByLabelText("Facture envoyée");
		expect(checkbox).not.toBeChecked();
	});

	it("is fully controlled — checked comes only from props", () => {
		render(<Checkbox label="Actif" checked onChange={() => {}} />);
		expect(screen.getByLabelText("Actif")).toBeChecked();
	});

	it("calls onChange with the new boolean value", async () => {
		const onChange = vi.fn();
		render(<Checkbox label="Actif" checked={false} onChange={onChange} />);
		await userEvent.click(screen.getByLabelText("Actif"));
		expect(onChange).toHaveBeenCalledWith(true, expect.anything());
	});

	it("sets the DOM indeterminate property without affecting checked", () => {
		render(
			<Checkbox
				label="Partiel"
				checked={false}
				indeterminate
				onChange={() => {}}
			/>
		);
		const checkbox = screen.getByLabelText("Partiel") as HTMLInputElement;
		expect(checkbox.indeterminate).toBe(true);
		expect(checkbox.checked).toBe(false);
	});

	it("shows the error message and links it via aria-describedby", () => {
		render(<Checkbox label="CGU" onChange={() => {}} error="Requis" />);
		expect(screen.getByRole("alert")).toHaveTextContent("Requis");
		const checkbox = screen.getByLabelText("CGU");
		const describedBy = checkbox.getAttribute("aria-describedby");
		expect(describedBy).toBeTruthy();
		expect(document.getElementById(describedBy!)).toHaveTextContent(
			"Requis"
		);
	});

	it("respects disabled", () => {
		render(<Checkbox label="Actif" onChange={() => {}} disabled />);
		expect(screen.getByLabelText("Actif")).toBeDisabled();
	});
});
