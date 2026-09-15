import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CheckboxFilter } from "./CheckboxFilter";

const options = [
	{ label: "Un", value: "1" },
	{ label: "Deux", value: "2" },
	{ label: "Trois", value: "3", disabled: true },
];

describe("CheckboxFilter", () => {
	it("renders every option", () => {
		render(<CheckboxFilter options={options} />);
		expect(screen.getByLabelText("Un")).toBeInTheDocument();
		expect(screen.getByLabelText("Deux")).toBeInTheDocument();
		expect(screen.getByLabelText("Trois")).toBeInTheDocument();
	});

	it("checks options present in value", () => {
		render(<CheckboxFilter options={options} value={["2"]} />);
		expect(screen.getByLabelText("Un")).not.toBeChecked();
		expect(screen.getByLabelText("Deux")).toBeChecked();
	});

	it("adds the value on check", () => {
		const onChange = vi.fn();
		render(
			<CheckboxFilter
				options={options}
				value={["1"]}
				onChange={onChange}
			/>
		);
		fireEvent.click(screen.getByLabelText("Deux"));
		expect(onChange).toHaveBeenCalledWith(["1", "2"]);
	});

	it("removes the value on uncheck", () => {
		const onChange = vi.fn();
		render(
			<CheckboxFilter
				options={options}
				value={["1", "2"]}
				onChange={onChange}
			/>
		);
		fireEvent.click(screen.getByLabelText("Un"));
		expect(onChange).toHaveBeenCalledWith(["2"]);
	});

	it("disables an individual option", () => {
		render(<CheckboxFilter options={options} />);
		expect(screen.getByLabelText("Trois")).toBeDisabled();
	});

	it("shows the error message", () => {
		render(<CheckboxFilter options={options} error="Requis" />);
		expect(screen.getByText("Requis")).toBeInTheDocument();
	});
});
