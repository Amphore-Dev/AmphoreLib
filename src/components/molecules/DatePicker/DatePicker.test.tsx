import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type Locale } from "react-day-picker";
import { enUS, fr } from "react-day-picker/locale";
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

	describe("week mode", () => {
		const openCalendar = async (
			user: ReturnType<typeof userEvent.setup>
		) => {
			await user.click(screen.getByRole("button"));
		};

		const selectedDays = () =>
			screen
				.getAllByRole("gridcell")
				.filter((cell) => cell.hasAttribute("data-selected"))
				.map((cell) => cell.getAttribute("data-day"));

		it("shows the week of the value on the trigger", () => {
			render(
				<DatePicker
					mode="week"
					value={new Date(2024, 2, 13)}
					onChange={() => {}}
				/>
			);
			expect(screen.getByRole("button")).toHaveTextContent(
				/11\/03\/2024\s–\s17\/03\/2024/
			);
		});

		it("selects every day of the value's week", async () => {
			const user = userEvent.setup();
			render(
				<DatePicker
					mode="week"
					value={new Date(2024, 2, 13)}
					onChange={() => {}}
				/>
			);
			await openCalendar(user);
			expect(selectedDays()).toEqual([
				"2024-03-11",
				"2024-03-12",
				"2024-03-13",
				"2024-03-14",
				"2024-03-15",
				"2024-03-16",
				"2024-03-17",
			]);
		});

		it("commits the first day and the whole week, then closes", async () => {
			const user = userEvent.setup();
			const onChange = vi.fn();
			render(
				<DatePicker
					mode="week"
					value={new Date(2024, 2, 1)}
					onChange={onChange}
				/>
			);
			await openCalendar(user);
			await user.click(
				screen.getByRole("button", { name: /20 March 2024/ })
			);
			expect(onChange).toHaveBeenCalledTimes(1);
			expect(onChange).toHaveBeenCalledWith(new Date(2024, 2, 18), {
				from: new Date(2024, 2, 18),
				to: new Date(2024, 2, 24),
			});
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		});

		it("commits the same week when a day inside it is clicked", async () => {
			const user = userEvent.setup();
			const onChange = vi.fn();
			render(
				<DatePicker
					mode="week"
					value={new Date(2024, 2, 13)}
					onChange={onChange}
				/>
			);
			await openCalendar(user);
			await user.click(
				screen.getByRole("button", { name: /15 March 2024/ })
			);
			expect(onChange.mock.calls[0][0]).toEqual(new Date(2024, 2, 11));
		});

		it("takes the first day of the week from the locale", async () => {
			const user = userEvent.setup();
			const onChange = vi.fn();
			render(
				<DatePicker
					mode="week"
					locale={enUS}
					value={new Date(2024, 2, 13)}
					onChange={onChange}
				/>
			);
			await openCalendar(user);
			expect(selectedDays()[0]).toBe("2024-03-10");
		});

		it("lets weekStartsOn override the locale", async () => {
			const user = userEvent.setup();
			render(
				<DatePicker
					mode="week"
					weekStartsOn={6}
					value={new Date(2024, 2, 13)}
					onChange={() => {}}
				/>
			);
			await openCalendar(user);
			expect(selectedDays()[0]).toBe("2024-03-09");
		});

		it("shows a week across two months in full", async () => {
			const user = userEvent.setup();
			render(
				<DatePicker
					mode="week"
					value={new Date(2024, 3, 1)}
					onChange={() => {}}
				/>
			);
			await openCalendar(user);
			expect(selectedDays()).toHaveLength(7);
			expect(screen.getByText("April 2024")).toBeInTheDocument();
		});

		it("previews the hovered week", async () => {
			const user = userEvent.setup();
			render(
				<DatePicker
					mode="week"
					value={new Date(2024, 2, 1)}
					onChange={() => {}}
				/>
			);
			await openCalendar(user);
			const hovered = () =>
				screen
					.getAllByRole("gridcell")
					.filter((cell) => cell.className.includes("hoverWeek"));

			expect(hovered()).toHaveLength(0);
			await user.hover(
				screen.getByRole("button", { name: /20 March 2024/ })
			);
			expect(hovered()).toHaveLength(7);
			await user.unhover(
				screen.getByRole("button", { name: /20 March 2024/ })
			);
			expect(hovered()).toHaveLength(0);
		});

		it("keeps a day's button across hovers, so a click isn't lost", async () => {
			const user = userEvent.setup();
			const onChange = vi.fn();
			render(
				<DatePicker
					mode="week"
					value={new Date(2024, 2, 1)}
					onChange={onChange}
				/>
			);
			await openCalendar(user);
			const day = screen.getByRole("button", { name: /20 March 2024/ });
			await user.hover(day);
			expect(screen.getByRole("button", { name: /20 March 2024/ })).toBe(
				day
			);
			await user.click(day);
			expect(onChange).toHaveBeenCalledTimes(1);
		});

		it("leaves a single-day value in single mode", async () => {
			const user = userEvent.setup();
			render(
				<DatePicker value={new Date(2024, 2, 13)} onChange={() => {}} />
			);
			await openCalendar(user);
			expect(selectedDays()).toEqual(["2024-03-13"]);
		});
	});

	describe("markers", () => {
		const markers = [
			{ date: new Date(2024, 2, 12), label: "2 entries to fill in" },
			{ date: new Date(2024, 2, 14) },
		];

		const renderOpen = async (locale?: Locale) => {
			const user = userEvent.setup();
			render(
				<DatePicker
					value={new Date(2024, 2, 1)}
					onChange={() => {}}
					markers={markers}
					locale={locale}
				/>
			);
			await user.click(screen.getByRole("button"));
		};

		it("adds the label to the day's name and tooltip", async () => {
			await renderOpen();
			const day = screen.getByRole("button", {
				name: /12 March 2024, 2 entries to fill in/,
			});
			expect(day).toHaveAttribute("title", "2 entries to fill in");
			expect(day).toHaveAttribute("data-marked", "true");
		});

		it("marks a day without a label, adding nothing to its name", async () => {
			await renderOpen();
			const day = screen.getByRole("button", { name: /14 March 2024$/ });
			expect(day).toHaveAttribute("data-marked", "true");
			expect(day).not.toHaveAttribute("title");
		});

		it("leaves the other days alone", async () => {
			await renderOpen();
			expect(
				screen.getByRole("button", { name: /15 March 2024/ })
			).not.toHaveAttribute("data-marked");
		});

		it("keeps the name the locale gives a day", async () => {
			await renderOpen(fr);
			expect(
				screen.getByRole("button", {
					name: /12 mars 2024, 2 entries to fill in/,
				})
			).toBeInTheDocument();
		});
	});

	it("reports month changes", async () => {
		const user = userEvent.setup();
		const onMonthChange = vi.fn();
		render(
			<DatePicker
				value={new Date(2024, 2, 1)}
				onChange={() => {}}
				onMonthChange={onMonthChange}
			/>
		);
		await user.click(screen.getByRole("button"));
		await user.click(screen.getByRole("button", { name: /next month/i }));
		expect(onMonthChange).toHaveBeenCalledWith(new Date(2024, 3, 1));
	});
});
