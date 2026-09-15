import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import { describe, expect, it, vi } from "vitest";

import { FieldRenderer } from "./FieldRenderer";

const renderInFormik = (
	ui: React.ReactElement,
	initialValues: Record<string, unknown> = {}
) => render(<Formik initialValues={initialValues}>{() => ui}</Formik>);

/** Same as `renderInFormik`, but also exposes the live Formik values as
 * `values` (updated on every render) — for asserting the field's default
 * onChange (no `onChange` prop of its own) actually wrote through
 * `setFieldValue`, instead of just checking the field doesn't crash. */
const renderWithValues = (
	build: () => React.ReactElement,
	initialValues: Record<string, unknown> = {}
) => {
	const values: { current: Record<string, unknown> } = { current: {} };
	const utils = render(
		<Formik initialValues={initialValues}>
			{(formik) => {
				values.current = formik.values;
				return build();
			}}
		</Formik>
	);
	return { ...utils, values };
};

describe("FieldRenderer", () => {
	it("renders an Input by default (no type)", () => {
		renderInFormik(<FieldRenderer name="label" label="Label" />);
		expect(screen.getByLabelText("Label")).toBeInTheDocument();
	});

	it("renders nothing when hidden", () => {
		renderInFormik(<FieldRenderer name="label" label="Label" hidden />);
		expect(screen.queryByLabelText("Label")).not.toBeInTheDocument();
	});

	it("renders a Toggle with checked from the injected value", () => {
		renderInFormik(
			<FieldRenderer
				name="active"
				type="toggle"
				label="Actif"
				value={true}
			/>
		);
		expect(screen.getByLabelText("Actif")).toBeChecked();
	});

	it("renders a Select for type=select", () => {
		renderInFormik(
			<FieldRenderer
				name="color"
				type="select"
				label="Couleur"
				options={[{ label: "Rouge", value: "red" }]}
			/>
		);
		expect(screen.getByText("Couleur")).toBeInTheDocument();
	});

	it("prefers a custom renderer over the built-in map", () => {
		renderInFormik(
			<FieldRenderer
				name="custom"
				type="input"
				customRenderers={{
					input: () => <div data-testid="custom-input" />,
				}}
			/>
		);
		expect(screen.getByTestId("custom-input")).toBeInTheDocument();
	});

	it("prefers a per-field renderer over customRenderers", () => {
		renderInFormik(
			<FieldRenderer
				name="custom"
				type="input"
				renderer={() => <div data-testid="field-renderer" />}
				customRenderers={{
					input: () => <div data-testid="custom-input" />,
				}}
			/>
		);
		expect(screen.getByTestId("field-renderer")).toBeInTheDocument();
		expect(screen.queryByTestId("custom-input")).not.toBeInTheDocument();
	});

	it("calls a field's own onChange instead of touching Formik", () => {
		const onChange = vi.fn();
		renderInFormik(
			<FieldRenderer
				name="checkbox"
				type="checkbox"
				options={[{ label: "Un", value: "1" }]}
				onChange={onChange}
			/>
		);
		screen.getByLabelText("Un").click();
		expect(onChange).toHaveBeenCalledWith(["1"]);
	});

	it("checkbox falls back to writing through Formik when it has no own onChange", () => {
		const { values } = renderWithValues(
			() => (
				<FieldRenderer
					name="perks"
					type="checkbox"
					options={[{ label: "Un", value: "1" }]}
				/>
			),
			{ perks: [] }
		);
		screen.getByLabelText("Un").click();
		expect(values.current.perks).toEqual(["1"]);
	});

	it("radio falls back to writing through Formik when it has no own onChange", () => {
		const { values } = renderWithValues(
			() => (
				<FieldRenderer
					name="plan"
					type="radio"
					options={[
						{ label: "Basique", value: "basic" },
						{ label: "Pro", value: "pro" },
					]}
				/>
			),
			{ plan: "basic" }
		);
		fireEvent.click(screen.getByLabelText("Pro"));
		expect(values.current.plan).toBe("pro");
	});

	it("toggle falls back to writing through Formik when it has no own onChange", () => {
		const { values } = renderWithValues(
			() => (
				<FieldRenderer
					name="active"
					type="toggle"
					label="Actif"
					value={false}
				/>
			),
			{ active: false }
		);
		fireEvent.click(screen.getByLabelText("Actif"));
		expect(values.current.active).toBe(true);
	});

	it("number falls back to writing through Formik when it has no own onChange", async () => {
		const user = userEvent.setup();
		const { values } = renderWithValues(
			() => (
				<FieldRenderer
					name="qty"
					type="number"
					label="Quantité"
					value={null}
				/>
			),
			{ qty: null }
		);
		await user.type(screen.getByLabelText("Quantité"), "42");
		expect(values.current.qty).toBe(42);
	});

	it("time falls back to writing through Formik when it has no own onChange", () => {
		const { values } = renderWithValues(
			() => (
				<FieldRenderer
					name="start"
					type="time"
					label="Heure"
					value={null}
				/>
			),
			{ start: null }
		);
		fireEvent.change(screen.getByLabelText("Heure — hours"), {
			target: { value: "14" },
		});
		fireEvent.change(screen.getByLabelText("Heure — minutes"), {
			target: { value: "30" },
		});
		fireEvent.blur(screen.getByLabelText("Heure — minutes"));
		expect(values.current.start).toBe("14:30");
	});

	it("date falls back to writing through Formik when it has no own onChange", async () => {
		const user = userEvent.setup();
		const { values } = renderWithValues(
			() => (
				<FieldRenderer
					name="birthDate"
					type="date"
					label="Date"
					value={null}
				/>
			),
			{ birthDate: null }
		);
		await user.click(screen.getByRole("button"));
		await user.click(screen.getAllByText("15")[0]);
		expect(values.current.birthDate).toBeInstanceOf(Date);
	});

	it("period falls back to writing through Formik, per from/to side, when it has no own onChange", async () => {
		const user = userEvent.setup();
		const { values } = renderWithValues(
			() =>
				(
					<FieldRenderer
						name="period"
						type="period"
						from={{ label: "Du" }}
						to={{ label: "Au" }}
						value={null}
					/>
				) as unknown as React.ReactElement,
			{ from: null, to: null }
		);
		await user.click(screen.getByLabelText("Du"));
		await user.click(screen.getAllByText("15")[0]);
		expect(values.current.from).toBeInstanceOf(Date);
	});

	it("timeRange falls back to writing through Formik, per from/to side, when it has no own onChange", () => {
		const { values } = renderWithValues(
			() =>
				(
					<FieldRenderer
						name="timeRange"
						type="timeRange"
						from={{ label: "De" }}
						to={{ label: "À" }}
						value={null}
					/>
				) as unknown as React.ReactElement,
			{ from: null, to: null }
		);
		fireEvent.change(screen.getByLabelText("De — hours"), {
			target: { value: "08" },
		});
		fireEvent.change(screen.getByLabelText("De — minutes"), {
			target: { value: "00" },
		});
		fireEvent.blur(screen.getByLabelText("De — minutes"));
		expect(values.current.from).toBe("08:00");
	});

	it("file falls back to writing through Formik when it has no own onChange", () => {
		const { values } = renderWithValues(
			() => <FieldRenderer name="contract" type="file" value={[]} />,
			{ contract: [] }
		);
		const file = new File(["x"], "a.pdf", { type: "application/pdf" });
		const input = screen.getByTestId("input-file");
		fireEvent.change(input, { target: { files: [file] } });
		expect((values.current.contract as (File | null)[])[0]?.name).toBe(
			"a.pdf"
		);
	});
});
