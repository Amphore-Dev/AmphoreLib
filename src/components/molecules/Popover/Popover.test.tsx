import React, { useState } from "react";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import {
	expectInline,
	expectPortaledWithScope,
} from "../../../../tests/expectPortal";

import { Popover } from "./Popover";

describe("Popover (uncontrolled)", () => {
	it("does not render the content until clicked", () => {
		render(
			<Popover content="Contenu">
				<button type="button">Ouvrir</button>
			</Popover>
		);
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("opens on click of the trigger", async () => {
		const user = userEvent.setup();
		render(
			<Popover content="Contenu">
				<button type="button">Ouvrir</button>
			</Popover>
		);
		await user.click(screen.getByRole("button", { name: "Ouvrir" }));
		expect(screen.getByRole("dialog")).toHaveTextContent("Contenu");
	});

	it("closes on a second click of the trigger (toggle)", async () => {
		const user = userEvent.setup();
		render(
			<Popover content="Contenu">
				<button type="button">Ouvrir</button>
			</Popover>
		);
		const trigger = screen.getByRole("button", { name: "Ouvrir" });
		await user.click(trigger);
		expect(screen.getByRole("dialog")).toBeInTheDocument();
		await user.click(trigger);
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("closes on outside click by default", async () => {
		const user = userEvent.setup();
		render(
			<div>
				<Popover content="Contenu">
					<button type="button">Ouvrir</button>
				</Popover>
				<button type="button">Ailleurs</button>
			</div>
		);
		await user.click(screen.getByRole("button", { name: "Ouvrir" }));
		expect(screen.getByRole("dialog")).toBeInTheDocument();
		await user.click(screen.getByRole("button", { name: "Ailleurs" }));
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("stays open on outside click when closeOnOutsideClick is false", async () => {
		const user = userEvent.setup();
		render(
			<div>
				<Popover content="Contenu" closeOnOutsideClick={false}>
					<button type="button">Ouvrir</button>
				</Popover>
				<button type="button">Ailleurs</button>
			</div>
		);
		await user.click(screen.getByRole("button", { name: "Ouvrir" }));
		await user.click(screen.getByRole("button", { name: "Ailleurs" }));
		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});

	it("never opens when disabled", async () => {
		const user = userEvent.setup();
		render(
			<Popover content="Contenu" disabled>
				<button type="button">Ouvrir</button>
			</Popover>
		);
		await user.click(screen.getByRole("button", { name: "Ouvrir" }));
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});

	it("stays open on a content click by default (closeOnClick off)", async () => {
		const user = userEvent.setup();
		render(
			<Popover content={<button type="button">Choix A</button>}>
				<button type="button">Ouvrir</button>
			</Popover>
		);
		await user.click(screen.getByRole("button", { name: "Ouvrir" }));
		await user.click(screen.getByRole("button", { name: "Choix A" }));
		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});

	it("closes on a content click when closeOnClick is set", async () => {
		const user = userEvent.setup();
		const onPick = vi.fn();
		render(
			<Popover
				content={
					<button type="button" onClick={onPick}>
						Choix A
					</button>
				}
				closeOnClick
			>
				<button type="button">Ouvrir</button>
			</Popover>
		);
		await user.click(screen.getByRole("button", { name: "Ouvrir" }));
		await user.click(screen.getByRole("button", { name: "Choix A" }));
		expect(onPick).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});
});

describe("Popover matchTriggerWidth", () => {
	// Mocked before render: the position is computed once, on mount.
	const renderWithTriggerWidth = (matchTriggerWidth: boolean) => {
		vi.spyOn(
			HTMLButtonElement.prototype,
			"getBoundingClientRect"
		).mockReturnValue(DOMRect.fromRect({ width: 420, height: 40 }));
		render(
			<Popover
				open
				content="Contenu"
				matchTriggerWidth={matchTriggerWidth}
			>
				<button type="button">Ouvrir</button>
			</Popover>
		);
	};

	afterEach(() => vi.restoreAllMocks());

	it("sizes the popover to at least the trigger's width", async () => {
		renderWithTriggerWidth(true);
		await waitFor(() =>
			expect(screen.getByRole("dialog").style.minWidth).toBe("420px")
		);
	});

	it("leaves the popover's width alone by default", async () => {
		renderWithTriggerWidth(false);
		await waitFor(() =>
			expect(screen.getByRole("dialog").style.top).not.toBe("")
		);
		expect(screen.getByRole("dialog").style.minWidth).toBe("");
	});
});

describe("Popover (controlled)", () => {
	it("reflects the controlled open prop, and calls onOpenChange on trigger click", async () => {
		const user = userEvent.setup();
		const onOpenChange = vi.fn();

		const Wrapper = () => {
			const [open, setOpen] = useState(false);
			return (
				<Popover
					content="Contenu"
					open={open}
					onOpenChange={(next) => {
						onOpenChange(next);
						setOpen(next);
					}}
				>
					<button type="button">Ouvrir</button>
				</Popover>
			);
		};

		render(<Wrapper />);
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		await user.click(screen.getByRole("button", { name: "Ouvrir" }));
		expect(onOpenChange).toHaveBeenCalledWith(true);
		expect(screen.getByRole("dialog")).toBeInTheDocument();
	});
});

describe("Popover portal", () => {
	it("renders the content inline by default", async () => {
		const user = userEvent.setup();
		const { container } = render(
			<Popover content={<p>Contenu</p>}>
				<button type="button">Ouvrir</button>
			</Popover>
		);
		await user.click(screen.getByRole("button", { name: "Ouvrir" }));
		expectInline(container, screen.getByRole("dialog"));
	});

	it("renders into document.body with the theme scope when portal is set", async () => {
		const user = userEvent.setup();
		const { container } = render(
			<AmphoreProvider>
				<Popover content={<p>Contenu</p>} portal>
					<button type="button">Ouvrir</button>
				</Popover>
			</AmphoreProvider>
		);
		await user.click(screen.getByRole("button", { name: "Ouvrir" }));
		const dialog = screen.getByRole("dialog");
		expectPortaledWithScope(container, dialog);
		expect(dialog).toHaveTextContent("Contenu");
	});

	it("still closes on outside click when portaled", async () => {
		const user = userEvent.setup();
		const onOpenChange = vi.fn();
		render(
			<AmphoreProvider>
				<Popover
					content={<p>Contenu</p>}
					portal
					onOpenChange={onOpenChange}
				>
					<button type="button">Ouvrir</button>
				</Popover>
			</AmphoreProvider>
		);
		await user.click(screen.getByRole("button", { name: "Ouvrir" }));
		await user.click(document.body);
		expect(onOpenChange).toHaveBeenLastCalledWith(false);
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});
});

describe("Popover keyboard", () => {
	it("moves focus into the content, and back to the trigger on Escape", async () => {
		const user = userEvent.setup();
		render(
			<Popover content={<button type="button">Inside</button>}>
				<button type="button">Open</button>
			</Popover>
		);

		await user.click(screen.getByRole("button", { name: "Open" }));
		await waitFor(() =>
			expect(screen.getByRole("button", { name: "Inside" })).toHaveFocus()
		);

		await user.keyboard("{Escape}");

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
		await waitFor(() =>
			expect(screen.getByRole("button", { name: "Open" })).toHaveFocus()
		);
	});

	it("reaches a portaled popover from the keyboard", async () => {
		const user = userEvent.setup();
		render(
			<>
				<Popover portal content={<button type="button">Inside</button>}>
					<button type="button">Open</button>
				</Popover>
				<button type="button">After</button>
			</>
		);

		screen.getByRole("button", { name: "Open" }).focus();
		await user.keyboard("{Enter}");

		await waitFor(() =>
			expect(screen.getByRole("button", { name: "Inside" })).toHaveFocus()
		);
	});

	it("closes when tabbing out", async () => {
		const user = userEvent.setup();
		render(
			<>
				<Popover content={<button type="button">Inside</button>}>
					<button type="button">Open</button>
				</Popover>
				<button type="button">After</button>
			</>
		);

		await user.click(screen.getByRole("button", { name: "Open" }));
		await waitFor(() =>
			expect(screen.getByRole("button", { name: "Inside" })).toHaveFocus()
		);
		await user.tab();

		await waitFor(() =>
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
		);
	});

	it("leaves focus on the trigger with matchTriggerWidth", async () => {
		const user = userEvent.setup();
		render(
			<Popover matchTriggerWidth open content="Suggestions">
				<input aria-label="Search" />
			</Popover>
		);

		await user.click(screen.getByRole("textbox", { name: "Search" }));

		expect(screen.getByRole("textbox")).toHaveFocus();
	});
});

describe("Popover name", () => {
	it("is named by its trigger by default", async () => {
		const user = userEvent.setup();
		render(
			<Popover content="Content">
				<button type="button">Details</button>
			</Popover>
		);

		await user.click(screen.getByRole("button", { name: "Details" }));

		expect(
			await screen.findByRole("dialog", { name: "Details" })
		).toBeInTheDocument();
	});

	it("takes an explicit name", async () => {
		const user = userEvent.setup();
		render(
			<Popover content="Content" aria-label="Calendar">
				<button type="button">Details</button>
			</Popover>
		);

		await user.click(screen.getByRole("button", { name: "Details" }));

		expect(
			await screen.findByRole("dialog", { name: "Calendar" })
		).toBeInTheDocument();
	});
});
