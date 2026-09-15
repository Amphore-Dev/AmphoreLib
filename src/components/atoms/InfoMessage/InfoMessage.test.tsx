import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { InfoMessage } from "./InfoMessage";

describe("InfoMessage", () => {
	it("renders its children", () => {
		render(<InfoMessage>Hello</InfoMessage>);
		expect(screen.getByText("Hello")).toBeInTheDocument();
	});

	it("uses role=status by default (info)", () => {
		render(<InfoMessage>Hello</InfoMessage>);
		expect(screen.getByRole("status")).toBeInTheDocument();
	});

	it("uses role=alert for danger and warning", () => {
		const { rerender } = render(
			<InfoMessage color="danger">Hello</InfoMessage>
		);
		expect(screen.getByRole("alert")).toBeInTheDocument();
		rerender(<InfoMessage color="warning">Hello</InfoMessage>);
		expect(screen.getByRole("alert")).toBeInTheDocument();
	});

	it("shows an icon by default", () => {
		render(<InfoMessage>Hello</InfoMessage>);
		expect(screen.getByTestId("info")).toBeInTheDocument();
	});

	it("hides the icon when hideIcon is set", () => {
		render(<InfoMessage hideIcon>Hello</InfoMessage>);
		expect(screen.queryByTestId("info")).not.toBeInTheDocument();
	});

	it("picks a default icon per color", () => {
		const { rerender } = render(
			<InfoMessage color="success">Hello</InfoMessage>
		);
		expect(screen.getByTestId("checkCircle")).toBeInTheDocument();
		rerender(<InfoMessage color="danger">Hello</InfoMessage>);
		expect(screen.getByTestId("alert")).toBeInTheDocument();
		rerender(<InfoMessage color="warning">Hello</InfoMessage>);
		expect(screen.getByTestId("alertTriangle")).toBeInTheDocument();
	});

	it("lets `picto` override the default icon", () => {
		render(
			<InfoMessage color="success" picto="star">
				Hello
			</InfoMessage>
		);
		expect(screen.getByTestId("star")).toBeInTheDocument();
	});

	it("defaults size to md", () => {
		render(<InfoMessage>Hello</InfoMessage>);
		expect(screen.getByRole("status")).toHaveAttribute("data-size", "md");
	});

	it("sets data-size when given", () => {
		render(<InfoMessage size="lg">Hello</InfoMessage>);
		expect(screen.getByRole("status")).toHaveAttribute("data-size", "lg");
	});

	it("sets data-color and data-variant", () => {
		render(
			<InfoMessage color="warning" variant="outline">
				Hello
			</InfoMessage>
		);
		const message = screen.getByRole("alert");
		expect(message).toHaveAttribute("data-color", "warning");
		expect(message).toHaveAttribute("data-variant", "outline");
	});

	it("forwards native div props and a custom className", () => {
		render(
			<InfoMessage className="custom" aria-label="Info">
				Hello
			</InfoMessage>
		);
		const message = screen.getByRole("status");
		expect(message).toHaveClass("custom");
		expect(message).toHaveAttribute("aria-label", "Info");
	});
});
