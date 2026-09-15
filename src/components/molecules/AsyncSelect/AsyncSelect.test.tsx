import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TSelectOption } from "@interfaces/index";

import { AsyncSelect } from "./AsyncSelect";

const OPTION = (label: string): TSelectOption => ({ value: label, label });

// Real timers throughout — Select is built on floating-ui's `autoUpdate`
// (its own real rAF/timer loop), which deadlocks against
// vi.useFakeTimers(). Debounce is set very short (or 0) per test instead
// of faking the clock, and waits are real (waitFor/short sleeps).
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe("AsyncSelect", () => {
	it('calls loadOptions("") once on mount', async () => {
		const loadOptions = vi.fn().mockResolvedValue([OPTION("Alice")]);
		render(<AsyncSelect loadOptions={loadOptions} onChange={() => {}} />);
		await waitFor(() => expect(loadOptions).toHaveBeenCalledWith(""));
	});

	it("renders the options loadOptions resolves with", async () => {
		const loadOptions = vi
			.fn()
			.mockResolvedValue([OPTION("Alice"), OPTION("Bob")]);
		render(<AsyncSelect loadOptions={loadOptions} onChange={() => {}} />);
		await waitFor(() => expect(loadOptions).toHaveBeenCalled());
		await userEvent.click(screen.getByRole("combobox"));
		expect(screen.getByText("Alice")).toBeInTheDocument();
		expect(screen.getByText("Bob")).toBeInTheDocument();
	});

	it("debounces loadOptions calls while typing", async () => {
		const loadOptions = vi.fn().mockResolvedValue([]);
		render(
			<AsyncSelect
				loadOptions={loadOptions}
				onChange={() => {}}
				debounce={100}
			/>
		);
		await waitFor(() => expect(loadOptions).toHaveBeenCalledTimes(1));
		loadOptions.mockClear();

		await userEvent.click(screen.getByRole("combobox"));
		const input = screen.getByRole("textbox");
		await userEvent.type(input, "al");

		expect(loadOptions).not.toHaveBeenCalled();
		await waitFor(() => expect(loadOptions).toHaveBeenCalledTimes(1), {
			timeout: 1000,
		});
		expect(loadOptions).toHaveBeenCalledWith("al");
	});

	it("ignores a stale response that resolves after a newer request", async () => {
		let resolveFirst!: (v: TSelectOption[]) => void;
		let resolveSecond!: (v: TSelectOption[]) => void;
		const loadOptions = vi
			.fn()
			.mockImplementationOnce(
				() => new Promise((r) => (resolveFirst = r))
			)
			.mockImplementationOnce(
				() => new Promise((r) => (resolveSecond = r))
			);

		render(
			<AsyncSelect
				loadOptions={loadOptions}
				onChange={() => {}}
				debounce={0}
			/>
		);
		await waitFor(() => expect(loadOptions).toHaveBeenCalledTimes(1));
		// mount call is the first mockImplementationOnce — trigger a second
		// request (search) which resolves *before* the first one.
		await userEvent.click(screen.getByRole("combobox"));
		await userEvent.type(screen.getByRole("textbox"), "a");
		await waitFor(() => expect(loadOptions).toHaveBeenCalledTimes(2));

		await act(async () => {
			resolveSecond([OPTION("Fresh")]);
			await sleep(0);
		});
		await act(async () => {
			resolveFirst([OPTION("Stale")]);
			await sleep(0);
		});

		expect(screen.getByText("Fresh")).toBeInTheDocument();
		expect(screen.queryByText("Stale")).not.toBeInTheDocument();
	});

	it("shows the loading state while a request is in flight", async () => {
		let resolve!: (v: TSelectOption[]) => void;
		const loadOptions = vi.fn(
			() => new Promise<TSelectOption[]>((r) => (resolve = r))
		);
		render(<AsyncSelect loadOptions={loadOptions} onChange={() => {}} />);
		await userEvent.click(screen.getByRole("combobox"));
		expect(screen.queryByRole("option")).not.toBeInTheDocument();
		await act(async () => {
			resolve([OPTION("Alice")]);
			await sleep(0);
		});
		expect(screen.getByText("Alice")).toBeInTheDocument();
	});
});
