import React from "react";

import type { TMenuItem } from "@interfaces/index";

import { ContextMenu } from "./ContextMenu";
import { useContextMenu } from "./useContextMenu";

export default {
	title: "Components/Molecules/ContextMenu",
	component: ContextMenu,
	argTypes: {
		portal: { control: "boolean" },
	},
};

/**
 * One `useContextMenu()` controller, one rendered `<ContextMenu>` — any
 * number of elements can call `menu.show(event, data)` from their own
 * onContextMenu, all sharing this single menu instance. This is the
 * react-contexify model (useContextMenu + show(event, props) + one <Menu>),
 * not a <ContextMenu> per trigger.
 */
interface IStoryProps {
	additionalItems?: TMenuItem[];
}

export const Base: React.FC<IStoryProps> = ({ additionalItems }) => {
	const menu = useContextMenu();

	return (
		<div>
			<div
				onContextMenu={(e) => menu.show(e, undefined)}
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					width: 280,
					height: 160,
					border: "1px dashed var(--amp-color-border)",
					borderRadius: "var(--amp-radius-md)",
					color: "var(--amp-color-sub)",
					fontSize: 13,
				}}
			>
				Right-click here
			</div>

			<ContextMenu
				menu={menu}
				items={[
					{
						label: "Edit",
						onClick: () => alert("Edit"),
						picto: "search",
					},
					{ label: "Duplicate", onClick: () => alert("Duplicate") },
					{
						label: "Archive",
						onClick: () => alert("Archive"),
						disabled: true,
					},
					{
						label: "Delete",
						onClick: () => alert("Delete"),
						color: "danger",
					},
					...(additionalItems ?? []),
				]}
			/>
		</div>
	);
};

/**
 * The actual point of the shared-menu model: many rows, ONE floating menu.
 * `items` is resolved lazily from whatever `data` the triggering row's
 * `onContextMenu` passed to `menu.show` — no per-row ContextMenu instance,
 * no per-row item-array closures.
 */
export const OnListRow = () => {
	const invoices = [
		{ id: "4127", label: "Invoice #4127" },
		{ id: "4128", label: "Invoice #4128" },
		{ id: "4129", label: "Invoice #4129" },
		{ id: "4130", label: "Invoice #4130 (disabled delete)" },
		{ id: "4131", label: "Invoice #4131 (no duplicate)" },
	];

	const menu = useContextMenu<(typeof invoices)[number]>();

	return (
		<div style={{ maxWidth: 320 }}>
			{invoices.map((invoice) => (
				<div
					key={invoice.id}
					onContextMenu={(e) => menu.show(e, invoice)}
					style={{
						padding: "0.75rem 1rem",
						borderBottom: "1px solid var(--amp-color-border)",
						cursor: "default",
					}}
				>
					{invoice.label}
				</div>
			))}

			<ContextMenu
				menu={menu}
				items={(invoice) => [
					{
						label: "Edit",
						onClick: () => alert(`Edit ${invoice.id}`),
						picto: "search",
					},
					{
						label: "Duplicate",
						onClick: () => alert(`Duplicate ${invoice.id}`),
						hidden: invoice.id === "4131",
					},
					{
						label: "Delete",
						onClick: () => alert(`Delete ${invoice.id}`),
						color: "danger",
						disabled: invoice.id === "4130",
					},
				]}
			/>
		</div>
	);
};

export const Disabled = () => {
	const menu = useContextMenu();

	return (
		<div>
			<div
				onContextMenu={(e) => menu.show(e, undefined)}
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					width: 280,
					height: 120,
					border: "1px dashed var(--amp-color-border)",
					borderRadius: "var(--amp-radius-md)",
					color: "var(--amp-color-sub)",
					fontSize: 13,
				}}
			>
				Right-click disabled here
			</div>
			<ContextMenu
				menu={menu}
				disabled
				items={[{ label: "Never visible", onClick: () => {} }]}
			/>
		</div>
	);
};

export const WithScroll = () => {
	return (
		<Base
			additionalItems={[
				{ label: "Item 1", onClick: () => alert("Item 1") },
				{ label: "Item 2", onClick: () => alert("Item 2") },
				{ label: "Item 3", onClick: () => alert("Item 3") },
				{ label: "Item 4", onClick: () => alert("Item 4") },
				{ label: "Item 5", onClick: () => alert("Item 5") },
			]}
		/>
	);
};

export const Portal = () => {
	const menu = useContextMenu();

	return (
		<div>
			<div
				onContextMenu={(e) => menu.show(e, undefined)}
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					width: 280,
					height: 120,
					border: "1px dashed var(--amp-color-border)",
					borderRadius: "var(--amp-radius-md)",
					color: "var(--amp-color-sub)",
					fontSize: 13,
				}}
			>
				Right-click to see the portal menu
			</div>
			<ContextMenu
				menu={menu}
				portal
				items={[
					{ label: "Item 1", onClick: () => alert("Item 1") },
					{ label: "Item 2", onClick: () => alert("Item 2") },
				]}
			/>
		</div>
	);
};
