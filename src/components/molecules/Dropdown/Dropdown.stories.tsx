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
