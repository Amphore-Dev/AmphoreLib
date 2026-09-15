import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TTableColumn } from "@interfaces/index";

import { Table } from "./Table";

type TUser = { id: number; name: string; email: string };

const columns: TTableColumn<TUser>[] = [
	{ key: "name", label: "Nom", sortable: true },
	{ key: "email", label: "Email" },
];

const items: TUser[] = [
	{ id: 1, name: "Alice", email: "alice@example.com" },
	{ id: 2, name: "Bob", email: "bob@example.com" },
	{ id: 3, name: "Charlie", email: "charlie@example.com" },
];

const getRow = (name: string) =>
	screen.getByText(name).closest('[role="row"]') as HTMLElement;

describe("Table", () => {
	it("renders the header row", () => {
		render(
			<Table columns={columns} items={items} getItemKey={(i) => i.id} />
		);
		expect(screen.getByText("Nom")).toBeInTheDocument();
		expect(screen.getByText("Email")).toBeInTheDocument();
	});

	it("shows the empty-state message when there are no items", () => {
		render(<Table columns={columns} items={[]} getItemKey={(i) => i.id} />);
		expect(screen.getByText("No data")).toBeInTheDocument();
	});

	it("accepts a custom empty-state message", () => {
		render(
			<Table
				columns={columns}
				items={[]}
				getItemKey={(i) => i.id}
				noDataMessage="Rien à afficher"
			/>
		);
		expect(screen.getByText("Rien à afficher")).toBeInTheDocument();
	});

	it("shows a spinner instead of rows/empty-state while loading", () => {
		render(
			<Table
				columns={columns}
				items={[]}
				getItemKey={(i) => i.id}
				isLoading
			/>
		);
		expect(screen.queryByText("No data")).not.toBeInTheDocument();
	});

	it("renders a select-all header checkbox when selectable", () => {
		render(
			<Table
				columns={columns}
				items={items}
				getItemKey={(i) => i.id}
				selectable
			/>
		);
		expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);
	});

	it("hides the checkbox column when showCheckbox=false, but keeps selection active", () => {
		const { container } = render(
			<Table
				columns={columns}
				items={items}
				getItemKey={(i) => i.id}
				selectable
				showCheckbox={false}
			/>
		);
		expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
		// No reserved checkbox grid column either.
		const grid = container.querySelector('[role="grid"]') as HTMLElement;
		expect(grid.style.gridTemplateColumns.startsWith("2.5rem")).toBe(false);
	});

	it("is a controlled component for selection when selectedKeys/setSelectedKeys are given", () => {
		const onSelectionChange = vi.fn();
		let currentKeys = new Set<string | number>([1]);
		const setSelectedKeys = (
			updater:
				| Set<string | number>
				| ((prev: Set<string | number>) => Set<string | number>)
		) => {
			currentKeys =
				typeof updater === "function" ? updater(currentKeys) : updater;
		};
		const { rerender } = render(
			<Table
				columns={columns}
				items={items}
				getItemKey={(i) => i.id}
				selectedKeys={currentKeys}
				setSelectedKeys={setSelectedKeys}
				onSelectionChange={onSelectionChange}
			/>
		);
		expect(within(getRow("Alice")).getByRole("checkbox")).toBeChecked();

		fireEvent.click(within(getRow("Bob")).getByRole("checkbox"));
		expect(onSelectionChange).toHaveBeenCalledWith(
			new Set<string | number>([1, 2])
		);

		rerender(
			<Table
				columns={columns}
				items={items}
				getItemKey={(i) => i.id}
				selectedKeys={currentKeys}
				setSelectedKeys={setSelectedKeys}
				onSelectionChange={onSelectionChange}
			/>
		);
		expect(within(getRow("Bob")).getByRole("checkbox")).toBeChecked();
	});

	it("sorts items by the clicked column when onSort isn't given (default compare)", () => {
		render(
			<Table columns={columns} items={items} getItemKey={(i) => i.id} />
		);
		fireEvent.click(screen.getByText("Nom"));
		const rows = screen.getAllByRole("row").slice(1); // drop the header row
		expect(within(rows[0]).getByText("Alice")).toBeInTheDocument();
		fireEvent.click(screen.getByText("Nom")); // second click reverses to desc
		const rowsDesc = screen.getAllByRole("row").slice(1);
		expect(within(rowsDesc[0]).getByText("Charlie")).toBeInTheDocument();
	});

	it("delegates sorting to onSort when given, instead of sorting locally", () => {
		const onSort = vi.fn();
		render(
			<Table
				columns={columns}
				items={items}
				getItemKey={(i) => i.id}
				onSort={onSort}
			/>
		);
		fireEvent.click(screen.getByText("Nom"));
		expect(onSort).toHaveBeenCalledWith("name", "asc");
		// Order unchanged — Table doesn't sort itself when the caller owns it.
		const rows = screen.getAllByRole("row").slice(1);
		expect(within(rows[0]).getByText("Alice")).toBeInTheDocument();
	});

	it("calls onRowClick when a row is clicked", () => {
		const onRowClick = vi.fn();
		render(
			<Table
				columns={columns}
				items={items}
				getItemKey={(i) => i.id}
				onRowClick={onRowClick}
			/>
		);
		fireEvent.click(getRow("Bob"));
		expect(onRowClick).toHaveBeenCalledWith(items[1]);
	});

	it("selects a row on click when selectOnClick is set and there's no onRowClick", () => {
		const onSelectionChange = vi.fn();
		render(
			<Table
				columns={columns}
				items={items}
				getItemKey={(i) => i.id}
				selectable
				selectOnClick
				onSelectionChange={onSelectionChange}
			/>
		);
		fireEvent.click(getRow("Bob"));
		expect(onSelectionChange).toHaveBeenCalledWith(new Set([2]));
	});

	it("shift-click range-selects from the last anchor", () => {
		const onSelectionChange = vi.fn();
		render(
			<Table
				columns={columns}
				items={items}
				getItemKey={(i) => i.id}
				selectable
				selectOnClick
				onSelectionChange={onSelectionChange}
			/>
		);
		fireEvent.click(getRow("Alice"));
		fireEvent.click(getRow("Charlie"), { shiftKey: true });
		expect(onSelectionChange).toHaveBeenLastCalledWith(
			new Set<string | number>([1, 2, 3])
		);
	});

	it("selectionMode exclusive replaces the selection with just the clicked row", () => {
		const onSelectionChange = vi.fn();
		render(
			<Table
				columns={columns}
				items={items}
				getItemKey={(i) => i.id}
				selectable
				selectOnClick
				selectionMode="exclusive"
				selectedKeys={new Set([1, 2])}
				// Table calls the updater itself (like a real useState setter
				// would) to run its embedded onSelectionChange side effect —
				// a bare no-op here would silently swallow that call.
				setSelectedKeys={(updater) =>
					typeof updater === "function"
						? updater(new Set([1, 2]))
						: updater
				}
				onSelectionChange={onSelectionChange}
			/>
		);
		fireEvent.click(getRow("Charlie"));
		expect(onSelectionChange).toHaveBeenCalledWith(new Set([3]));
	});

	it("toggles select-all via the header checkbox", () => {
		const onSelectionChange = vi.fn();
		render(
			<Table
				columns={columns}
				items={items}
				getItemKey={(i) => i.id}
				selectable
				onSelectionChange={onSelectionChange}
			/>
		);
		const headerRow = screen.getAllByRole("row")[0];
		fireEvent.click(within(headerRow).getByRole("checkbox"));
		expect(onSelectionChange).toHaveBeenCalledWith(new Set([1, 2, 3]));
	});

	it("adds a trailing contextMenu column when rowActions are given, and opens it per-row", () => {
		const onClick = vi.fn();
		render(
			<Table
				columns={columns}
				items={items}
				getItemKey={(i) => i.id}
				rowActions={[{ label: "Supprimer", onClick }]}
			/>
		);
		const bobRow = getRow("Bob");
		const menuButton = within(bobRow).getByRole("button");
		fireEvent.click(menuButton);
		fireEvent.click(screen.getByText("Supprimer"));
		expect(onClick).toHaveBeenCalledWith(items[1]);
	});

	it("calls onLoadMore once the last visible row nears the end", () => {
		const onLoadMore = vi.fn();
		render(
			<Table
				columns={columns}
				items={items}
				getItemKey={(i) => i.id}
				onLoadMore={onLoadMore}
				hasMore
				loadMoreThreshold={4}
			/>
		);
		expect(onLoadMore).toHaveBeenCalled();
	});

	it("doesn't call onLoadMore while isLoading", () => {
		const onLoadMore = vi.fn();
		render(
			<Table
				columns={columns}
				items={items}
				getItemKey={(i) => i.id}
				onLoadMore={onLoadMore}
				hasMore
				isLoading
			/>
		);
		expect(onLoadMore).not.toHaveBeenCalled();
	});

	it("hides a column via initialVisibleColumns", () => {
		render(
			<Table
				columns={columns}
				items={items}
				getItemKey={(i) => i.id}
				initialVisibleColumns={["name"]}
			/>
		);
		expect(screen.queryByText("Email")).not.toBeInTheDocument();
		expect(screen.getByText("Nom")).toBeInTheDocument();
	});

	it("sets grid-template-columns reflecting the given columns", () => {
		const { container } = render(
			<Table columns={columns} items={items} getItemKey={(i) => i.id} />
		);
		const grid = container.querySelector('[role="grid"]') as HTMLElement;
		expect(grid.style.gridTemplateColumns).toContain(
			"minmax(150px, max-content)"
		);
	});

	it("adds a 2.5rem selection column to grid-template-columns when selectable", () => {
		const { container } = render(
			<Table
				columns={columns}
				items={items}
				getItemKey={(i) => i.id}
				selectable
			/>
		);
		const grid = container.querySelector('[role="grid"]') as HTMLElement;
		expect(grid.style.gridTemplateColumns.startsWith("2.5rem")).toBe(true);
	});
});
