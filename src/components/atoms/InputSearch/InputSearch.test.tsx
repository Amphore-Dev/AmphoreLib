import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { InputSearch } from "./InputSearch";

describe("InputSearch", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("updates the field immediately while typing", () => {
		render(<InputSearch value="" onChange={() => {}} />);
		fireEvent.change(screen.getByRole("textbox"), {
			target: { value: "abc" },
		});
		expect(screen.getByRole("textbox")).toHaveValue("abc");
	});

	it("debounces onChange by `delay` (default 500ms)", () => {
		const onChange = vi.fn();
		render(<InputSearch value="" onChange={onChange} />);
		fireEvent.change(screen.getByRole("textbox"), {
			target: { value: "abc" },
		});
		expect(onChange).not.toHaveBeenCalled();
		vi.advanceTimersByTime(499);
		expect(onChange).not.toHaveBeenCalled();
		vi.advanceTimersByTime(1);
		expect(onChange).toHaveBeenCalledWith("abc");
	});

	it("resets the debounce timer on every keystroke", () => {
		const onChange = vi.fn();
		render(<InputSearch value="" onChange={onChange} delay={300} />);
		const input = screen.getByRole("textbox");
		fireEvent.change(input, { target: { value: "a" } });
		vi.advanceTimersByTime(200);
		fireEvent.change(input, { target: { value: "ab" } });
		vi.advanceTimersByTime(200);
		expect(onChange).not.toHaveBeenCalled();
		vi.advanceTimersByTime(100);
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith("ab");
	});

	it("fires immediately when debounced=false", () => {
		const onChange = vi.fn();
		render(<InputSearch value="" onChange={onChange} debounced={false} />);
		fireEvent.change(screen.getByRole("textbox"), {
			target: { value: "abc" },
		});
		expect(onChange).toHaveBeenCalledWith("abc");
	});

	it("doesn't call onChange below minLength", () => {
		const onChange = vi.fn();
		render(<InputSearch value="" onChange={onChange} minLength={3} />);
		fireEvent.change(screen.getByRole("textbox"), {
			target: { value: "ab" },
		});
		vi.advanceTimersByTime(1000);
		expect(onChange).not.toHaveBeenCalled();
	});

	it("is clearable by default", () => {
		render(<InputSearch value="abc" onChange={() => {}} />);
		expect(
			screen.getByRole("button", { name: /effacer|clear/i })
		).toBeInTheDocument();
	});

	it("syncs internal value when the controlled `value` prop changes externally", () => {
		const { rerender } = render(
			<InputSearch value="" onChange={() => {}} />
		);
		rerender(<InputSearch value="external" onChange={() => {}} />);
		expect(screen.getByRole("textbox")).toHaveValue("external");
	});
});
