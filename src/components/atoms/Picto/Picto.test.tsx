import React from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Picto } from "./Picto";

describe("Picto", () => {
	// The device kinds of a "signed-in devices" list.
	it.each(["smartphone", "monitor", "tablet"] as const)(
		"draws the %s picto by name",
		(icon) => {
			const { container } = render(<Picto icon={icon} />);
			expect(screen.getByTestId(icon)).toBeInTheDocument();
			expect(container.querySelector("svg")).toBeInTheDocument();
		}
	);
});

describe("Picto accessibility", () => {
	it("names a clickable picto", () => {
		render(<Picto icon="home" onClick={() => {}} aria-label="Home" />);
		expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
	});

	it("is decorative by default", () => {
		const { container } = render(<Picto icon="home" />);
		expect(container.querySelector("svg")).toHaveAttribute(
			"aria-hidden",
			"true"
		);
	});

	it("doesn't read an image's file role as text", () => {
		const { container } = render(<Picto src="/icon.png" />);
		expect(container.querySelector("img")).toHaveAttribute("alt", "");
	});
});
