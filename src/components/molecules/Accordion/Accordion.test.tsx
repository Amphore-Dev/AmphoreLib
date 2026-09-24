import React from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Accordion, chevronRotation } from "./Accordion";

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

describe("Accordion rich header", () => {
	const RICH_ITEMS = [
		{
			value: "acme",
			title: (
				<span>
					Acme <em>3 projects · 76:00</em>
				</span>
			),
			ariaLabel: "Acme",
			actions: <button type="button">Add project</button>,
			content: "Acme projects",
		},
		{ value: "internal", title: "Internal", content: "Internal projects" },
	];

	it("renders a ReactNode title inside the toggle button", () => {
		render(<Accordion items={RICH_ITEMS} onChange={() => {}} />);
		const toggle = screen.getByRole("button", { name: "Acme" });
		expect(toggle).toHaveTextContent("Acme 3 projects · 76:00");
	});

	it("uses ariaLabel as the toggle's accessible name", () => {
		render(<Accordion items={RICH_ITEMS} onChange={() => {}} />);
		expect(screen.getByRole("button", { name: "Acme" })).toHaveAttribute(
			"aria-expanded",
			"false"
		);
	});

	it("renders actions outside the toggle button", () => {
		render(<Accordion items={RICH_ITEMS} onChange={() => {}} />);
		const toggle = screen.getByRole("button", { name: "Acme" });
		const action = screen.getByRole("button", { name: "Add project" });
		expect(toggle).not.toContainElement(action);
		expect(toggle.parentElement).toContainElement(action);
	});

	it("clicking an action runs it without toggling the item", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const onAdd = vi.fn();
		render(
			<Accordion
				items={[
					{
						...RICH_ITEMS[0],
						actions: (
							<button type="button" onClick={onAdd}>
								Add project
							</button>
						),
					},
				]}
				onChange={onChange}
			/>
		);
		await user.click(screen.getByRole("button", { name: "Add project" }));
		expect(onAdd).toHaveBeenCalledTimes(1);
		expect(onChange).not.toHaveBeenCalled();
	});

	it("toggles from the keyboard, then tabs on to the actions", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(<Accordion items={RICH_ITEMS} onChange={onChange} />);
		await user.tab();
		expect(screen.getByRole("button", { name: "Acme" })).toHaveFocus();
		await user.keyboard("{Enter}");
		expect(onChange).toHaveBeenCalledWith(["acme"]);
		await user.tab();
		expect(
			screen.getByRole("button", { name: "Add project" })
		).toHaveFocus();
	});

	it("places the chevron after the title by default", () => {
		render(<Accordion items={ITEMS} onChange={() => {}} />);
		const toggle = screen.getByRole("button", { name: /Section A/ });
		expect(toggle.firstElementChild).toHaveTextContent("Section A");
	});

	it("places the chevron before the title with chevronPosition=start", () => {
		render(
			<Accordion
				items={ITEMS}
				onChange={() => {}}
				chevronPosition="start"
			/>
		);
		const toggle = screen.getByRole("button", { name: /Section A/ });
		expect(toggle.firstElementChild).not.toHaveTextContent("Section A");
		expect(toggle.lastElementChild).toHaveTextContent("Section A");
	});

	it("rotates the chevron per position and state", () => {
		expect(chevronRotation("end", false)).toBe(90);
		expect(chevronRotation("end", true)).toBe(270);
		expect(chevronRotation("start", false)).toBe(0);
		expect(chevronRotation("start", true)).toBe(90);
	});

	it("wraps each header row in a heading when headingLevel is set", () => {
		render(
			<Accordion items={ITEMS} onChange={() => {}} headingLevel={3} />
		);
		const headings = screen.getAllByRole("heading", { level: 3 });
		expect(headings).toHaveLength(3);
		expect(headings[0]).toContainElement(
			screen.getByRole("button", { name: /Section A/ })
		);
	});

	it("renders no heading by default", () => {
		render(<Accordion items={ITEMS} onChange={() => {}} />);
		expect(screen.queryByRole("heading")).not.toBeInTheDocument();
	});

	it("keeps actions usable on a disabled item, which does not toggle", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<Accordion
				items={[{ ...RICH_ITEMS[0], disabled: true }]}
				onChange={onChange}
			/>
		);
		await user.click(screen.getByRole("button", { name: "Acme" }));
		expect(onChange).not.toHaveBeenCalled();
		expect(
			screen.getByRole("button", { name: "Add project" })
		).toBeEnabled();
	});
});
