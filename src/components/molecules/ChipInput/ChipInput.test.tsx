import React, { useState } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { ChipInput, IChipInputProps } from "./ChipInput";

/** Holds the chips like a real consumer would, and reports every change. */
const Controlled = ({
	initial = [],
	onChange,
	...props
}: Omit<IChipInputProps, "value"> & { initial?: string[] }) => {
	const [value, setValue] = useState(initial);
	return (
		<ChipInput
			label="Tags"
			{...props}
			value={value}
			onChange={(next) => {
				setValue(next);
				onChange?.(next);
			}}
		/>
	);
};

const field = () => screen.getByLabelText("Tags") as HTMLInputElement;

describe("ChipInput", () => {
	it("renders its label, linked to the text field, and the chips", () => {
		render(<Controlled initial={["alpha", "beta"]} />);
		expect(field()).toHaveAttribute("type", "text");
		expect(screen.getByText("alpha")).toBeInTheDocument();
		expect(screen.getByText("beta")).toBeInTheDocument();
	});

	it("adds the typed text on Enter and empties the field", async () => {
		const onChange = vi.fn();
		render(<Controlled initial={["alpha"]} onChange={onChange} />);
		await userEvent.type(field(), "beta{Enter}");
		expect(onChange).toHaveBeenLastCalledWith(["alpha", "beta"]);
		expect(field()).toHaveValue("");
	});

	it("lets Enter submit the form when there is nothing to add", async () => {
		const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
		render(
			<form onSubmit={onSubmit}>
				<Controlled initial={["alpha"]} />
			</form>
		);
		await userEvent.type(field(), "{Enter}");
		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it("commits a chip at each separator while typing", async () => {
		const onChange = vi.fn();
		render(<Controlled onChange={onChange} />);
		await userEvent.type(field(), "alpha,beta gam");
		expect(onChange).toHaveBeenLastCalledWith(["alpha", "beta"]);
		expect(field()).toHaveValue("gam");
	});

	it("splits pasted text into chips, line breaks included", () => {
		const onChange = vi.fn();
		render(<Controlled onChange={onChange} />);
		fireEvent.paste(field(), {
			clipboardData: { getData: () => "a, b;c\nd\r\ne\n" },
		});
		expect(onChange).toHaveBeenLastCalledWith(["a", "b", "c", "d", "e"]);
		expect(field()).toHaveValue("");
	});

	it("keeps the last pasted token in the field when nothing ends it", () => {
		const onChange = vi.fn();
		render(<Controlled onChange={onChange} />);
		fireEvent.paste(field(), { clipboardData: { getData: () => "a\nb" } });
		expect(onChange).toHaveBeenLastCalledWith(["a"]);
		expect(field()).toHaveValue("b");
	});

	it("leaves a paste with no separator to the browser", () => {
		const onChange = vi.fn();
		render(<Controlled onChange={onChange} />);
		const notPrevented = fireEvent.paste(field(), {
			clipboardData: { getData: () => "alpha" },
		});
		expect(notPrevented).toBe(true);
		expect(onChange).not.toHaveBeenCalled();
	});

	it("splits text typed or dropped in one go", () => {
		const onChange = vi.fn();
		render(<Controlled onChange={onChange} />);
		fireEvent.change(field(), { target: { value: "a, b;c d " } });
		expect(onChange).toHaveBeenLastCalledWith(["a", "b", "c", "d"]);
		expect(field()).toHaveValue("");
	});

	it("takes custom separators", async () => {
		const onChange = vi.fn();
		render(<Controlled separators={/;/} onChange={onChange} />);
		await userEvent.type(field(), "Jean Dupont;");
		expect(onChange).toHaveBeenLastCalledWith(["Jean Dupont"]);
	});

	it("takes a global separators regex without skipping every other test", () => {
		const onChange = vi.fn();
		render(<Controlled separators={/,/g} onChange={onChange} />);
		fireEvent.change(field(), { target: { value: "a," } });
		fireEvent.change(field(), { target: { value: "b," } });
		expect(onChange).toHaveBeenLastCalledWith(["a", "b"]);
	});

	it("removes the last chip on Backspace in an empty field", async () => {
		const onChange = vi.fn();
		render(<Controlled initial={["alpha", "beta"]} onChange={onChange} />);
		await userEvent.type(field(), "{Backspace}");
		expect(onChange).toHaveBeenLastCalledWith(["alpha"]);
	});

	it("clears the typed text on Escape", async () => {
		render(<Controlled />);
		await userEvent.type(field(), "draft{Escape}");
		expect(field()).toHaveValue("");
	});

	it("removes a chip through its own remove button", async () => {
		const onChange = vi.fn();
		render(<Controlled initial={["alpha", "beta"]} onChange={onChange} />);
		await userEvent.click(
			screen.getByRole("button", { name: "Remove: alpha" })
		);
		expect(onChange).toHaveBeenLastCalledWith(["beta"]);
		expect(field()).toHaveFocus();
	});

	it("normalizes entries and skips duplicates", async () => {
		const onChange = vi.fn();
		render(
			<Controlled
				initial={["CHR"]}
				normalize={(v) => v.toUpperCase()}
				onChange={onChange}
			/>
		);
		await userEvent.type(field(), "chr t4 {Enter}");
		expect(onChange).toHaveBeenLastCalledWith(["CHR", "T4"]);
	});

	it("keeps duplicates with allowDuplicates", async () => {
		const onChange = vi.fn();
		render(
			<Controlled initial={["a"]} allowDuplicates onChange={onChange} />
		);
		await userEvent.type(field(), "a{Enter}");
		expect(onChange).toHaveBeenLastCalledWith(["a", "a"]);
	});

	it("adds an invalid entry flagged in danger, and reports it", async () => {
		const onInvalidValue = vi.fn();
		render(
			<Controlled
				validate={(v) => v.includes("@")}
				onInvalidValue={onInvalidValue}
			/>
		);
		await userEvent.type(field(), "nope{Enter}");
		expect(onInvalidValue).toHaveBeenCalledWith("nope");
		const chip = screen.getByText("nope").closest("[data-color]");
		expect(chip).toHaveAttribute("data-color", "danger");
		expect(chip).toHaveAttribute("aria-invalid", "true");
	});

	it("keeps an invalid entry in the field with rejectInvalid", async () => {
		const onChange = vi.fn();
		render(
			<Controlled
				validate={(v) => v.includes("@")}
				rejectInvalid
				onChange={onChange}
			/>
		);
		await userEvent.type(field(), "a@b.c nope ");
		expect(onChange).toHaveBeenLastCalledWith(["a@b.c"]);
		expect(field()).toHaveValue("nope");
	});

	it("stops at maxCount, keeps the rest in the field, and counts", () => {
		const onChange = vi.fn();
		render(<Controlled maxCount={3} initial={["a"]} onChange={onChange} />);
		expect(screen.getByText("1 / 3")).toBeInTheDocument();
		fireEvent.change(field(), { target: { value: "b c d " } });
		expect(onChange).toHaveBeenLastCalledWith(["a", "b", "c"]);
		expect(field()).toHaveValue("d");
		expect(screen.getByText("3 / 3")).toHaveAttribute("data-full", "true");
	});

	it("adds the text left in the field on blur, unless addOnBlur is off", async () => {
		const onChange = vi.fn();
		const { unmount } = render(<Controlled onChange={onChange} />);
		await userEvent.type(field(), "alpha");
		await userEvent.tab();
		expect(onChange).toHaveBeenLastCalledWith(["alpha"]);
		unmount();

		const onChangeOff = vi.fn();
		render(<Controlled addOnBlur={false} onChange={onChangeOff} />);
		await userEvent.type(field(), "alpha");
		await userEvent.tab();
		expect(onChangeOff).not.toHaveBeenCalled();
		expect(field()).toHaveValue("alpha");
	});

	it("disabled: no typing, no remove buttons", () => {
		render(<Controlled initial={["alpha"]} disabled />);
		expect(field()).toBeDisabled();
		expect(
			screen.queryByRole("button", { name: /Remove/ })
		).not.toBeInTheDocument();
	});

	it("shows the error and points the field at it", () => {
		render(<Controlled error="Invalid list" />);
		expect(screen.getByText("Invalid list")).toBeInTheDocument();
		expect(field()).toHaveAttribute("aria-invalid", "true");
		const describedBy = field().getAttribute("aria-describedby") ?? "";
		expect(document.getElementById(describedBy)).toHaveTextContent(
			"Invalid list"
		);
	});

	it("shows the placeholder only while there is no chip", () => {
		const { rerender } = render(
			<ChipInput label="Tags" value={[]} placeholder="CHR, T4" />
		);
		expect(field()).toHaveAttribute("placeholder", "CHR, T4");
		rerender(
			<ChipInput label="Tags" value={["CHR"]} placeholder="CHR, T4" />
		);
		expect(field()).not.toHaveAttribute("placeholder");
	});

	it("takes its remove label from the provider", () => {
		render(
			<AmphoreProvider locale="fr">
				<ChipInput label="Tags" value={["alpha"]} onChange={() => {}} />
			</AmphoreProvider>
		);
		expect(
			screen.getByRole("button", { name: "Retirer: alpha" })
		).toBeInTheDocument();
	});

	it("falls back to AmphoreProvider's config.defaults.size", () => {
		const { container } = render(
			<AmphoreProvider config={{ defaults: { size: "lg" } }}>
				<ChipInput label="Tags" value={[]} />
			</AmphoreProvider>
		);
		expect(container.querySelector("[data-size]")).toHaveAttribute(
			"data-size",
			"lg"
		);
	});
});
