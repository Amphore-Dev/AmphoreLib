import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TimeRangeFilter } from "./TimeRangeFilter";

describe("TimeRangeFilter", () => {
	it("renders two time pickers", () => {
		render(<TimeRangeFilter />);
		expect(screen.getAllByLabelText(/Hours/)).toHaveLength(2);
	});

	it("calls onChange with 'from' when the first picker changes", () => {
		const onChange = vi.fn();
		render(<TimeRangeFilter onChange={onChange} />);
		const [fromHour] = screen.getAllByLabelText(/Hours/);
		fireEvent.change(fromHour, { target: { value: "09" } });
		fireEvent.blur(fromHour);
		expect(onChange).toHaveBeenCalledWith("from", "09:00");
	});

	it("calls onChange with 'to' when the second picker changes", () => {
		const onChange = vi.fn();
		render(<TimeRangeFilter onChange={onChange} />);
		const [, toHour] = screen.getAllByLabelText(/Hours/);
		fireEvent.change(toHour, { target: { value: "18" } });
		fireEvent.blur(toHour);
		expect(onChange).toHaveBeenCalledWith("to", "18:00");
	});

	it("prefers a per-field onChange over the shared one", () => {
		const onChange = vi.fn();
		const fromOnChange = vi.fn();
		render(
			<TimeRangeFilter
				from={{ onChange: fromOnChange }}
				onChange={onChange}
			/>
		);
		const [fromHour] = screen.getAllByLabelText(/Hours/);
		fireEvent.change(fromHour, { target: { value: "09" } });
		fireEvent.blur(fromHour);
		expect(fromOnChange).toHaveBeenCalledWith("09:00");
		expect(onChange).not.toHaveBeenCalled();
	});
});
