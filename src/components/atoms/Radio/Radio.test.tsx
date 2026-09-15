import { useState } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Radio } from "./Radio";

describe("Radio", () => {
	it("renders unchecked by default and links its label", () => {
		render(<Radio label="Jour" onChange={() => {}} />);
		expect(screen.getByLabelText("Jour")).not.toBeChecked();
	});

	it("is fully controlled — checked comes only from props", () => {
		render(<Radio label="Semaine" checked onChange={() => {}} />);
		expect(screen.getByLabelText("Semaine")).toBeChecked();
	});

	it("calls onChange with the new boolean value", async () => {
		const onChange = vi.fn();
		render(<Radio label="Semaine" checked={false} onChange={onChange} />);
		await userEvent.click(screen.getByLabelText("Semaine"));
		expect(onChange).toHaveBeenCalledWith(true, expect.anything());
	});

	it("behaves as a native radio group when sharing a name", async () => {
		const Group = () => {
			const [value, setValue] = useState("day");
			return (
				<>
					<Radio
						name="display"
						label="Jour"
						checked={value === "day"}
						onChange={() => setValue("day")}
					/>
					<Radio
						name="display"
						label="Semaine"
						checked={value === "week"}
						onChange={() => setValue("week")}
					/>
				</>
			);
		};
		render(<Group />);

		expect(screen.getByLabelText("Jour")).toBeChecked();
		await userEvent.click(screen.getByLabelText("Semaine"));
		expect(screen.getByLabelText("Semaine")).toBeChecked();
		expect(screen.getByLabelText("Jour")).not.toBeChecked();
	});

	it("shows the error message and links it via aria-describedby", () => {
		render(
			<Radio label="Jour" onChange={() => {}} error="Sélection requise" />
		);
		expect(screen.getByRole("alert")).toHaveTextContent(
			"Sélection requise"
		);
		const radio = screen.getByLabelText("Jour");
		const describedBy = radio.getAttribute("aria-describedby");
		expect(describedBy).toBeTruthy();
		expect(document.getElementById(describedBy!)).toHaveTextContent(
			"Sélection requise"
		);
	});

	it("respects disabled", () => {
		render(<Radio label="Jour" onChange={() => {}} disabled />);
		expect(screen.getByLabelText("Jour")).toBeDisabled();
	});
});
