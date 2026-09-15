import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { InputErrorMessage } from "./InputErrorMessage";

describe("InputErrorMessage", () => {
	it("renders its message", () => {
		render(<InputErrorMessage>Champ requis</InputErrorMessage>);
		expect(screen.getByRole("alert")).toHaveTextContent("Champ requis");
	});

	it("renders nothing when there's no message", () => {
		const { container } = render(<InputErrorMessage />);
		expect(container).toBeEmptyDOMElement();
	});
});
