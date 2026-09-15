import React from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Accordion } from "./Accordion";

const ITEMS = [
	{ value: "a", title: "Section A", content: "Contenu A" },
	{ value: "b", title: "Section B", content: "Contenu B" },
	{ value: "c", title: "Section C", content: "Contenu C", disabled: true },
];

describe("Accordion", () => {
	it("renders one header per item, none expanded by default", () => {
		render(<Accordion items={ITEMS} onChange={() => {}} />);
		const headers = screen.getAllByRole("button");
		expect(headers).toHaveLength(3);
		headers.forEach((header) => {
			expect(header).toHaveAttribute("aria-expanded", "false");
		});
	});

	it("marks the item matching value as expanded (single mode)", () => {
		render(
			<Accordion
				items={ITEMS}
				value="b"
				onChange={() => {}}
				multiple={false}
			/>
		);
		expect(
			screen.getByRole("button", { name: /Section A/ })
		).toHaveAttribute("aria-expanded", "false");
		expect(
			screen.getByRole("button", { name: /Section B/ })
		).toHaveAttribute("aria-expanded", "true");
	});

	it("calls onChange with the clicked item's value when opening (single mode)", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Accordion
				items={ITEMS}
				value={null}
				onChange={onChange}
				multiple={false}
			/>
		);
		await user.click(screen.getByRole("button", { name: /Section A/ }));
		expect(onChange).toHaveBeenCalledWith("a");
	});

	it("calls onChange with null when closing the already-open item (single mode)", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Accordion
				items={ITEMS}
				value="a"
				onChange={onChange}
				multiple={false}
			/>
		);
		await user.click(screen.getByRole("button", { name: /Section A/ }));
		expect(onChange).toHaveBeenCalledWith(null);
	});

	it("single mode: opening a new item replaces the previously open one", async () => {
		// Simulated by re-rendering with the new value, since this component
		// is fully controlled — it never manages "which is open" itself.
		const { rerender } = render(
			<Accordion
				items={ITEMS}
				value="a"
				onChange={() => {}}
				multiple={false}
			/>
		);
		expect(
			screen.getByRole("button", { name: /Section A/ })
		).toHaveAttribute("aria-expanded", "true");
		rerender(
			<Accordion
				items={ITEMS}
				value="b"
				onChange={() => {}}
				multiple={false}
			/>
		);
		expect(
			screen.getByRole("button", { name: /Section A/ })
		).toHaveAttribute("aria-expanded", "false");
		expect(
			screen.getByRole("button", { name: /Section B/ })
		).toHaveAttribute("aria-expanded", "true");
	});

	it("defaults to multiple mode — an array value can expand several items at once", () => {
		render(
			<Accordion items={ITEMS} value={["a", "b"]} onChange={() => {}} />
		);
		expect(
			screen.getByRole("button", { name: /Section A/ })
		).toHaveAttribute("aria-expanded", "true");
		expect(
			screen.getByRole("button", { name: /Section B/ })
		).toHaveAttribute("aria-expanded", "true");
	});

	it("multiple mode: several items can be expanded at once, via an array value", () => {
		render(
			<Accordion
				items={ITEMS}
				value={["a", "b"]}
				onChange={() => {}}
				multiple
			/>
		);
		expect(
			screen.getByRole("button", { name: /Section A/ })
		).toHaveAttribute("aria-expanded", "true");
		expect(
			screen.getByRole("button", { name: /Section B/ })
		).toHaveAttribute("aria-expanded", "true");
	});

	it("multiple mode: toggling one item adds/removes only its own value from the array", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Accordion
				items={ITEMS}
				value={["a"]}
				onChange={onChange}
				multiple
			/>
		);
		await user.click(screen.getByRole("button", { name: /Section B/ }));
		expect(onChange).toHaveBeenCalledWith(["a", "b"]);

		await user.click(screen.getByRole("button", { name: /Section A/ }));
		expect(onChange).toHaveBeenCalledWith([]);
	});

	it("does not call onChange when clicking a disabled item's header", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Accordion items={ITEMS} onChange={onChange} />);
		await user.click(screen.getByRole("button", { name: /Section C/ }));
		expect(onChange).not.toHaveBeenCalled();
	});

	it("links each header to its panel via aria-controls/id and aria-labelledby", () => {
		render(
			<Accordion
				items={ITEMS}
				value="a"
				onChange={() => {}}
				multiple={false}
			/>
		);
		const header = screen.getByRole("button", { name: /Section A/ });
		const panelId = header.getAttribute("aria-controls");
		expect(panelId).toBeTruthy();
		const panel = document.getElementById(panelId as string);
		expect(panel).toHaveAttribute("aria-labelledby", header.id);
		expect(panel).toHaveTextContent("Contenu A");
	});
});
