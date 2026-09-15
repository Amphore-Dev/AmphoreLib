import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Toggle } from "./Toggle";

describe("Toggle", () => {
	it("renders unchecked by default and links its label", () => {
		render(<Toggle label="Notifications" onChange={() => {}} />);
		expect(screen.getByLabelText("Notifications")).not.toBeChecked();
	});

	it("is fully controlled — checked comes only from props", () => {
		render(<Toggle label="Notifications" checked onChange={() => {}} />);
		expect(screen.getByLabelText("Notifications")).toBeChecked();
	});

	it("exposes the switch role", () => {
		render(<Toggle label="Notifications" onChange={() => {}} />);
		expect(screen.getByRole("switch")).toBeInTheDocument();
	});

	it("calls onChange with the new boolean value", async () => {
		const onChange = vi.fn();
		render(
			<Toggle label="Notifications" checked={false} onChange={onChange} />
		);
		await userEvent.click(screen.getByLabelText("Notifications"));
		expect(onChange).toHaveBeenCalledWith(true, expect.anything());
	});

	it("shows the error message and links it via aria-describedby", () => {
		render(
			<Toggle label="Notifications" onChange={() => {}} error="Erreur" />
		);
		expect(screen.getByRole("alert")).toHaveTextContent("Erreur");
		const toggle = screen.getByLabelText("Notifications");
		const describedBy = toggle.getAttribute("aria-describedby");
		expect(describedBy).toBeTruthy();
		expect(document.getElementById(describedBy!)).toHaveTextContent(
			"Erreur"
		);
	});

	it("respects disabled", () => {
		render(<Toggle label="Notifications" onChange={() => {}} disabled />);
		expect(screen.getByLabelText("Notifications")).toBeDisabled();
	});
});
