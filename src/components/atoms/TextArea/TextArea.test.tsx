import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { TextArea } from "./TextArea";

describe("TextArea", () => {
	it("defaults size to md when no prop and no AmphoreProvider default is given", () => {
		const { container } = render(
			<TextArea label="Description" value="" onChange={() => {}} />
		);
		expect(container.querySelector("[data-size]")).toHaveAttribute(
			"data-size",
			"md"
		);
	});

	it("falls back to AmphoreProvider's config.defaults.size when no size prop is given", () => {
		const { container } = render(
			<AmphoreProvider config={{ defaults: { size: "lg" } }}>
				<TextArea label="Description" value="" onChange={() => {}} />
			</AmphoreProvider>
		);
		expect(container.querySelector("[data-size]")).toHaveAttribute(
			"data-size",
			"lg"
		);
	});

	it("an explicit size prop wins over AmphoreProvider's default", () => {
		const { container } = render(
			<AmphoreProvider config={{ defaults: { size: "lg" } }}>
				<TextArea
					label="Description"
					value=""
					onChange={() => {}}
					size="sm"
				/>
			</AmphoreProvider>
		);
		expect(container.querySelector("[data-size]")).toHaveAttribute(
			"data-size",
			"sm"
		);
	});

	it("renders label and links it to the field", () => {
		render(<TextArea label="Description" value="" onChange={() => {}} />);
		expect(screen.getByLabelText("Description")).toBeInTheDocument();
	});

	it("is fully controlled — value comes only from props", () => {
		render(
			<TextArea label="Description" value="Amphore" onChange={() => {}} />
		);
		expect(screen.getByLabelText("Description")).toHaveValue("Amphore");
	});

	it("calls onChange with the new string value, not an event", async () => {
		const onChange = vi.fn();
		render(<TextArea label="Description" value="" onChange={onChange} />);
		await userEvent.type(screen.getByLabelText("Description"), "a");
		expect(onChange).toHaveBeenCalledWith("a", expect.anything());
	});

	it("shows the error message and links it via aria-describedby", () => {
		render(
			<TextArea
				label="Bio"
				value=""
				onChange={() => {}}
				error="Trop long"
			/>
		);
		expect(screen.getByRole("alert")).toHaveTextContent("Trop long");
		const textarea = screen.getByLabelText("Bio");
		expect(textarea).toHaveAttribute("aria-invalid", "true");
		const describedBy = textarea.getAttribute("aria-describedby");
		expect(describedBy).toBeTruthy();
		expect(document.getElementById(describedBy!)).toHaveTextContent(
			"Trop long"
		);
	});

	it("shows a character counter when showCharCounter and maxLength are set", () => {
		render(
			<TextArea
				label="Bio"
				value="abc"
				onChange={() => {}}
				maxLength={10}
				showCharCounter
			/>
		);
		expect(screen.getByText("3 / 10")).toBeInTheDocument();
	});

	it("hides the character counter without maxLength even if showCharCounter is set", () => {
		render(
			<TextArea
				label="Bio"
				value="abc"
				onChange={() => {}}
				showCharCounter
			/>
		);
		expect(screen.queryByText(/\/\s*undefined/)).not.toBeInTheDocument();
	});

	it("respects disabled", () => {
		render(
			<TextArea
				label="Description"
				value=""
				onChange={() => {}}
				disabled
			/>
		);
		expect(screen.getByLabelText("Description")).toBeDisabled();
	});

	it("resizes the textarea by dragging the custom handle", () => {
		render(<TextArea label="Description" value="" onChange={() => {}} />);
		const textarea = screen.getByLabelText(
			"Description"
		) as HTMLTextAreaElement;
		Object.defineProperty(textarea, "offsetHeight", {
			configurable: true,
			value: 80,
		});
		const handle = screen.getByTestId("textarea-resize-handle");

		fireEvent.pointerDown(handle, { clientY: 100 });
		fireEvent(document, new PointerEvent("pointermove", { clientY: 150 }));
		fireEvent(document, new PointerEvent("pointerup"));

		expect(textarea.style.height).toBe("130px");
	});

	it("clamps the dragged height to a sane minimum", () => {
		render(<TextArea label="Description" value="" onChange={() => {}} />);
		const textarea = screen.getByLabelText(
			"Description"
		) as HTMLTextAreaElement;
		Object.defineProperty(textarea, "offsetHeight", {
			configurable: true,
			value: 80,
		});
		const handle = screen.getByTestId("textarea-resize-handle");

		fireEvent.pointerDown(handle, { clientY: 100 });
		fireEvent(document, new PointerEvent("pointermove", { clientY: -500 }));
		fireEvent(document, new PointerEvent("pointerup"));

		expect(textarea.style.height).toBe("48px");
	});

	it("hides the resize handle when resizable is false", () => {
		render(
			<TextArea
				label="Description"
				value=""
				onChange={() => {}}
				resizable={false}
			/>
		);
		expect(
			screen.queryByTestId("textarea-resize-handle")
		).not.toBeInTheDocument();
	});

	it("hides the resize handle when disabled", () => {
		render(
			<TextArea
				label="Description"
				value=""
				onChange={() => {}}
				disabled
			/>
		);
		expect(
			screen.queryByTestId("textarea-resize-handle")
		).not.toBeInTheDocument();
	});

	it("still shows the resize handle when autoGrow is set — the two combine, not replace", () => {
		render(
			<TextArea
				label="Description"
				value=""
				onChange={() => {}}
				autoGrow
			/>
		);
		expect(
			screen.getByTestId("textarea-resize-handle")
		).toBeInTheDocument();
	});

	it("does not force overflowY when maxRows isn't set — that's the scroll-disappears bug", () => {
		const { rerender } = render(
			<TextArea
				label="Description"
				value="a"
				onChange={() => {}}
				autoGrow
			/>
		);
		const textarea = screen.getByLabelText(
			"Description"
		) as HTMLTextAreaElement;
		Object.defineProperty(textarea, "scrollHeight", {
			configurable: true,
			value: 200,
		});
		rerender(
			<TextArea
				label="Description"
				value="a\nb"
				onChange={() => {}}
				autoGrow
			/>
		);
		expect(textarea.style.overflowY).toBe("");
	});

	it("a manual drag sets a floor autoGrow won't shrink below on the next value change", () => {
		const { rerender } = render(
			<TextArea
				label="Description"
				value="a"
				onChange={() => {}}
				autoGrow
			/>
		);
		const textarea = screen.getByLabelText(
			"Description"
		) as HTMLTextAreaElement;
		Object.defineProperty(textarea, "offsetHeight", {
			configurable: true,
			value: 60,
		});
		Object.defineProperty(textarea, "scrollHeight", {
			configurable: true,
			value: 60,
		});
		const handle = screen.getByTestId("textarea-resize-handle");

		// Drag up to 200px tall — well beyond what "a" alone needs.
		fireEvent.pointerDown(handle, { clientY: 500 });
		fireEvent(document, new PointerEvent("pointermove", { clientY: 640 }));
		fireEvent(document, new PointerEvent("pointerup"));
		expect(textarea.style.height).toBe("200px");

		// Typing more (still well under 200px of content) shouldn't shrink it
		// back down — the manual size is a standing floor, not a one-off.
		rerender(
			<TextArea
				label="Description"
				value="a\nb"
				onChange={() => {}}
				autoGrow
			/>
		);
		expect(textarea.style.height).toBe("200px");
	});

	it("autoGrow sets the height to fit scrollHeight, resetting to auto first", () => {
		const { rerender } = render(
			<TextArea
				label="Description"
				value="a"
				onChange={() => {}}
				autoGrow
			/>
		);
		const textarea = screen.getByLabelText(
			"Description"
		) as HTMLTextAreaElement;
		Object.defineProperty(textarea, "scrollHeight", {
			configurable: true,
			value: 96,
		});

		rerender(
			<TextArea
				label="Description"
				value="a\nb"
				onChange={() => {}}
				autoGrow
			/>
		);
		expect(textarea.style.height).toBe("96px");
	});

	it("maxRows caps autoGrow's height and switches to internal scrolling past it", () => {
		vi.spyOn(window, "getComputedStyle").mockReturnValue({
			lineHeight: "20px",
			paddingTop: "8px",
			paddingBottom: "8px",
			borderTopWidth: "1px",
			borderBottomWidth: "1px",
		} as CSSStyleDeclaration);

		const { rerender } = render(
			<TextArea
				label="Description"
				value="a"
				onChange={() => {}}
				autoGrow
				maxRows={4}
			/>
		);
		const textarea = screen.getByLabelText(
			"Description"
		) as HTMLTextAreaElement;
		Object.defineProperty(textarea, "scrollHeight", {
			configurable: true,
			value: 300,
		});
		rerender(
			<TextArea
				label="Description"
				value="a\nb\nc"
				onChange={() => {}}
				autoGrow
				maxRows={4}
			/>
		);

		// 4 rows * 20px line-height + 16px padding + 2px border = 98px
		expect(textarea.style.height).toBe("98px");
		expect(textarea.style.overflowY).toBe("auto");
	});

	it("applies className to the field row, not the bare <textarea> — same convention as Select/DatePicker/TimePicker", () => {
		render(
			<TextArea
				label="Description"
				value=""
				onChange={() => {}}
				className="custom-field"
			/>
		);
		const textarea = screen.getByLabelText("Description");
		expect(textarea.className).not.toContain("custom-field");
		expect(textarea.parentElement).toHaveClass("custom-field");
	});
});
