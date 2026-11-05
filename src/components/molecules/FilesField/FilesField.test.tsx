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

describe("FilesField accessibility", () => {
	it("gives its id to one slot only", () => {
		const { container } = render(
			<FilesField id="docs" name="docs" maxFiles={3} />
		);
		const inputs = Array.from(
			container.querySelectorAll<HTMLInputElement>('input[type="file"]')
		);
		expect(inputs).toHaveLength(3);

		expect(inputs[0]).toHaveAttribute("id", "docs");
		expect(new Set(inputs.map((input) => input.id)).size).toBe(3);
	});

	it("names the group of slots", () => {
		render(
			<>
				<span id="external">Documents</span>
				<FilesField
					aria-labelledby="external"
					name="docs"
					maxFiles={2}
				/>
			</>
		);
		expect(
			screen.getByRole("group", { name: "Documents" })
		).toBeInTheDocument();
	});

	it("names a lone slot directly", () => {
		render(
			<>
				<span id="external">Documents</span>
				<FilesField
					data-testid="docs"
					aria-labelledby="external"
					name="docs"
				/>
			</>
		);
		expect(screen.getByTestId("docs-slot-0-input")).toHaveAccessibleName(
			"Documents"
		);
	});
});
