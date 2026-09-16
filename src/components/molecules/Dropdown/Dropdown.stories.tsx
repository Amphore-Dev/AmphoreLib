import React from "react";

import type { TMenuItem } from "@interfaces/index";

import { Button } from "../../atoms/Button/Button";
import { Picto } from "../../atoms/Picto/Picto";

import { Dropdown } from "./Dropdown";

export default {
	title: "Components/Molecules/Dropdown",
	component: Dropdown,
	argTypes: {
		placement: {
			control: "select",
			options: ["bottom-start", "bottom-end", "top-start", "top-end"],
		},
		disabled: { control: "boolean" },
		portal: { control: "boolean" },
	},
};

const ITEMS: TMenuItem[] = [
	{ label: "Edit", onClick: () => alert("Edit"), picto: "search" },
	{ label: "Duplicate", onClick: () => alert("Duplicate") },
	{ label: "Archive", onClick: () => alert("Archive"), disabled: true },
	{
		label: "Delete",
		onClick: () => alert("Delete"),
		color: "danger",
	},
];

export const Base = () => (
	<Dropdown items={ITEMS}>
		<Button variant="outline">Actions</Button>
	</Dropdown>
);

export const OnIconButton = () => (
	<Dropdown items={ITEMS} placement="bottom-end">
		<button
			type="button"
			aria-label="More actions"
			style={{
				display: "inline-flex",
				padding: 8,
				border: "1px solid var(--amp-color-border)",
				borderRadius: "var(--amp-radius-md)",
				background: "transparent",
				cursor: "pointer",
			}}
		>
			<Picto icon="more" />
		</button>
	</Dropdown>
);

export const Disabled = () => (
	<Dropdown items={ITEMS} disabled>
		<Button variant="outline">Actions</Button>
	</Dropdown>
);

/**
 * `portal` renders the menu into `document.body` through AmphorePortal,
 * which re-applies the nearest AmphoreProvider's theme scope inside the
 * portal — styled exactly like the inline version. The trigger here sits in
 * a `transform`ed, `overflow: hidden` box: inline, `position: fixed` gets
 * trapped by that ancestor and clipped; portaled, it escapes.
 */
export const Portaled = () => (
	<div
		style={{
			transform: "translateZ(0)",
			overflow: "hidden",
			width: 320,
			height: 120,
			padding: "1rem",
			border: "1px dashed var(--amp-color-border)",
			borderRadius: "var(--amp-radius-md)",
		}}
	>
		<Dropdown items={ITEMS} portal>
			<Button>Actions (portaled)</Button>
		</Dropdown>
	</div>
);
