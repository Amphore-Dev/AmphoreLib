import React, { useState } from "react";

import { Badge } from "../components/atoms/Badge/Badge";
import { Button } from "../components/atoms/Button/Button";
import { Card } from "../components/atoms/Card/Card";
import { Checkbox } from "../components/atoms/Checkbox/Checkbox";
import { Input } from "../components/atoms/Input/Input";
import { Toggle } from "../components/atoms/Toggle/Toggle";
import { Select } from "../components/molecules/Select/Select";
import { Tooltip } from "../components/molecules/Tooltip/Tooltip";

/**
 * Everything here renders with no AmphoreProvider above it: the preview
 * decorator is turned off below, so the "Amphore Theme" panel has no effect
 * and only the `:root` tokens from lib/style.css apply. Always the light
 * palette, hence the surface behind each story: Storybook's own dark mode
 * would otherwise put dark ink on a dark page.
 */
export default {
	title: "Configuration/Without a provider",
	tags: [],
	parameters: { amphoreProvider: false },
	decorators: [
		(Story: React.FC) => (
			<div
				style={{
					padding: "1.5rem",
					background: "var(--amp-color-surface)",
					color: "var(--amp-color-ink)",
				}}
			>
				<Story />
			</div>
		),
	],
};

export const Components = () => {
	const [value, setValue] = useState("");
	const [checked, setChecked] = useState(true);
	const [toggled, setToggled] = useState(true);

	return (
		<Card>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "1.25rem",
				}}
			>
				<div
					style={{
						display: "flex",
						gap: "0.75rem",
						alignItems: "center",
					}}
				>
					<Button variant="solid">Primary</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="ghost">Ghost</Button>
					<Button color="danger">Danger</Button>
					<Badge>Badge</Badge>
				</div>
				<Input
					label="Customer name"
					value={value}
					onChange={setValue}
					placeholder="Jane Doe"
				/>
				<Checkbox
					label="Invoice sent"
					checked={checked}
					onChange={setChecked}
				/>
				<Toggle
					label="Notifications"
					checked={toggled}
					onChange={setToggled}
				/>
			</div>
		</Card>
	);
};

/**
 * `portal` with no provider: AmphorePortal has no scope to re-apply, so it
 * passes through, and the content in `document.body` reads the same `:root`
 * tokens as the rest of the page.
 */
export const Portaled = () => {
	const [value, setValue] = useState<string | null>(null);

	return (
		<div
			style={{
				display: "flex",
				gap: "0.75rem",
				alignItems: "flex-end",
				transform: "translateZ(0)",
				overflow: "hidden",
				width: 420,
				padding: "1rem",
				border: "1px dashed var(--amp-color-border)",
				borderRadius: "var(--amp-radius-md)",
			}}
		>
			<Tooltip content="Escapes the dashed box" portal>
				<Button>Hover me</Button>
			</Tooltip>
			<Select
				label="Portaled select"
				portal
				value={value}
				onChange={(next) => setValue(next as string | null)}
				options={[
					{ value: "a", label: "Option A" },
					{ value: "b", label: "Option B" },
				]}
			/>
		</div>
	);
};
