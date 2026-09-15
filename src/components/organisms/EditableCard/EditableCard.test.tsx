import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { Formik } from "formik";
import { describe, expect, it } from "vitest";

import { TField } from "@interfaces/index";

import { EditableCard } from "./EditableCard";

const fields: TField[] = [
	{ name: "title", type: "input", label: "Titre" },
	{ name: "note", type: "input", label: "Note" },
];

describe("EditableCard", () => {
	it("doesn't crash on a date/file field's raw value in display mode, and formats it", () => {
		// Regression: display mode used to render a field's raw stored value
		// as-is when no `valueDisplay` was given — a `Date` isn't a valid
		// React child at all (throws), a `(File | null)[]` same problem.
		const file = new File(["x"], "contrat.pdf");
		render(
			<EditableCard
				title="Contrat"
				fields={[
					{ name: "startDate", type: "date", label: "Début" },
					{ name: "remote", type: "toggle", label: "Télétravail" },
					{ name: "contract", type: "file", label: "Contrat" },
				]}
				values={{
					startDate: new Date(2026, 2, 1),
					remote: true,
					contract: [file],
				}}
			/>
		);
		expect(screen.getByText("3/1/2026")).toBeInTheDocument();
		expect(screen.getByText("Yes")).toBeInTheDocument();
		expect(screen.getByText("contrat.pdf")).toBeInTheDocument();
	});

	it("gives each display field its own Grid item instead of collapsing them all into one column", () => {
		// Regression test: DisplayFields used to wrap every field in a group
		// under one <Fragment>/<div>, which Grid's own per-child
		// React.Children.map treats as a single opaque child — collapsing the
		// whole group into one grid cell regardless of `columns`.
		const { container } = render(
			<EditableCard
				title="Carte"
				fields={fields}
				values={{ title: "Hello", note: "World" }}
				columns={2}
			/>
		);
		const grid = container.querySelector(
			'[style*="--_column-count"]'
		) as HTMLElement;
		expect(grid).toBeTruthy();
		expect(grid.children).toHaveLength(fields.length);
	});

	it("shows the display values by default", () => {
		render(
			<EditableCard
				title="Carte"
				fields={fields}
				values={{ title: "Hello", note: "" }}
			/>
		);
		expect(screen.getByText("Titre")).toBeInTheDocument();
		expect(screen.getByText("Hello")).toBeInTheDocument();
	});

	it("shows a dash for an empty value with addOnEmptyValue off", () => {
		render(
			<EditableCard
				title="Carte"
				fields={fields}
				values={{ title: "", note: "" }}
				addOnEmptyValue={false}
			/>
		);
		expect(screen.getAllByText("-").length).toBeGreaterThan(0);
	});

	it("shows an add button for an empty value by default", () => {
		render(
			<EditableCard
				title="Carte"
				fields={fields}
				values={{ title: "", note: "" }}
			/>
		);
		expect(screen.getAllByRole("button", { name: "Add" })).toHaveLength(2);
	});

	it("enters edit mode on the Edit button", () => {
		render(
			<EditableCard
				title="Carte"
				fields={fields}
				values={{ title: "Hello" }}
				editInModal={false}
			/>
		);
		fireEvent.click(screen.getByRole("button", { name: "Edit" }));
		expect(screen.getAllByRole("textbox").length).toBeGreaterThan(0);
	});

	it("enters edit mode via the add button on an empty value", () => {
		render(
			<EditableCard
				title="Carte"
				fields={fields}
				values={{ title: "" }}
				editInModal={false}
			/>
		);
		fireEvent.click(screen.getAllByRole("button", { name: "Add" })[0]);
		expect(screen.getAllByRole("textbox").length).toBeGreaterThan(0);
	});

	it("hides the Edit button and any Add buttons when readOnly", () => {
		render(
			<EditableCard
				title="Carte"
				fields={fields}
				values={{ title: "" }}
				readOnly
			/>
		);
		expect(
			screen.queryByRole("button", { name: "Edit" })
		).not.toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: "Add" })
		).not.toBeInTheDocument();
	});

	it("calls onCancel and exits editing when the edit modal is closed", () => {
		const onCancel = vi.fn();
		render(
			<EditableCard
				title="Carte"
				fields={fields}
				values={{ title: "Hello" }}
				onCancel={onCancel}
			/>
		);
		fireEvent.click(screen.getByRole("button", { name: "Edit" }));
		expect(screen.getAllByRole("textbox").length).toBeGreaterThan(0);
		fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
		expect(onCancel).toHaveBeenCalledTimes(1);
		expect(screen.queryAllByRole("textbox")).toHaveLength(0);
	});

	it("calls onSubmit and exits editing back to display mode on submit", async () => {
		const onSubmit = vi.fn().mockResolvedValue(undefined);
		render(
			<EditableCard
				title="Carte"
				fields={fields}
				values={{ title: "Hello", note: "World" }}
				onSubmit={onSubmit}
			/>
		);
		fireEvent.click(screen.getByRole("button", { name: "Edit" }));
		fireEvent.change(screen.getByLabelText("Titre"), {
			target: { value: "Updated" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Submit" }));
		await vi.waitFor(() =>
			expect(screen.queryAllByRole("textbox")).toHaveLength(0)
		);
		expect(onSubmit).toHaveBeenCalledWith(
			expect.objectContaining({ title: "Updated" })
		);
	});

	it("accepts fields as a function (isEditing-aware descriptor)", () => {
		render(
			<EditableCard
				title="Carte"
				fields={(_formikCtx, isEditing) => [
					{
						name: "title",
						type: "input",
						label: isEditing ? "Titre (édition)" : "Titre",
					},
				]}
				values={{ title: "Hello" }}
			/>
		);
		expect(screen.getByText("Titre")).toBeInTheDocument();
		expect(screen.getByText("Hello")).toBeInTheDocument();
	});

	it("uses a field's own valueRenderer to fully take over its display value", () => {
		render(
			<EditableCard
				title="Carte"
				fields={[
					{
						name: "title",
						type: "input",
						label: "Titre",
						valueRenderer: () => <strong>Custom!</strong>,
					},
				]}
				values={{ title: "Hello" }}
			/>
		);
		expect(screen.getByText("Custom!")).toBeInTheDocument();
		expect(screen.queryByText("Hello")).not.toBeInTheDocument();
	});

	it("evaluates a function-valued hidden/order/label per display field", () => {
		render(
			<EditableCard
				title="Carte"
				fields={[
					{
						name: "title",
						type: "input",
						label: (formikCtx) =>
							`Titre: ${formikCtx.values.title}`,
						order: () => 1,
					},
					{
						name: "note",
						type: "input",
						label: "Note",
						hidden: (values) => !!values.hideNote,
					},
				]}
				values={{ title: "Hello", note: "World", hideNote: true }}
			/>
		);
		expect(screen.getByText("Titre: Hello")).toBeInTheDocument();
		expect(screen.queryByText("Note")).not.toBeInTheDocument();
	});

	it("calls a field's displayProps.info.onClick and displayProps.action.onClick", () => {
		const onInfoClick = vi.fn();
		const onActionClick = vi.fn();
		render(
			<EditableCard
				title="Carte"
				fields={[
					{
						name: "title",
						type: "input",
						label: "Titre",
						displayProps: () => ({
							info: { onClick: onInfoClick },
							action: {
								label: "Voir",
								onClick: onActionClick,
							},
						}),
					},
				]}
				values={{ title: "Hello" }}
			/>
		);
		fireEvent.click(screen.getByRole("button", { name: "Hello" }));
		expect(onInfoClick).toHaveBeenCalledTimes(1);
		fireEvent.click(screen.getByRole("button", { name: "Voir" }));
		expect(onActionClick).toHaveBeenCalledTimes(1);
	});

	it("keeps groups separate in display mode when mergeGroupsForDisplay is false", () => {
		const { container } = render(
			<EditableCard
				title="Carte"
				fields={[
					{ title: "A", fields: [fields[0]] },
					{ title: "B", fields: [fields[1]] },
				]}
				values={{ title: "Hello", note: "World" }}
				mergeGroupsForDisplay={false}
			/>
		);
		// Rendered as two group wrapper divs (one per group, CSS-module class
		// hashed at build time) rather than every field flattened together.
		expect(
			container.querySelectorAll('[class*="fieldsGroup"]')
		).toHaveLength(2);
		expect(screen.getByText("Hello")).toBeInTheDocument();
		expect(screen.getByText("World")).toBeInTheDocument();
	});

	it("supports the plain FormRenderer (formikWrapper=false) given an outer Formik ancestor and formikCtx", () => {
		// Even with formikWrapper off, FormRenderer's own modal wrapper always
		// calls useFormikContext() (see FormRenderer.test.tsx) — so this mode
		// only works when the caller already renders EditableCard inside its
		// own <Formik> *and* forwards that live context via `formikCtx`,
		// exactly as v1 required too (its own fake default formikCtx has no
		// real setFieldValue to write through).
		render(
			<Formik initialValues={{ title: "Hello" }} onSubmit={() => {}}>
				{(formikCtx) => (
					<EditableCard
						title="Carte"
						fields={[fields[0]]}
						values={{ title: "Hello" }}
						editInModal={false}
						formikWrapper={false}
						formikCtx={formikCtx}
					/>
				)}
			</Formik>
		);
		fireEvent.click(screen.getByRole("button", { name: "Edit" }));
		const input = screen.getByLabelText("Titre") as HTMLInputElement;
		fireEvent.change(input, { target: { value: "Updated" } });
		expect(input).toHaveValue("Updated");
	});
});
