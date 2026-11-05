import React from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Formik } from "formik";
import { describe, it, vi } from "vitest";

import {
	ActiveFilters,
	EditableCard,
	FieldRenderer,
	FileViewer,
	FiltersModal,
	FormRenderer,
	FormRendererWithFormik,
	Table,
	TodoList,
	Tour,
} from "@components/organisms";
import { PageHeader } from "@components/templates";

import type {
	IUseFiltersContext,
	TEditFields,
	TFiltersModalGroup,
	TFiltersSlice,
} from "@interfaces/index";

import { expectNoA11yViolations } from "../axe";

const noop = () => {};

const options = [
	{ value: "a", label: "Alpha" },
	{ value: "b", label: "Beta" },
];

/** One field of every type: a form is where the naming of each one shows. */
const everyField: TEditFields = [
	{ name: "text", type: "input", label: "Text" },
	{ name: "note", type: "textarea", label: "Note" },
	{ name: "count", type: "number", label: "Count" },
	{ name: "pick", type: "select", label: "Pick", options },
	{ name: "day", type: "date", label: "Day" },
	{ name: "time", type: "time", label: "Time" },
	{ name: "range", type: "timeRange", label: "Range" },
	{ name: "period", type: "period", label: "Period" },
	{ name: "tags", type: "chips", label: "Tags" },
	{ name: "boxes", type: "checkbox", label: "Boxes", options },
	{ name: "radios", type: "radio", label: "Radios", options },
	{ name: "flag", type: "toggle", label: "Flag" },
	{ name: "files", type: "file", label: "Files", maxFiles: 2 },
	{ name: "tint", type: "color", label: "Tint" },
];

type TSlice = TFiltersSlice<{ status?: string | null }>;
type T = { list: TSlice };

const filtersContext = {
	filters: { status: "open" },
	filtersKey: "list",
	setFilters: vi.fn(),
	setFilter: vi.fn(),
	options: { countCallback: () => 1 },
} as unknown as IUseFiltersContext<T, "list", TSlice>;

const filterGroups: TFiltersModalGroup[] = [
	{
		fields: [
			{ name: "status", type: "select", label: "Status", options: [] },
		],
	},
];

type TRow = { id: number; name: string };
const rows: TRow[] = [
	{ id: 1, name: "Ada" },
	{ id: 2, name: "Grace" },
];
const columns = [{ key: "name" as const, label: "Name", sortable: true }];
const getItemKey = (row: TRow) => row.id;

describe("axe: organisms", () => {
	const cases: [string, React.ReactElement][] = [
		[
			"ActiveFilters",
			<ActiveFilters
				key="0"
				filters={filterGroups}
				filtersContext={filtersContext}
			/>,
		],
		[
			"EditableCard",
			<EditableCard
				key="0"
				title="Profile"
				fields={[
					{ name: "text", type: "input", label: "Text" },
					{ name: "empty", type: "input", label: "Empty" },
				]}
				values={{ text: "Ada" }}
			/>,
		],
		[
			"EditableCard editing inline",
			<EditableCard
				key="0"
				title="Profile"
				fields={everyField}
				editInModal={false}
				defaultIsEditing
			/>,
		],
		[
			"EditableCard editing in a modal",
			<EditableCard
				key="0"
				title="Profile"
				fields={[{ name: "text", type: "input", label: "Text" }]}
				defaultIsEditing
			/>,
		],
		[
			"FieldRenderer",
			<Formik key="0" initialValues={{}} onSubmit={noop}>
				<FieldRenderer name="text" type="input" aria-label="Text" />
			</Formik>,
		],
		["FileViewer image", <FileViewer key="0" src="/photo.png" />],
		["FileViewer unsupported", <FileViewer key="0" src="/notes.txt" />],
		[
			"FiltersModal",
			<FiltersModal
				key="0"
				filters={[
					{
						name: "status",
						type: "select",
						label: "Status",
						options,
					},
				]}
				filtersContext={filtersContext}
			/>,
		],
		[
			"FormRenderer, labels shown",
			<Formik key="0" initialValues={{}} onSubmit={noop}>
				{(formikCtx) => (
					<FormRenderer fields={everyField} formikCtx={formikCtx} />
				)}
			</Formik>,
		],
		[
			"FormRenderer, labels hidden",
			<Formik key="0" initialValues={{}} onSubmit={noop}>
				{(formikCtx) => (
					<FormRenderer
						fields={everyField}
						formikCtx={formikCtx}
						showFieldLabels={false}
					/>
				)}
			</Formik>,
		],
		[
			"FormRendererWithFormik in a modal",
			<FormRendererWithFormik
				key="0"
				title="Edit"
				inModal
				open
				initialValues={{}}
				fields={everyField}
				showResetFieldButton
			/>,
		],
		[
			"Table",
			<Table
				key="0"
				aria-label="People"
				columns={columns}
				items={rows}
				getItemKey={getItemKey}
			/>,
		],
		[
			"Table empty",
			<Table
				key="0"
				aria-label="People"
				columns={columns}
				items={[]}
				getItemKey={getItemKey}
			/>,
		],
		[
			"Table loading",
			<Table
				key="0"
				aria-label="People"
				columns={columns}
				items={[]}
				getItemKey={getItemKey}
				isLoading
			/>,
		],
		[
			"Table selectable, row actions, clickable rows",
			<Table
				key="0"
				aria-label="People"
				columns={columns}
				items={rows}
				getItemKey={getItemKey}
				selectable
				onRowClick={noop}
				rowActions={[{ label: "Edit", onClick: noop }]}
				onGlobalContextMenu={noop}
				columnVisibilityMenu
			/>,
		],
		[
			"TodoList",
			<TodoList
				key="0"
				items={[{ id: "1", text: "Buy milk" }]}
				onChange={noop}
			/>,
		],
		[
			"Tour",
			<Tour
				key="0"
				open
				onClose={noop}
				steps={[{ title: "Welcome", content: "Hello" }]}
			/>,
		],
		["PageHeader", <PageHeader key="0" title="Orders" totalCount={3} />],
		[
			"PageHeader with everything",
			<PageHeader
				key="0"
				title="Orders"
				isLoading
				onBack={noop}
				onSearchChange={noop}
				buttons={[{ children: "New" }]}
				tabs={[
					{ value: "a", label: "One" },
					{ value: "b", label: "Two" },
				]}
			/>,
		],
	];

	it.each(cases)("%s", async (_name, element) => {
		render(element);
		await expectNoA11yViolations();
	});

	it("FormRenderer showing an error", async () => {
		render(
			<Formik
				initialValues={{ text: "" }}
				initialTouched={{ text: true }}
				initialErrors={{ text: "Required" }}
				onSubmit={noop}
			>
				{(formikCtx) => (
					<FormRenderer
						fields={[
							{ name: "text", type: "input", label: "Text" },
						]}
						formikCtx={formikCtx}
					/>
				)}
			</Formik>
		);
		await screen.findByRole("alert");
		await expectNoA11yViolations();
	});

	it("FiltersModal open", async () => {
		const user = userEvent.setup();
		render(
			<FiltersModal
				filters={[
					{
						name: "status",
						type: "select",
						label: "Status",
						options,
					},
				]}
				filtersContext={filtersContext}
			/>
		);
		await user.click(screen.getByRole("button", { name: /Filter/ }));
		await screen.findByRole("dialog");
		await expectNoA11yViolations();
	});

	it("Table with an open row menu", async () => {
		const user = userEvent.setup();
		render(
			<Table
				aria-label="People"
				columns={columns}
				items={rows}
				getItemKey={getItemKey}
				rowActions={[{ label: "Edit", onClick: noop }]}
			/>
		);
		await user.pointer({
			keys: "[MouseRight]",
			target: screen.getByText("Ada"),
		});
		await screen.findByRole("menu");
		await expectNoA11yViolations();
	});
});
