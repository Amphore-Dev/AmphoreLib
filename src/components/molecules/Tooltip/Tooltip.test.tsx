import React from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
	it("does not render the tooltip content until triggered", () => {
		render(
			<Tooltip content="Astuce">
				<button type="button">Cible</button>
			</Tooltip>
		);
		expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
	});

	it("shows the tooltip on hover", async () => {
		const user = userEvent.setup();
		render(
			<Tooltip content="Astuce">
				<button type="button">Cible</button>
			</Tooltip>
		);
		await user.hover(screen.getByRole("button", { name: "Cible" }));
		expect(await screen.findByRole("tooltip")).toHaveTextContent("Astuce");
	});

	it("hides the tooltip on unhover", async () => {
		const user = userEvent.setup();
		render(
			<Tooltip content="Astuce">
				<button type="button">Cible</button>
			</Tooltip>
		);
		const trigger = screen.getByRole("button", { name: "Cible" });
		await user.hover(trigger);
		await screen.findByRole("tooltip");
		await user.unhover(trigger);
		expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
	});

	it("shows the tooltip on keyboard focus", async () => {
		const user = userEvent.setup();
		render(
			<Tooltip content="Astuce">
				<button type="button">Cible</button>
			</Tooltip>
		);
		await user.tab();
		expect(await screen.findByRole("tooltip")).toHaveTextContent("Astuce");
	});

	it("never shows when disabled", async () => {
		const user = userEvent.setup();
		render(
			<Tooltip content="Astuce" disabled>
				<button type="button">Cible</button>
			</Tooltip>
		);
		await user.hover(screen.getByRole("button", { name: "Cible" }));
		expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
	});

	it("does not render an empty tooltip when content is falsy", async () => {
		const user = userEvent.setup();
		render(
			<Tooltip content={null}>
				<button type="button">Cible</button>
			</Tooltip>
		);
		await user.hover(screen.getByRole("button", { name: "Cible" }));
		expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
	});

	it("preserves the trigger's own ref alongside the tooltip's", () => {
		const ref = React.createRef<HTMLButtonElement>();
		render(
			<Tooltip content="Astuce">
				<button type="button" ref={ref}>
					Cible
				</button>
			</Tooltip>
		);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});
});
