import React, { useState } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { InputFile } from "./InputFile";

const makeFile = (name: string, type: string, sizeKb = 1) =>
	new File([new Uint8Array(sizeKb * 1024)], name, { type });

describe("InputFile", () => {
	it("renders the placeholder when empty", () => {
		render(<InputFile data-testid="input-file" placeholder="Add" />);
		expect(screen.getByText("Add")).toBeInTheDocument();
	});

	it("calls onChange with the selected file", () => {
		const onChange = vi.fn();
		render(<InputFile data-testid="input-file" onChange={onChange} />);
		const input = screen.getByTestId("input-file-input");
		const file = makeFile("a.png", "image/png");
		fireEvent.change(input, { target: { files: [file] } });
		expect(onChange).toHaveBeenCalledWith(file);
	});

	it("tags the picked file with an own enumerable signature (regression: a bare File has none, so Formik's react-fast-compare dirty-check saw every file as deep-equal to every other and never flipped `dirty`)", () => {
		const onChange = vi.fn();
		render(<InputFile data-testid="input-file" onChange={onChange} />);
		const input = screen.getByTestId("input-file-input");
		fireEvent.change(input, {
			target: { files: [makeFile("a.png", "image/png")] },
		});
		const picked = onChange.mock.calls[0][0] as File;
		expect(Object.keys(picked)).toContain("__sig");
	});

	it("shows the file name once a value is set", () => {
		const file = makeFile("report.pdf", "application/pdf");
		render(<InputFile data-testid="input-file" value={file} />);
		expect(screen.getByText("report.pdf")).toBeInTheDocument();
	});

	it("calls onChange(null) when removed", () => {
		const onChange = vi.fn();
		const file = makeFile("report.pdf", "application/pdf");
		render(
			<InputFile
				data-testid="input-file"
				value={file}
				onChange={onChange}
			/>
		);
		fireEvent.click(screen.getByTestId("input-file-remove"));
		expect(onChange).toHaveBeenCalledWith(null);
	});

	it("rejects a file with an unaccepted type", () => {
		const onChange = vi.fn();
		const onFileTypeError = vi.fn();
		render(
			<InputFile
				data-testid="input-file"
				accept=".pdf"
				onChange={onChange}
				onFileTypeError={onFileTypeError}
			/>
		);
		const input = screen.getByTestId("input-file-input");
		const file = makeFile("a.png", "image/png");
		fireEvent.change(input, { target: { files: [file] } });
		expect(onChange).not.toHaveBeenCalled();
		expect(onFileTypeError).toHaveBeenCalledWith(file);
	});

	it("rejects a file over the max size", () => {
		const onChange = vi.fn();
		const onMaxSizeError = vi.fn();
		render(
			<InputFile
				data-testid="input-file"
				maxFileSize={10}
				onChange={onChange}
				onMaxSizeError={onMaxSizeError}
			/>
		);
		const input = screen.getByTestId("input-file-input");
		const file = makeFile("big.png", "image/png", 20);
		fireEvent.change(input, { target: { files: [file] } });
		expect(onChange).not.toHaveBeenCalled();
		expect(onMaxSizeError).toHaveBeenCalledWith(file);
	});

	it("does not show a remove button when isRemovable is false", () => {
		const file = makeFile("report.pdf", "application/pdf");
		render(
			<InputFile
				data-testid="input-file"
				value={file}
				isRemovable={false}
			/>
		);
		expect(
			screen.queryByTestId("input-file-remove")
		).not.toBeInTheDocument();
	});

	it("defaults to a vertical layout (preview above a footer)", () => {
		const file = makeFile("report.pdf", "application/pdf");
		const { container } = render(
			<InputFile data-testid="input-file" value={file} />
		);
		expect(container.querySelector("[data-orientation]")).toHaveAttribute(
			"data-orientation",
			"vertical"
		);
	});

	it("shows the file size only in horizontal orientation", () => {
		const file = makeFile("report.pdf", "application/pdf", 2048); // 2 MB
		const { rerender } = render(
			<InputFile
				data-testid="input-file"
				value={file}
				orientation="vertical"
			/>
		);
		expect(screen.queryByText(/MB|KB/)).not.toBeInTheDocument();

		rerender(
			<InputFile
				data-testid="input-file"
				value={file}
				orientation="horizontal"
			/>
		);
		expect(screen.getByText(/MB/)).toBeInTheDocument();
	});

	it("renders the preview+footer inline (horizontal), never overlaid on top of each other", () => {
		const file = makeFile("report.pdf", "application/pdf");
		const { container } = render(
			<InputFile
				data-testid="input-file"
				value={file}
				orientation="horizontal"
			/>
		);
		const card = container.querySelector("[data-orientation]");
		expect(card).toHaveAttribute("data-orientation", "horizontal");
		expect(card).toHaveAttribute("data-filled");
	});
});

describe("InputFile accessibility", () => {
	const file = new File(["x"], "report.pdf", { type: "application/pdf" });

	it("can be reached by the keyboard", async () => {
		const user = userEvent.setup();
		render(<InputFile data-testid="input-file" />);

		await user.tab();

		const input = screen.getByTestId("input-file-input");
		expect(input).toHaveFocus();
		expect(input).not.toHaveAttribute("hidden");
	});

	it("is named even at a size that hides its placeholder", () => {
		render(
			<InputFile
				data-testid="input-file"
				size="sm"
				orientation="vertical"
			/>
		);
		expect(screen.getByTestId("input-file-input")).toHaveAccessibleName(
			"Add a file"
		);
	});

	it("is named through an external label", () => {
		render(
			<>
				<span id="external">Invoice</span>
				<InputFile
					data-testid="input-file"
					aria-labelledby="external"
				/>
			</>
		);
		expect(screen.getByTestId("input-file-input")).toHaveAccessibleName(
			"Invoice"
		);
	});

	it("states an error and required", () => {
		render(<InputFile data-testid="input-file" error="Too big" required />);
		const input = screen.getByTestId("input-file-input");

		expect(input).toHaveAttribute("aria-invalid", "true");
		expect(input).toHaveAttribute("aria-required", "true");
		expect(input).toHaveAccessibleDescription("Too big");
	});

	it("moves focus back to the input after removing the file", async () => {
		const user = userEvent.setup();
		const Controlled = () => {
			const [value, setValue] = useState<File | null>(file);
			return (
				<InputFile
					data-testid="input-file"
					value={value}
					onChange={setValue}
				/>
			);
		};
		render(<Controlled />);

		await user.tab();
		expect(screen.getByTestId("input-file-remove")).toHaveFocus();
		await user.keyboard("{Enter}");

		expect(screen.getByTestId("input-file-input")).toHaveFocus();
	});
});
