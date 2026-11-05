import React from "react";

import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
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
		expect(
			screen.getByRole("button", { name: "Home" })
		).toBeInTheDocument();
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

describe("Picto focus ring", () => {
	// jsdom doesn't apply stylesheets: it's the stylesheet that's asserted.
	it("isn't taken away from a clickable picto", () => {
		const css = readFileSync(join(__dirname, "Picto.scss"), "utf8");
		const wrapper = css.slice(
			css.indexOf("\n[data-amphore-svg-wrapper] {")
		);
		const focusVisible = wrapper.indexOf("&:focus-visible {");

		expect(focusVisible).toBeGreaterThan(wrapper.indexOf("&:focus {"));
		expect(wrapper.slice(focusVisible)).toMatch(
			/^&:focus-visible \{\s*outline: 2px solid/
		);
	});
});
