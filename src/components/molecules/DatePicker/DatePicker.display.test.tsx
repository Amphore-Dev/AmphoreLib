import React from "react";

import { Form, Formik } from "formik";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DatePicker } from "./DatePicker";

describe("DatePicker display", () => {
	it("shows the selected date (uncontrolled)", () => {
		render(<DatePicker selected={new Date(2026, 8, 10)} label="Date" />);
		const input = screen.getByDisplayValue("10/09/2026");
		expect(input).toBeTruthy();
	});

	it("shows the Formik field value in a form", () => {
		render(
			<Formik
				initialValues={{ field: new Date(2026, 8, 10) }}
				onSubmit={() => {}}
			>
				<Form>
					<DatePicker name="field" label="Date" />
				</Form>
			</Formik>
		);
		const input = screen.getByDisplayValue("10/09/2026");
		expect(input).toBeTruthy();
	});
});
