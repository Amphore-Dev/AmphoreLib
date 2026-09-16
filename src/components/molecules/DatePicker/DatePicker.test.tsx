import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import {
	expectInline,
	expectPortaledWithScope,
} from "../../../../tests/expectPortal";

import { DatePicker } from "./DatePicker";

describe("DatePicker", () => {
	it("shows the placeholder when value is null", () => {
		render(
			<DatePicker
				value={null}
				onChange={() => {}}
				placeholder="mm/dd/yyyy"
			/>
		);
		expect(screen.getByText("mm/dd/yyyy")).toBeInTheDocument();
	});

	it("shows the formatted date when a value is given", () => {
		render(
			<DatePicker value={new Date(2024, 2, 15)} onChange={() => {}} />
		);
		expect(screen.getByText("15/03/2024")).toBeInTheDocument();
	});

	it("does not render the calendar until the trigger is clicked", () => {
		render(<DatePicker value={null} onChange={() => {}} label="Date" />);
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("opens the calendar on trigger click", async () => {
		const user = userEvent.setup();
		render(<DatePicker value={null} onChange={() => {}} label="Date" />);
		await user.click(screen.getByRole("button"));
		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});

	it("commits the clicked day and closes the calendar", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<DatePicker
				value={new Date(2024, 2, 1)}
				onChange={onChange}
				label="Date"
			/>
		);
		await user.click(screen.getByRole("button"));
		await user.click(screen.getByRole("button", { name: /15 March 2024/ }));
		expect(onChange).toHaveBeenCalledTimes(1);
		const committed = onChange.mock.calls[0][0] as Date;
		expect(committed.getDate()).toBe(15);
		expect(committed.getMonth()).toBe(2);
		expect(committed.getFullYear()).toBe(2024);
	});

	it("opens the calendar on the selected value's month, not the current month", async () => {
		const user = userEvent.setup();
		render(
			<DatePicker
				value={new Date(2024, 2, 1)}
				onChange={() => {}}
				label="Date"
			/>
		);
		await user.click(screen.getByRole("button"));
		expect(screen.getByText("March 2024")).toBeInTheDocument();
	});

	it("never opens when disabled", async () => {
		const user = userEvent.setup();
		render(
			<DatePicker
				value={null}
				onChange={() => {}}
				label="Date"
				disabled
			/>
		);
		await user.click(screen.getByRole("button"));
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("shows an error message and aria-invalid when error is given", () => {
		render(
			<DatePicker
				value={null}
				onChange={() => {}}
				label="Date"
				error="Requis"
			/>
		);
		const trigger = screen.getByRole("button");
		expect(trigger).toHaveAttribute("data-invalid", "true");
		expect(trigger).toHaveAttribute("aria-describedby");
		expect(screen.getByText("Requis")).toBeInTheDocument();
	});

	describe("portal", () => {
		it("renders the calendar inline by default", async () => {
			const user = userEvent.setup();
			const { container } = render(
				<DatePicker value={null} onChange={() => {}} />
			);
			await user.click(screen.getByRole("button"));
			expectInline(container, screen.getByRole("dialog"));
		});

		it("forwards portal to the Popover, and a day click still commits", async () => {
			const user = userEvent.setup();
			const onChange = vi.fn();
			const { container } = render(
				<AmphoreProvider>
					<DatePicker
						value={new Date(2024, 2, 1)}
						onChange={onChange}
						portal
					/>
				</AmphoreProvider>
			);
			await user.click(screen.getByRole("button"));
			expectPortaledWithScope(container, screen.getByRole("dialog"));
			await user.click(
				screen.getByRole("button", { name: /15 March 2024/ })
			);
			expect(onChange).toHaveBeenCalledWith(new Date(2024, 2, 15));
		});
	});
});
