import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CountDown } from "./CountDown";

describe("CountDown", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("renders the default template with the starting value", () => {
		render(<CountDown seconds={5} onEnd={() => {}} />);
		expect(screen.getByText("5 s")).toBeInTheDocument();
	});

	it("ticks down by 1 every second", () => {
		render(<CountDown seconds={3} onEnd={() => {}} />);
		act(() => vi.advanceTimersByTime(1000));
		expect(screen.getByText("2 s")).toBeInTheDocument();
		act(() => vi.advanceTimersByTime(1000));
		expect(screen.getByText("1 s")).toBeInTheDocument();
	});

	it("calls onEnd exactly once when it reaches 0", () => {
		const onEnd = vi.fn();
		render(<CountDown seconds={1} onEnd={onEnd} />);
		act(() => vi.advanceTimersByTime(1000));
		expect(onEnd).toHaveBeenCalledTimes(1);
		act(() => vi.advanceTimersByTime(5000));
		expect(onEnd).toHaveBeenCalledTimes(1);
	});

	it("supports a custom string template with a {time} placeholder", () => {
		render(
			<CountDown seconds={7} onEnd={() => {}} text="{time} secondes" />
		);
		expect(screen.getByText("7 secondes")).toBeInTheDocument();
	});

	it("supports a function template", () => {
		render(
			<CountDown
				seconds={4}
				onEnd={() => {}}
				text={(n) => `Encore ${n}`}
			/>
		);
		expect(screen.getByText("Encore 4")).toBeInTheDocument();
	});

	it("resets when `seconds` changes", () => {
		const { rerender } = render(<CountDown seconds={3} onEnd={() => {}} />);
		act(() => vi.advanceTimersByTime(1000));
		expect(screen.getByText("2 s")).toBeInTheDocument();
		rerender(<CountDown seconds={10} onEnd={() => {}} />);
		expect(screen.getByText("10 s")).toBeInTheDocument();
	});
});
