import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { endOfWeek, startOfWeek } from "date-fns";
import { describe, expect, it, vi } from "vitest";

import { PeriodFilter } from "./PeriodFilter";

describe("PeriodFilter", () => {
	it("renders from/to date pickers and preset buttons", () => {
		render(<PeriodFilter />);
		expect(screen.getByLabelText("From")).toBeInTheDocument();
		expect(screen.getByLabelText("To")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "This week" })
		).toBeInTheDocument();
	});

	it("applies a preset to both from and to via onChange", () => {
		const onChange = vi.fn();
		render(<PeriodFilter onChange={onChange} />);
		fireEvent.click(screen.getByRole("button", { name: "This month" }));
		expect(onChange).toHaveBeenCalledWith("from", expect.any(Date));
		expect(onChange).toHaveBeenCalledWith("to", expect.any(Date));
	});

	it("prefers a per-side onChange over the shared one", () => {
		const onChange = vi.fn();
		const fromOnChange = vi.fn();
		render(
			<PeriodFilter
				from={{ onChange: fromOnChange }}
				onChange={onChange}
			/>
		);
		fireEvent.click(screen.getByRole("button", { name: "This month" }));
		expect(fromOnChange).toHaveBeenCalledWith(expect.any(Date));
		expect(onChange).toHaveBeenCalledWith("to", expect.any(Date));
		expect(onChange).not.toHaveBeenCalledWith("from", expect.any(Date));
	});

	it("hides presets when showPresets is false", () => {
		render(<PeriodFilter showPresets={false} />);
		expect(
			screen.queryByRole("button", { name: "This week" })
		).not.toBeInTheDocument();
	});

	it("shows the range-type selector only when range is given", () => {
		const { rerender } = render(<PeriodFilter />);
		expect(screen.queryByText("Between")).not.toBeInTheDocument();

		rerender(<PeriodFilter range={{ value: "between" }} />);
		expect(screen.getByLabelText("Between")).toBeChecked();
	});

	it("calls range.onChange when a range type is picked", () => {
		const onRangeChange = vi.fn();
		render(
			<PeriodFilter
				range={{ value: "between", onChange: onRangeChange }}
			/>
		);
		fireEvent.click(screen.getByLabelText("Starting from"));
		expect(onRangeChange).toHaveBeenCalledWith("starting");
	});

	it.each([
		"nextWeek",
		"lastWeek",
		"nextMonth",
		"lastMonth",
		"thisYear",
		"nextYear",
		"lastYear",
	] as const)("applies the %s preset to both from and to", (preset) => {
		const labels: Record<string, string> = {
			nextWeek: "Next week",
			lastWeek: "Last week",
			nextMonth: "Next month",
			lastMonth: "Last month",
			thisYear: "This year",
			nextYear: "Next year",
			lastYear: "Last year",
		};
		const onChange = vi.fn();
		render(<PeriodFilter presets={[preset]} onChange={onChange} />);
		fireEvent.click(screen.getByRole("button", { name: labels[preset] }));
		expect(onChange).toHaveBeenCalledWith("from", expect.any(Date));
		expect(onChange).toHaveBeenCalledWith("to", expect.any(Date));
	});

	it("marks the matching preset button as active (solid) when from/to already match it", () => {
		const now = new Date();
		render(
			<PeriodFilter
				presets={["thisWeek"]}
				from={{ value: startOfWeek(now, { weekStartsOn: 1 }) }}
				to={{ value: endOfWeek(now, { weekStartsOn: 1 }) }}
			/>
		);
		expect(
			screen.getByRole("button", { name: "This week" })
		).toHaveAttribute("data-variant", "solid");
	});

	it("leaves every preset button inactive (outline) when from/to don't match any", () => {
		render(
			<PeriodFilter
				presets={["thisWeek"]}
				from={{ value: new Date(2000, 0, 1) }}
				to={{ value: new Date(2000, 0, 2) }}
			/>
		);
		expect(
			screen.getByRole("button", { name: "This week" })
		).toHaveAttribute("data-variant", "outline");
	});
});
