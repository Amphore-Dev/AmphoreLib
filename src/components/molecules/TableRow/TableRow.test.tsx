import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TTableColumn } from "@interfaces/index";

import { TableRow } from "./TableRow";

type TUser = { id: number; name: string; email: string };

const columns: TTableColumn<TUser>[] = [
	{ key: "name", label: "Nom" },
	{ key: "email", label: "Email" },
];

const item: TUser = { id: 1, name: "Alice", email: "alice@example.com" };

describe("TableRow", () => {
	it("renders one Td per column plus a trailing filler cell", () => {
		render(<TableRow item={item} columns={columns} />);
		expect(screen.getAllByRole("gridcell")).toHaveLength(3);
		expect(screen.getByText("Alice")).toBeInTheDocument();
		expect(screen.getByText("alice@example.com")).toBeInTheDocument();
	});

	it("renders a value via col.render when given", () => {
		const withRender: TTableColumn<TUser>[] = [
			{ key: "name", render: (u) => `#${u.id} ${u.name}` },
		];
		render(<TableRow item={item} columns={withRender} />);
		expect(screen.getByText("#1 Alice")).toBeInTheDocument();
	});

	it("calls onClick with the item on row click", () => {
		const onClick = vi.fn();
		render(<TableRow item={item} columns={columns} onClick={onClick} />);
		fireEvent.click(screen.getByText("Alice"));
		expect(onClick).toHaveBeenCalledWith(item, expect.anything());
	});

	it("shows a selection checkbox when selectable", () => {
		render(<TableRow item={item} columns={columns} selectable />);
		expect(screen.getByRole("checkbox")).toBeInTheDocument();
	});

	it("calls onToggleSelect (not onClick) when the checkbox is clicked", () => {
		const onClick = vi.fn();
		const onToggleSelect = vi.fn();
		render(
			<TableRow
				item={item}
				columns={columns}
				selectable
				onClick={onClick}
				onToggleSelect={onToggleSelect}
			/>
		);
		fireEvent.click(screen.getByRole("checkbox"));
		expect(onToggleSelect).toHaveBeenCalledTimes(1);
		expect(onClick).not.toHaveBeenCalled();
	});

	it("reflects isSelected on the checkbox and via data-selected", () => {
		const { container } = render(
			<TableRow item={item} columns={columns} selectable isSelected />
		);
		expect(screen.getByRole("checkbox")).toBeChecked();
		expect(
			container.querySelector("[data-selected='true']")
		).toBeInTheDocument();
	});

	it("calls onContextMenu on right-click, preventing the default menu", () => {
		const onContextMenu = vi.fn();
		render(
			<TableRow
				item={item}
				columns={columns}
				onContextMenu={onContextMenu}
			/>
		);
		fireEvent.contextMenu(screen.getByText("Alice"));
		expect(onContextMenu).toHaveBeenCalledWith(item, expect.anything());
	});

	it("renders a hover 'more' button for the contextMenu column, calling onContextMenu with fromButton=true", () => {
		const onContextMenu = vi.fn();
		const withMenu: TTableColumn<TUser>[] = [
			...columns,
			{ key: "contextMenu" },
		];
		render(
			<TableRow
				item={item}
				columns={withMenu}
				onContextMenu={onContextMenu}
			/>
		);
		fireEvent.click(screen.getByRole("button"));
		expect(onContextMenu).toHaveBeenCalledWith(
			item,
			expect.anything(),
			true
		);
	});
});
