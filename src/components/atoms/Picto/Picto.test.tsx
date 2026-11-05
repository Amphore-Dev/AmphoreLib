import React from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { queryPicto } from "../../../../tests/queryPicto";

import { Picto } from "./Picto";

describe("Picto", () => {
	// The device kinds of a "signed-in devices" list.
	it.each(["smartphone", "monitor", "tablet"] as const)(
		"draws the %s picto by name",
		(icon) => {
			const { container } = render(<Picto icon={icon} />);
			expect(queryPicto(icon)).toBeInTheDocument();
			expect(container.querySelector("svg")).toBeInTheDocument();
		}
	);
});
