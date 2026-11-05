import React, { useState } from "react";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../components/atoms/Button/Button";
import { ChipInput } from "../components/molecules/ChipInput/ChipInput";
import { Dropdown } from "../components/molecules/Dropdown/Dropdown";
import { Modal } from "../components/molecules/Modal/Modal";
import { Popover } from "../components/molecules/Popover/Popover";
import { Select } from "../components/molecules/Select/Select";
import { Tooltip } from "../components/molecules/Tooltip/Tooltip";

import { useEscapeLayer } from "./useEscapeLayer";

const Layer: React.FC<{ onEscape: () => void; active?: boolean }> = ({
	onEscape,
	active = true,
}) => {
	useEscapeLayer(active, onEscape);
	return null;
};

describe("useEscapeLayer", () => {
	it("only reaches the most recently opened layer", async () => {
		const first = vi.fn();
		const second = vi.fn();
		const { rerender } = render(
			<>
				<Layer onEscape={first} />
				<Layer onEscape={second} />
			</>
		);

		await userEvent.keyboard("{Escape}");
		expect(second).toHaveBeenCalledTimes(1);
		expect(first).not.toHaveBeenCalled();

		rerender(
			<>
				<Layer onEscape={first} />
				<Layer onEscape={second} active={false} />
			</>
		);

		await userEvent.keyboard("{Escape}");
		expect(first).toHaveBeenCalledTimes(1);
	});

	it("leaves an Escape a field already handled alone", async () => {
		const onEscape = vi.fn();
		const handled = (e: React.KeyboardEvent) => e.preventDefault();
		render(
			<>
				<Layer onEscape={onEscape} />
				<input aria-label="Field" onKeyDown={handled} />
			</>
		);

		await userEvent.click(screen.getByRole("textbox"));
		await userEvent.keyboard("{Escape}");

		expect(onEscape).not.toHaveBeenCalled();
	});
});

describe("Escape in an overlay nested in a Modal", () => {
	const Nested: React.FC<{
		children: React.ReactNode;
		onClose: () => void;
	}> = ({ children, onClose }) => (
		<Modal open title="Edit" onClose={onClose}>
			{children}
		</Modal>
	);

	it("closes the Select's listbox, not the Modal", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(
			<Nested onClose={onClose}>
				<Select label="Fruit" options={[{ value: "a", label: "A" }]} />
			</Nested>
		);

		await user.click(screen.getByRole("combobox"));
		await screen.findByRole("listbox");
		await user.keyboard("{Escape}");

		expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
		expect(onClose).not.toHaveBeenCalled();

		await user.keyboard("{Escape}");
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("closes the Dropdown's menu, not the Modal", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(
			<Nested onClose={onClose}>
				<Dropdown items={[{ label: "Edit", onClick: () => {} }]}>
					<Button>Open</Button>
				</Dropdown>
			</Nested>
		);

		await user.click(screen.getByRole("button", { name: "Open" }));
		await screen.findByRole("menu");
		await user.keyboard("{Escape}");

		expect(screen.queryByRole("menu")).not.toBeInTheDocument();
		expect(onClose).not.toHaveBeenCalled();
	});

	it("closes the Popover, not the Modal", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(
			<Nested onClose={onClose}>
				<Popover content="Details">
					<Button>Open</Button>
				</Popover>
			</Nested>
		);

		await user.click(screen.getByRole("button", { name: "Open" }));
		await screen.findByText("Details");
		await user.keyboard("{Escape}");

		expect(screen.queryByText("Details")).not.toBeInTheDocument();
		expect(onClose).not.toHaveBeenCalled();
	});

	it("closes the Tooltip, not the Modal", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(
			<Nested onClose={onClose}>
				<Tooltip content="Hint">
					<Button>Save</Button>
				</Tooltip>
			</Nested>
		);

		await screen.findByRole("button", { name: "Save" });
		await user.hover(screen.getByRole("button", { name: "Save" }));
		await screen.findByRole("tooltip");
		await user.keyboard("{Escape}");

		expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
		expect(onClose).not.toHaveBeenCalled();
	});

	it("drops a ChipInput draft, not the Modal", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(
			<Nested onClose={onClose}>
				<ChipInput label="Tags" />
			</Nested>
		);

		// The Modal's initial focus lands a frame later: typing before it
		// would blur the field and commit the draft as a chip.
		await waitFor(() =>
			expect(screen.getByRole("button", { name: "Close" })).toHaveFocus()
		);
		await user.type(screen.getByLabelText("Tags"), "draft");
		await user.keyboard("{Escape}");

		expect(screen.getByLabelText("Tags")).toHaveValue("");
		expect(onClose).not.toHaveBeenCalled();
	});

	it("closes one Modal of two stacked", async () => {
		const user = userEvent.setup();
		const onCloseOuter = vi.fn();
		const Stacked = () => {
			const [inner, setInner] = useState(false);
			return (
				<Modal open title="Outer" onClose={onCloseOuter}>
					<Button onClick={() => setInner(true)}>Open</Button>
					<Modal
						open={inner}
						title="Inner"
						onClose={() => setInner(false)}
					>
						Body
					</Modal>
				</Modal>
			);
		};
		render(<Stacked />);

		await user.click(screen.getByRole("button", { name: "Open" }));
		await screen.findByRole("dialog", { name: "Inner" });
		await user.keyboard("{Escape}");

		expect(screen.queryByText("Inner")).not.toBeInTheDocument();
		expect(onCloseOuter).not.toHaveBeenCalled();
	});

	it("keeps the layer below closed while a Modal refuses Escape", async () => {
		const user = userEvent.setup();
		const onCloseOuter = vi.fn();
		const onCloseInner = vi.fn();
		const Stacked = () => {
			const [inner, setInner] = useState(false);
			return (
				<Modal open title="Outer" onClose={onCloseOuter}>
					<Button onClick={() => setInner(true)}>Open</Button>
					<Modal
						open={inner}
						title="Inner"
						onClose={onCloseInner}
						closeOnEscape={false}
					>
						Body
					</Modal>
				</Modal>
			);
		};
		render(<Stacked />);

		await user.click(screen.getByRole("button", { name: "Open" }));
		await screen.findByRole("dialog", { name: "Inner" });
		await user.keyboard("{Escape}");

		expect(onCloseInner).not.toHaveBeenCalled();
		expect(onCloseOuter).not.toHaveBeenCalled();
	});
});
