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
