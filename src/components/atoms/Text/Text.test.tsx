import React, { createRef } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { Tooltip } from "../../molecules/Tooltip/Tooltip";

import { Text } from "./Text";

describe("Text", () => {
	it("renders a medium paragraph by default", () => {
		render(<Text>Hello</Text>);
		const text = screen.getByText("Hello");
		expect(text.tagName).toBe("P");
		expect(text).toHaveAttribute("data-size", "md");
	});

	it("follows its parent's weight and color when they aren't given", () => {
		render(<Text>Hello</Text>);
		const text = screen.getByText("Hello");
		expect(text).not.toHaveAttribute("data-weight");
		expect(text).not.toHaveAttribute("data-color");
	});

	it("renders the element given via `as`", () => {
		render(<Text as="strong">Hello</Text>);
		expect(screen.getByText("Hello").tagName).toBe("STRONG");
	});

	it("exposes size, weight and color as data attributes", () => {
		render(
			<Text size="sm" weight="semibold" color="sub">
				Hello
			</Text>
		);
		const text = screen.getByText("Hello");
		expect(text).toHaveAttribute("data-size", "sm");
		expect(text).toHaveAttribute("data-weight", "semibold");
		expect(text).toHaveAttribute("data-color", "sub");
	});

	it("labels a field with as='label'", () => {
		render(
			<>
				<Text as="label" htmlFor="email">
					Email
				</Text>
				<input id="email" />
			</>
		);
		expect(screen.getByLabelText("Email")).toBeInTheDocument();
	});

	it("falls back to config.defaults.size, and a size prop still wins", () => {
		render(
			<AmphoreProvider config={{ defaults: { size: "lg" } }}>
				<Text>From config</Text>
				<Text size="sm">Explicit</Text>
			</AmphoreProvider>
		);
		expect(screen.getByText("From config")).toHaveAttribute(
			"data-size",
			"lg"
		);
		expect(screen.getByText("Explicit")).toHaveAttribute("data-size", "sm");
	});

	it("forwards native props, className and ref", () => {
		const ref = createRef<HTMLElement>();
		render(
			<Text ref={ref} id="intro" className="custom">
				Hello
			</Text>
		);
		const text = screen.getByText("Hello");
		expect(text).toHaveAttribute("id", "intro");
		expect(text).toHaveClass("custom");
		expect(ref.current).toBe(text);
	});

	it("works as a Tooltip trigger", async () => {
		const user = userEvent.setup();
		render(
			<Tooltip content="More details">
				<Text as="span">Hover me</Text>
			</Tooltip>
		);
		await user.hover(screen.getByText("Hover me"));
		expect(await screen.findByText("More details")).toBeInTheDocument();
	});
});
