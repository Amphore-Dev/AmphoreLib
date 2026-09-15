import React, { useState } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

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
