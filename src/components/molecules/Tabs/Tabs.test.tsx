import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Tabs, TabPanel } from "./Tabs";

/** jsdom always reports scrollWidth/clientWidth as 0 — Tabs' scroll-arrow
 * UI (isScrollable) only ever appears once scrollWidth exceeds clientWidth,
 * which never happens without stubbing. Scoped to individual tests (not
 * setup.js) since a global stub would make every test's tablist wrongly
 * "overflow". */
const stubOverflow = () => {
	const descriptors = (["scrollWidth", "clientWidth"] as const).map(
		(prop) => [
			prop,
			Object.getOwnPropertyDescriptor(HTMLElement.prototype, prop),
		]
	);
	Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
		configurable: true,
		value: 1000,
	});
	Object.defineProperty(HTMLElement.prototype, "clientWidth", {
		configurable: true,
		value: 300,
	});
	return () => {
		descriptors.forEach(([prop, descriptor]) => {
			if (descriptor)
				Object.defineProperty(HTMLElement.prototype, prop, descriptor);
		});
	};
};

const ITEMS = [
	{ value: "day", label: "Jour" },
	{ value: "week", label: "Semaine" },
	{ value: "month", label: "Mois", disabled: true },
	{ value: "year", label: "Année" },
];

describe("Tabs", () => {
	it("renders a tablist with one tab per item", () => {
		render(<Tabs items={ITEMS} value="day" onChange={() => {}} />);
		expect(screen.getByRole("tablist")).toBeInTheDocument();
		expect(screen.getAllByRole("tab")).toHaveLength(4);
	});

	it("marks the tab matching value as selected, others not", () => {
		render(<Tabs items={ITEMS} value="week" onChange={() => {}} />);
		expect(screen.getByRole("tab", { name: "Jour" })).toHaveAttribute(
			"aria-selected",
			"false"
		);
		expect(screen.getByRole("tab", { name: "Semaine" })).toHaveAttribute(
			"aria-selected",
			"true"
		);
	});

	it("calls onChange with the clicked tab's value", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Tabs items={ITEMS} value="day" onChange={onChange} />);
		await user.click(screen.getByRole("tab", { name: "Semaine" }));
		expect(onChange).toHaveBeenCalledWith("week");
	});

	it("does not call onChange when clicking a disabled tab", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Tabs items={ITEMS} value="day" onChange={onChange} />);
		await user.click(screen.getByRole("tab", { name: "Mois" }));
		expect(onChange).not.toHaveBeenCalled();
	});

	it("marks a disabled item's tab with aria-disabled", () => {
		render(<Tabs items={ITEMS} value="day" onChange={() => {}} />);
		expect(screen.getByRole("tab", { name: "Mois" })).toHaveAttribute(
			"aria-disabled",
			"true"
		);
	});

	it("only the selected tab is in the tab order (roving tabindex)", () => {
		render(<Tabs items={ITEMS} value="week" onChange={() => {}} />);
		expect(screen.getByRole("tab", { name: "Jour" })).toHaveAttribute(
			"tabIndex",
			"-1"
		);
		expect(screen.getByRole("tab", { name: "Semaine" })).toHaveAttribute(
			"tabIndex",
			"0"
		);
	});

	it("ArrowRight moves focus to the next enabled tab, skipping disabled ones, WITHOUT selecting it (manual activation)", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Tabs items={ITEMS} value="week" onChange={onChange} />);
		screen.getByRole("tab", { name: "Semaine" }).focus();
		await user.keyboard("{ArrowRight}");
		// "Mois" is disabled, should skip straight to "Année".
		expect(screen.getByRole("tab", { name: "Année" })).toHaveFocus();
		expect(onChange).not.toHaveBeenCalled();
	});

	it("ArrowLeft wraps focus to the last enabled tab from the first, without selecting", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Tabs items={ITEMS} value="day" onChange={onChange} />);
		screen.getByRole("tab", { name: "Jour" }).focus();
		await user.keyboard("{ArrowLeft}");
		expect(screen.getByRole("tab", { name: "Année" })).toHaveFocus();
		expect(onChange).not.toHaveBeenCalled();
	});

	it("Home/End move focus to the first/last enabled tab, without selecting", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Tabs items={ITEMS} value="week" onChange={onChange} />);
		screen.getByRole("tab", { name: "Semaine" }).focus();
		await user.keyboard("{End}");
		expect(screen.getByRole("tab", { name: "Année" })).toHaveFocus();
		await user.keyboard("{Home}");
		expect(screen.getByRole("tab", { name: "Jour" })).toHaveFocus();
		expect(onChange).not.toHaveBeenCalled();
	});

	it("Enter selects the currently focused tab (manual activation commit)", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Tabs items={ITEMS} value="day" onChange={onChange} />);
		screen.getByRole("tab", { name: "Jour" }).focus();
		await user.keyboard("{ArrowRight}"); // focus -> Semaine, not selected yet
		expect(onChange).not.toHaveBeenCalled();
		await user.keyboard("{Enter}");
		expect(onChange).toHaveBeenCalledWith("week");
	});

	it("Space selects the currently focused tab (manual activation commit)", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Tabs items={ITEMS} value="day" onChange={onChange} />);
		screen.getByRole("tab", { name: "Jour" }).focus();
		await user.keyboard("{ArrowRight}");
		await user.keyboard(" ");
		expect(onChange).toHaveBeenCalledWith("week");
	});

	it("renders a leading picto for items that have one", () => {
		render(
			<Tabs
				items={[{ value: "day", label: "Jour", picto: "calendar" }]}
				value="day"
				onChange={() => {}}
			/>
		);
		expect(screen.getByTestId("calendar")).toBeInTheDocument();
	});

	describe("scroll arrows (overflowing tablist)", () => {
		let restore: () => void;
		beforeEach(() => {
			restore = stubOverflow();
		});
		afterEach(() => restore());

		it("shows both scroll arrows once the tablist overflows", () => {
			render(<Tabs items={ITEMS} value="day" onChange={() => {}} />);
			expect(screen.getByLabelText("Scroll left")).toBeInTheDocument();
			expect(screen.getByLabelText("Scroll right")).toBeInTheDocument();
		});

		it("left arrow starts disabled (already scrolled fully left)", () => {
			render(<Tabs items={ITEMS} value="day" onChange={() => {}} />);
			expect(screen.getByLabelText("Scroll left")).toBeDisabled();
		});

		it("clicking an arrow doesn't throw and doesn't select a tab", () => {
			const onChange = vi.fn();
			render(<Tabs items={ITEMS} value="day" onChange={onChange} />);
			fireEvent.click(screen.getByLabelText("Scroll right"));
			fireEvent.click(screen.getByLabelText("Scroll left"));
			expect(onChange).not.toHaveBeenCalled();
		});
	});
});

describe("TabPanel", () => {
	it("renders its children when active", () => {
		render(<TabPanel active>Contenu</TabPanel>);
		expect(screen.getByRole("tabpanel")).toHaveTextContent("Contenu");
	});

	it("renders nothing when not active", () => {
		render(<TabPanel active={false}>Contenu</TabPanel>);
		expect(screen.queryByRole("tabpanel")).not.toBeInTheDocument();
	});
});
