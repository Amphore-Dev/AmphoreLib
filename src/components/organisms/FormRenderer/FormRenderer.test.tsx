import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { Formik, FormikProps } from "formik";
import { describe, expect, it, vi } from "vitest";

import { TField } from "@interfaces/index";

import {
	FormRenderer,
	FormRendererWithFormik,
	IFormRendererProps,
} from "./FormRenderer";

/**
 * `FormRenderer`'s modal wrapper always calls `useFormikContext()` (even
 * with `inModal` off) — same as v1's own `FormWrapper` — so any standalone
 * usage still needs a real `<Formik>` ancestor; only `FormRendererWithFormik`
 * provides one on its own. `formikCtxOverride` lets a test substitute its
 * own fake context (e.g. a spy `setFieldValue`) while still satisfying that
 * hook call.
 */
const renderForm = (
	props: Omit<IFormRendererProps<Record<string, unknown>>, "formikCtx"> & {
		formikCtxOverride?: Partial<FormikProps<Record<string, unknown>>>;
	}
) => {
	const { formikCtxOverride, ...rest } = props;
	return render(
		<Formik initialValues={{}} onSubmit={() => {}}>
			{(realCtx) => (
				<FormRenderer
					{...rest}
					formikCtx={
						{
							...realCtx,
							...formikCtxOverride,
						} as FormikProps<Record<string, unknown>>
					}
				/>
			)}
		</Formik>
	);
};

describe("FormRenderer", () => {
	it("renders every visible field with its label", () => {
		const fields: TField[] = [
			{ name: "title", type: "input", label: "Titre" },
			{ name: "note", type: "textarea", label: "Note" },
		];
		renderForm({ fields });
		expect(screen.getByLabelText("Titre")).toBeInTheDocument();
		expect(screen.getByLabelText("Note")).toBeInTheDocument();
	});

	it("skips a hidden field", () => {
		const fields: TField[] = [
			{ name: "title", type: "input", label: "Titre", hidden: true },
		];
		renderForm({ fields });
		expect(screen.queryByLabelText("Titre")).not.toBeInTheDocument();
	});

	it("resolves a functional hidden against formik values", () => {
		const fields: TField[] = [
			{
				name: "title",
				type: "input",
				label: "Titre",
				hidden: (values) => !!values.lock,
			},
		];
		renderForm({
			fields,
			formikCtxOverride: { values: { lock: false } },
		});
		expect(screen.getByLabelText("Titre")).toBeInTheDocument();
	});

	it("hides the field when the functional hidden resolves to true", () => {
		const fields: TField[] = [
			{
				name: "title",
				type: "input",
				label: "Titre",
				hidden: (values) => !!values.lock,
			},
		];
		renderForm({
			fields,
			formikCtxOverride: { values: { lock: true } },
		});
		expect(screen.queryByLabelText("Titre")).not.toBeInTheDocument();
	});

	it("shows a group title when displayGroupTitles is true", () => {
		renderForm({
			fields: [
				{
					title: "Infos",
					fields: [{ name: "title", type: "input", label: "Titre" }],
				},
			],
		});
		expect(screen.getByText("Infos")).toBeInTheDocument();
	});

	it("disables the reset button when the value isn't dirty", () => {
		const fields: TField[] = [
			{ name: "title", type: "input", label: "Titre", defaultValue: "" },
		];
		renderForm({
			fields,
			showResetFieldButton: true,
			formikCtxOverride: { values: { title: "" } },
		});
		expect(
			screen.getByRole("button", { name: "Reset" })
		).toBeDisabled();
	});

	it("uses a deep-equal dirty-check, not JSON.stringify's key-order sensitivity", () => {
		const fields: TField[] = [
			{
				name: "range",
				type: "input",
				label: "Plage",
				defaultValue: { a: 1, b: 2 },
			},
		];
		renderForm({
			fields,
			showResetFieldButton: true,
			// same keys, different order — a JSON.stringify-based dirty-check
			// would (wrongly) call this dirty; isEqual correctly does not.
			formikCtxOverride: { values: { range: { b: 2, a: 1 } } },
		});
		expect(
			screen.getByRole("button", { name: "Reset" })
		).toBeDisabled();
	});

	it("calls the field's onReset, or falls back to setFieldValue with the default", () => {
		const setFieldValue = vi.fn();
		const fields: TField[] = [
			{
				name: "title",
				type: "input",
				label: "Titre",
				defaultValue: "default",
			},
		];
		renderForm({
			fields,
			showResetFieldButton: true,
			formikCtxOverride: {
				values: { title: "changed" },
				setFieldValue,
			},
		});
		fireEvent.click(screen.getByRole("button", { name: "Reset" }));
		expect(setFieldValue).toHaveBeenCalledWith("title", "default");
	});

	it("disables every field when disableFields is set", () => {
		const fields: TField[] = [
			{ name: "title", type: "input", label: "Titre" },
		];
		renderForm({ fields, disableFields: true });
		expect(screen.getByLabelText("Titre")).toBeDisabled();
	});

	it("renders the label exactly once (its own header <label>, not the field's own)", () => {
		// Regression: the underlying atom (Input) also renders its own
		// <label> when given a `label` prop — FormRenderer used to pass one
		// down *in addition to* its own header text, showing "Titre" twice.
		const fields: TField[] = [
			{ name: "title", type: "input", label: "Titre" },
		];
		renderForm({ fields, showFieldLabels: true });
		expect(screen.getAllByText("Titre")).toHaveLength(1);
		// Real accessible association, not just visible text — a <label
		// htmlFor> pointing at the field's id, not a plain <p>.
		const label = screen.getByText("Titre");
		expect(label.tagName).toBe("LABEL");
		expect(screen.getByLabelText("Titre")).toBeInTheDocument();
	});

	it("shows no label at all (either side) when showFieldLabels is false", () => {
		const fields: TField[] = [
			{ name: "title", type: "input", label: "Titre" },
		];
		renderForm({ fields, showFieldLabels: false });
		expect(screen.queryByText("Titre")).not.toBeInTheDocument();
		expect(screen.queryByLabelText("Titre")).not.toBeInTheDocument();
		// The field itself is still there, just unlabeled.
		expect(screen.getByRole("textbox")).toBeInTheDocument();
	});
});

describe("FormRendererWithFormik", () => {
	it("disables submit while the form isn't dirty", () => {
		render(
			<FormRendererWithFormik
				initialValues={{ title: "" }}
				fields={[{ name: "title", type: "input", label: "Titre" }]}
				inModal
				open
			/>
		);
		expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
	});

	it("enables submit once a field is edited", () => {
		render(
			<FormRendererWithFormik
				initialValues={{ title: "" }}
				fields={[{ name: "title", type: "input", label: "Titre" }]}
				inModal
				open
			/>
		);
		fireEvent.change(screen.getByLabelText("Titre"), {
			target: { value: "x" },
		});
		expect(
			screen.getByRole("button", { name: "Submit" })
		).not.toBeDisabled();
	});

	it("shows a reset-form button when resetFormButton is set", () => {
		render(
			<FormRendererWithFormik
				initialValues={{ title: "x" }}
				defaultValues={{ title: "default" }}
				fields={[{ name: "title", type: "input", label: "Titre" }]}
				inModal
				open
				resetFormButton
			/>
		);
		expect(
			screen.getByRole("button", { name: "Reset fields" })
		).toBeInTheDocument();
	});
});
