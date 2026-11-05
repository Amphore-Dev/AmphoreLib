import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TruncatedTooltipText } from "./TruncatedTooltipText";

// jsdom has no real layout — scrollWidth/clientWidth/scrollHeight/
// clientHeight are always 0, so overflow can't be exercised naturally.
// Stubbed on the prototype per test, restored after.
const stubLayout = (props: Partial<Record<string, number>>) => {
	Object.entries(props).forEach(([key, value]) => {
		Object.defineProperty(HTMLElement.prototype, key, {
			configurable: true,
			value,
		});
	});
};

afterEach(() => {
	["scrollWidth", "clientWidth", "scrollHeight", "clientHeight"].forEach(
		(key) => {
			delete (HTMLElement.prototype as Record<string, unknown>)[key];
		}
	);
});

describe("TruncatedTooltipText", () => {
	it("renders the children", () => {
		render(<TruncatedTooltipText>Hello world</TruncatedTooltipText>);
		expect(screen.getByText("Hello world")).toBeInTheDocument();
	});

	it("doesn't show a tooltip when the text fits (no overflow)", async () => {
		stubLayout({ scrollWidth: 100, clientWidth: 100 });
		const user = userEvent.setup();
		render(<TruncatedTooltipText>Hello</TruncatedTooltipText>);
		await user.hover(screen.getByText("Hello"));
		expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
	});

	it("shows a tooltip with the full content once overflowing (single line)", async () => {
		stubLayout({ scrollWidth: 200, clientWidth: 100 });
		const user = userEvent.setup();
		render(<TruncatedTooltipText>A long text</TruncatedTooltipText>);
		await user.hover(screen.getByText("A long text"));
		expect(await screen.findByRole("tooltip")).toHaveTextContent(
			"A long text"
		);
	});

	it("never shows a tooltip when tooltip=false, even while overflowing", async () => {
		stubLayout({ scrollWidth: 200, clientWidth: 100 });
		const user = userEvent.setup();
		render(
			<TruncatedTooltipText tooltip={false}>
				A long text
			</TruncatedTooltipText>
		);
		await user.hover(screen.getByText("A long text"));
		expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
	});

	it("checks scrollHeight/clientHeight instead when maxLines > 1", async () => {
		stubLayout({
			scrollWidth: 100,
			clientWidth: 100,
			scrollHeight: 60,
			clientHeight: 30,
		});
		const user = userEvent.setup();
		render(
			<TruncatedTooltipText maxLines={2}>
				Multi-line text
			</TruncatedTooltipText>
		);
		await user.hover(screen.getByText("Multi-line text"));
		expect(await screen.findByRole("tooltip")).toBeInTheDocument();
	});

	it("sets WebkitLineClamp when maxLines > 1", () => {
		render(<TruncatedTooltipText maxLines={3}>Text</TruncatedTooltipText>);
		expect(screen.getByText("Text")).toHaveStyle({ WebkitLineClamp: "3" });
	});

	it("forwards a custom className", () => {
		render(
			<TruncatedTooltipText className="custom">Text</TruncatedTooltipText>
		);
		expect(screen.getByText("Text")).toHaveClass("custom");
	});
});

describe("TruncatedTooltipText keyboard", () => {
	const truncate = () => {
		vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(
			200
		);
		vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(
			100
		);
	};

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("shows the full text on focus once truncated", async () => {
		truncate();
		const user = userEvent.setup();
		render(<TruncatedTooltipText>Long text</TruncatedTooltipText>);

		await user.tab();

		expect(await screen.findByRole("tooltip")).toHaveTextContent(
			"Long text"
		);
	});

	it("adds no tab stop when nothing is cut off", () => {
		render(<TruncatedTooltipText>Short</TruncatedTooltipText>);
		expect(screen.getByText("Short")).not.toHaveAttribute("tabindex");
	});

	it("adds no tab stop inside a link", () => {
		truncate();
		render(
			<a href="/x">
				<TruncatedTooltipText>Long text</TruncatedTooltipText>
			</a>
		);
		expect(screen.getByText("Long text")).not.toHaveAttribute("tabindex");
	});
});
