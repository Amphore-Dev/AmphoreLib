import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TimePicker } from "./TimePicker";

describe("TimePicker", () => {
	it("renders the hour/minute segments from the given value", () => {
		render(<TimePicker label="Hour" value="09:05" onChange={() => {}} />);
		expect(screen.getByLabelText("Hour — hours")).toHaveValue("09");
		expect(screen.getByLabelText("Hour — minutes")).toHaveValue("05");
	});

	it("renders empty segments when value is null", () => {
		render(<TimePicker label="Hour" value={null} onChange={() => {}} />);
		expect(screen.getByLabelText("Hour — hours")).toHaveValue("");
		expect(screen.getByLabelText("Hour — minutes")).toHaveValue("");
	});

	it("auto-advances to the minute segment once two digits are typed in the hour segment", async () => {
		const user = userEvent.setup();
		render(<TimePicker label="Hour" value={null} onChange={() => {}} />);
		await user.type(screen.getByLabelText("Hour — hours"), "14");
		expect(screen.getByLabelText("Hour — minutes")).toHaveFocus();
	});

	it("commits a full HH:mm value on blur", () => {
		const onChange = vi.fn();
		render(<TimePicker label="Hour" value={null} onChange={onChange} />);
		fireEvent.change(screen.getByLabelText("Hour — hours"), {
			target: { value: "9" },
		});
		fireEvent.change(screen.getByLabelText("Hour — minutes"), {
			target: { value: "5" },
		});
		fireEvent.blur(screen.getByLabelText("Hour — minutes"));
		expect(onChange).toHaveBeenCalledWith("09:05");
	});

	it("commits null when both segments are left empty", () => {
		const onChange = vi.fn();
		render(<TimePicker label="Hour" value="10:00" onChange={onChange} />);
		fireEvent.change(screen.getByLabelText("Hour — hours"), {
			target: { value: "" },
		});
		fireEvent.change(screen.getByLabelText("Hour — minutes"), {
			target: { value: "" },
		});
		fireEvent.blur(screen.getByLabelText("Hour — minutes"));
		expect(onChange).toHaveBeenCalledWith(null);
	});

	it("ArrowUp/ArrowDown increment/decrement the focused segment, wrapping at the bounds", () => {
		const onChange = vi.fn();
		render(<TimePicker label="Hour" value="23:59" onChange={onChange} />);
		const hour = screen.getByLabelText("Hour — hours");
		const minute = screen.getByLabelText("Hour — minutes");

		fireEvent.keyDown(hour, { key: "ArrowUp" });
		expect(hour).toHaveValue("00");

		fireEvent.keyDown(minute, { key: "ArrowUp" });
		expect(minute).toHaveValue("00");
	});

	it("clamps the committed value to min/max", () => {
		const onChange = vi.fn();
		render(
			<TimePicker
				label="Hour"
				value={null}
				onChange={onChange}
				min="09:00"
				max="18:00"
			/>
		);
		fireEvent.change(screen.getByLabelText("Hour — hours"), {
			target: { value: "23" },
		});
		fireEvent.change(screen.getByLabelText("Hour — minutes"), {
			target: { value: "30" },
		});
		fireEvent.blur(screen.getByLabelText("Hour — minutes"));
		expect(onChange).toHaveBeenCalledWith("18:00");
	});

	it("disables both segments when disabled", () => {
		render(
			<TimePicker
				label="Hour"
				value="09:00"
				onChange={() => {}}
				disabled
			/>
		);
		expect(screen.getByLabelText("Hour — hours")).toBeDisabled();
		expect(screen.getByLabelText("Hour — minutes")).toBeDisabled();
	});

	it("selects the segment's text on focus, so retyping overwrites it", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<TimePicker label="Hour" value={null} onChange={onChange} />);
		const hour = screen.getByLabelText("Hour — hours");
		const minute = screen.getByLabelText("Hour — minutes");

		await user.type(hour, "12");
		expect(minute).toHaveFocus();

		await user.click(hour);
		await user.type(hour, "12");
		expect(hour).toHaveValue("12");
	});

	it("commits the full retyped hour, not a stale pre-advance value", async () => {
		// Regression: focusNext() moves focus to the minute segment
		// synchronously right after the 2nd digit's setHourText — firing a
		// native blur on the hour input before React re-renders. handleBlur's
		// closure used to still see the pre-update text, committing "01"
		// instead of "12".
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<TimePicker label="Hour" value={null} onChange={onChange} />);
		const hour = screen.getByLabelText("Hour — hours");
		const minute = screen.getByLabelText("Hour — minutes");

		await user.type(hour, "12");
		await user.click(hour);
		await user.type(hour, "12");
		await user.click(minute);

		expect(onChange).toHaveBeenLastCalledWith("12:00");
	});

	it("clamps the hour segment's own displayed text as soon as the 2nd digit is typed", async () => {
		const user = userEvent.setup();
		render(<TimePicker label="Hour" value={null} onChange={() => {}} />);
		await user.type(screen.getByLabelText("Hour — hours"), "36");
		expect(screen.getByLabelText("Hour — hours")).toHaveValue("23");
	});

	it("clamps hours to 23 by default", () => {
		const onChange = vi.fn();
		render(<TimePicker label="Hour" value={null} onChange={onChange} />);
		fireEvent.change(screen.getByLabelText("Hour — hours"), {
			target: { value: "36" },
		});
		fireEvent.blur(screen.getByLabelText("Hour — hours"));
		expect(onChange).toHaveBeenCalledWith("23:00");
	});

	it("allows hours over 23 and grows to 3 digits when hourMax > 99", () => {
		const onChange = vi.fn();
		render(
			<TimePicker
				label="Hour"
				value={null}
				onChange={onChange}
				hourMax={999}
			/>
		);
		const hour = screen.getByLabelText("Hour — hours");
		expect(hour).toHaveAttribute("maxLength", "3");
		fireEvent.change(hour, { target: { value: "136" } });
		fireEvent.blur(hour);
		expect(onChange).toHaveBeenCalledWith("136:00");
	});

	it("still pads a small hour to 2 digits (not 3) when hourMax > 99", () => {
		const onChange = vi.fn();
		render(
			<TimePicker
				label="Hour"
				value={null}
				onChange={onChange}
				hourMax={999}
			/>
		);
		const hour = screen.getByLabelText("Hour — hours");
		fireEvent.change(hour, { target: { value: "5" } });
		fireEvent.blur(hour);
		expect(onChange).toHaveBeenCalledWith("05:00");
	});

	it("steps the minute segment by minuteStep on ArrowUp/ArrowDown", () => {
		render(
			<TimePicker
				label="Hour"
				value="09:00"
				onChange={() => {}}
				minuteStep={15}
			/>
		);
		const minute = screen.getByLabelText("Hour — minutes");
		fireEvent.keyDown(minute, { key: "ArrowUp" });
		expect(minute).toHaveValue("15");
	});

	it("shows an error message and aria-invalid when error is given", () => {
		render(
			<TimePicker
				label="Hour"
				value="09:00"
				onChange={() => {}}
				error="Requis"
			/>
		);
		expect(screen.getByLabelText("Hour — hours")).toHaveAttribute(
			"aria-invalid",
			"true"
		);
		expect(screen.getByText("Requis")).toBeInTheDocument();
	});
});
