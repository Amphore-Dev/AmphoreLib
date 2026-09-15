import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TTableColumn } from "@interfaces/index";

import { TableHead } from "./TableHead";

type TUser = { id: number; name: string; email: string };

const columns: TTableColumn<TUser>[] = [
	{ key: "name", label: "Nom", sortable: true },
	{ key: "email", label: "Email" },
];

describe("TableHead", () => {
	it("renders one Th per column plus a trailing filler cell", () => {
		render(<TableHead columns={columns} />);
		expect(screen.getAllByRole("columnheader")).toHaveLength(3);
		expect(screen.getByText("Nom")).toBeInTheDocument();
		expect(screen.getByText("Email")).toBeInTheDocument();
	});

	it("calls onSort with the column's key when a sortable header is clicked", () => {
		const onSort = vi.fn();
		render(<TableHead columns={columns} onSort={onSort} />);
		fireEvent.click(screen.getByText("Nom"));
		expect(onSort).toHaveBeenCalledWith("name");
	});

	it("uses sortKey over key when given", () => {
		const withSortKey: TTableColumn<TUser>[] = [
			{ key: "name", label: "Nom", sortable: true, sortKey: "email" },
		];
		const onSort = vi.fn();
		render(<TableHead columns={withSortKey} onSort={onSort} />);
		fireEvent.click(screen.getByText("Nom"));
		expect(onSort).toHaveBeenCalledWith("email");
	});

	it("shows a select-all checkbox when selectable", () => {
		const onSelectAll = vi.fn();
		render(
			<TableHead columns={columns} selectable onSelectAll={onSelectAll} />
		);
		fireEvent.click(screen.getByRole("checkbox"));
		expect(onSelectAll).toHaveBeenCalledTimes(1);
	});

	it("calls onColumnsContextMenu on right-click, preventing the default menu", () => {
		const onColumnsContextMenu = vi.fn();
		render(
			<TableHead
				columns={columns}
				onColumnsContextMenu={onColumnsContextMenu}
			/>
		);
		fireEvent.contextMenu(screen.getByText("Nom"));
		expect(onColumnsContextMenu).toHaveBeenCalledTimes(1);
	});

	const columnsWithContextMenu: TTableColumn<TUser>[] = [
		...columns,
		{ key: "contextMenu" },
	];

	it("renders no visible content for the contextMenu column when nothing is selected", () => {
		render(
			<TableHead
				columns={columnsWithContextMenu}
				hasContextMenuColumn
				onGlobalContextMenu={vi.fn()}
			/>
		);
		expect(
			screen.queryByRole("button", { hidden: true })
		).not.toBeInTheDocument();
	});

	it("shows a global-context-menu button in the contextMenu column once something is selected", () => {
		const onGlobalContextMenu = vi.fn();
		render(
			<TableHead
				columns={columnsWithContextMenu}
				hasContextMenuColumn
				onGlobalContextMenu={onGlobalContextMenu}
				someSelected
			/>
		);
		const button = screen.getByRole("button");
		fireEvent.click(button);
		expect(onGlobalContextMenu).toHaveBeenCalledTimes(1);
	});

	it("omits the contextMenu column entirely when neither hasContextMenuColumn nor onGlobalContextMenu is set", () => {
		render(<TableHead columns={columnsWithContextMenu} />);
		// Just the 2 real columns + the trailing filler Th — no cell at all
		// for "contextMenu".
		expect(screen.getAllByRole("columnheader")).toHaveLength(3);
	});
});
