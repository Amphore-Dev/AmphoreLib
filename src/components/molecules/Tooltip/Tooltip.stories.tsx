import React from "react";

import { Button } from "../../atoms/Button/Button";
import { Picto } from "../../atoms/Picto/Picto";

import { Tooltip } from "./Tooltip";

export default {
	title: "Components/Molecules/Tooltip",
	component: Tooltip,
	argTypes: {
		placement: {
			control: "select",
			options: [
				"top",
				"top-start",
				"top-end",
				"bottom",
				"bottom-start",
				"bottom-end",
				"left",
				"right",
			],
		},
		disabled: { control: "boolean" },
		portal: { control: "boolean" },
	},
};

export const Base = () => (
	<Tooltip content="Save the document">
		<Button>Hover me</Button>
	</Tooltip>
);

export const Placements = () => (
	<div style={{ display: "flex", gap: "2rem", padding: "3rem" }}>
		{(["top", "bottom", "left", "right"] as const).map((placement) => (
			<Tooltip
				key={placement}
				content={`Placement: ${placement}`}
				placement={placement}
			>
				<Button variant="outline">{placement}</Button>
			</Tooltip>
		))}
	</div>
);

export const OnIconButton = () => (
	<Tooltip content="Delete">
		<button
			type="button"
			aria-label="Delete"
			style={{
				display: "inline-flex",
				padding: 8,
				border: "1px solid var(--amp-color-border)",
				borderRadius: "var(--amp-radius-md)",
				background: "transparent",
				cursor: "pointer",
			}}
		>
			<Picto icon="trash" />
		</button>
	</Tooltip>
);

export const Disabled = () => (
	<Tooltip content="Never shows" disabled>
		<Button>Hover me</Button>
	</Tooltip>
);

export const KeyboardFocus = () => (
	<div style={{ display: "flex", gap: "1rem" }}>
		<span>Tab to the button:</span>
		<Tooltip content="Also accessible via keyboard">
			<Button>Focus me</Button>
		</Tooltip>
	</div>
);

/**
 * `portal` renders the tooltip into `document.body` through AmphorePortal,
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
		<Tooltip content="Escapes the dashed box" portal>
			<Button>Hover me (portaled)</Button>
		</Tooltip>
	</div>
);
