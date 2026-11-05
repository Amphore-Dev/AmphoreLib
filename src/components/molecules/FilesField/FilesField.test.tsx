import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FilesField } from "./FilesField";

const makeFile = (name: string) => new File(["a"], name, { type: "image/png" });

describe("FilesField", () => {
	it("renders a single slot by default", () => {
		render(<FilesField data-testid="docs" name="docs" />);
		expect(screen.getAllByTestId(/^docs-slot-\d+-input$/)).toHaveLength(1);
	});

	it("renders maxFiles slots", () => {
		render(<FilesField data-testid="docs" name="docs" maxFiles={3} />);
		expect(screen.getAllByTestId(/^docs-slot-\d+-input$/)).toHaveLength(3);
	});

	it("updates only the changed slot in the array", () => {
		const onChange = vi.fn();
		const file0 = makeFile("a.png");
		render(
			<FilesField
				data-testid="docs"
				name="docs"
				maxFiles={2}
				value={[file0, null]}
				onChange={onChange}
			/>
		);
		const [, secondSlot] = screen.getAllByTestId(/^docs-slot-\d+-input$/);
		const file1 = makeFile("b.png");
		fireEvent.change(secondSlot, { target: { files: [file1] } });
		expect(onChange).toHaveBeenCalledWith([file0, file1]);
	});

	it("forwards orientation to every InputFile slot, not just the outer grid", () => {
		const { container } = render(
			<FilesField name="docs" maxFiles={2} orientation="horizontal" />
		);
		const cards = container.querySelectorAll("[data-orientation]");
		expect(cards).toHaveLength(2);
		cards.forEach((card) =>
			expect(card).toHaveAttribute("data-orientation", "horizontal")
		);
	});
});
