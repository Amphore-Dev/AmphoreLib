import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ToolBar, TToolBarItem } from "./ToolBar";

const items: TToolBarItem[] = [
	{ id: "bold", label: "Gras", picto: "check" },
	{ id: "italic", label: "Italique" },
];

describe("ToolBar", () => {
	it("renders one button per item", () => {
		render(<ToolBar items={items} />);
		expect(
			screen.getByRole("button", { name: "Gras" })
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Italique" })
		).toBeInTheDocument();
	});

	it("renders the label as visible text when no picto is given", () => {
		render(<ToolBar items={items} />);
		expect(screen.getByText("Italique")).toBeInTheDocument();
	});

	it("calls onClick and onChange when a plain item is clicked", () => {
		const onClick = vi.fn();
		const onChange = vi.fn();
		render(
			<ToolBar
				items={[{ id: "bold", label: "Gras", onClick }]}
				onChange={onChange}
			/>
		);
		fireEvent.click(screen.getByRole("button", { name: "Gras" }));
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith("bold");
	});

	it("reflects activeItem via aria-pressed on a plain item", () => {
		render(<ToolBar items={items} activeItem="italic" />);
		expect(
			screen.getByRole("button", { name: "Italique" })
		).toHaveAttribute("aria-pressed", "true");
		expect(screen.getByRole("button", { name: "Gras" })).toHaveAttribute(
			"aria-pressed",
			"false"
		);
	});

	it("disables an item", () => {
		render(
			<ToolBar items={[{ id: "bold", label: "Gras", disabled: true }]} />
		);
		expect(screen.getByRole("button", { name: "Gras" })).toBeDisabled();
	});

	it("opens a popover for an item with popoverContent, and calls onChange", async () => {
		const onChange = vi.fn();
		render(
			<ToolBar
				items={[
					{
						id: "colors",
						label: "Couleurs",
						popoverContent: "Palette",
					},
				]}
				onChange={onChange}
			/>
		);
		await userEvent.click(screen.getByRole("button", { name: "Couleurs" }));
		expect(onChange).toHaveBeenCalledWith("colors");
	});

	it("shows the popover content when activeItem matches", () => {
		render(
			<ToolBar
				items={[
					{
						id: "colors",
						label: "Couleurs",
						popoverContent: "Palette",
					},
				]}
				activeItem="colors"
			/>
		);
		expect(screen.getByRole("dialog")).toHaveTextContent("Palette");
	});

	it("forwards a custom className", () => {
		const { container } = render(
			<ToolBar items={items} className="custom" />
		);
		expect(container.firstChild).toHaveClass("custom");
	});
});
