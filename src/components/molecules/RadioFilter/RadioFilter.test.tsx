import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RadioFilter } from "./RadioFilter";

const options = [
	{ label: "Un", value: "1" },
	{ label: "Deux", value: "2" },
	{ label: "Trois", value: "3", disabled: true },
];

describe("RadioFilter", () => {
	it("renders every option", () => {
		render(<RadioFilter options={options} />);
		expect(screen.getByLabelText("Un")).toBeInTheDocument();
		expect(screen.getByLabelText("Deux")).toBeInTheDocument();
	});

	it("checks only the selected option", () => {
		render(<RadioFilter options={options} value="2" />);
		expect(screen.getByLabelText("Un")).not.toBeChecked();
		expect(screen.getByLabelText("Deux")).toBeChecked();
	});

	it("calls onChange with the clicked option's value", () => {
		const onChange = vi.fn();
		render(<RadioFilter options={options} value="1" onChange={onChange} />);
		fireEvent.click(screen.getByLabelText("Deux"));
		expect(onChange).toHaveBeenCalledWith("2");
	});

	it("disables an individual option", () => {
		render(<RadioFilter options={options} />);
		expect(screen.getByLabelText("Trois")).toBeDisabled();
	});

	it("shows the error message", () => {
		render(<RadioFilter options={options} error="Requis" />);
		expect(screen.getByText("Requis")).toBeInTheDocument();
	});
});

describe("RadioFilter accessibility", () => {
	const options = [
		{ value: "a", label: "Alpha" },
		{ value: "b", label: "Beta" },
	];

	it("names the radiogroup after its label", () => {
		render(<RadioFilter label="Color" options={options} />);
		expect(
			screen.getByRole("radiogroup", { name: "Color" })
		).toBeInTheDocument();
	});

	it("names the radiogroup without a visible label", () => {
		render(<RadioFilter aria-label="Color" options={options} />);
		expect(
			screen.getByRole("radiogroup", { name: "Color" })
		).toBeInTheDocument();
	});

	it("puts the error and required state on the radiogroup, not the radios", () => {
		render(
			<RadioFilter
				label="Color"
				options={options}
				error="Pick one"
				required
			/>
		);
		const group = screen.getByRole("radiogroup");

		expect(group).toHaveAttribute("aria-invalid", "true");
		expect(group).toHaveAttribute("aria-required", "true");
		expect(group).toHaveAccessibleDescription("Pick one");
		for (const radio of screen.getAllByRole("radio")) {
			expect(radio).not.toHaveAttribute("aria-invalid");
		}
	});
});
