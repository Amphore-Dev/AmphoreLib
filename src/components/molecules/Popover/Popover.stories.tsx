import React, { useState } from "react";

import { Button } from "../../atoms/Button/Button";
import { Input } from "../../atoms/Input/Input";

import { Popover } from "./Popover";

export default {
	title: "Components/Molecules/Popover",
	component: Popover,
	argTypes: {
		placement: {
			control: "select",
			options: [
				"top",
				"bottom",
				"bottom-start",
				"bottom-end",
				"left",
				"right",
			],
		},
		closeOnOutsideClick: { control: "boolean" },
		closeOnClick: { control: "boolean" },
		disabled: { control: "boolean" },
	},
};

export const Base = () => (
	<Popover content={<p style={{ margin: 0 }}>A short piece of info.</p>}>
		<Button>Open the popover</Button>
	</Popover>
);

export const WithForm = () => (
	<Popover
		content={
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "0.75rem",
					width: 220,
				}}
			>
				<Input
					label="Rename"
					placeholder="New name"
					value=""
					onChange={() => {}}
				/>
				<Button size="sm">Submit</Button>
			</div>
		}
	>
		<Button variant="outline">Rename</Button>
	</Popover>
);

export const Controlled = () => {
	const [open, setOpen] = useState(false);
	return (
		<div style={{ display: "flex", gap: "0.5rem" }}>
			<Popover
				content={
					<p style={{ margin: 0 }}>
						Content controlled from the outside.
					</p>
				}
				open={open}
				onOpenChange={setOpen}
			>
				<Button>{open ? "Close" : "Open"}</Button>
			</Popover>
			<Button variant="ghost" onClick={() => setOpen((o) => !o)}>
				External toggle
			</Button>
		</div>
	);
};

export const Disabled = () => (
	<Popover content="Never opens" disabled>
		<Button>Open</Button>
	</Popover>
);

// A one-off-action menu (each button picks a value and is done with it) —
// closeOnClick closes the popover the moment any of them is clicked,
// instead of requiring the caller to manage open/onOpenChange for that.
export const CloseOnClick = () => {
	const [picked, setPicked] = useState<string | null>(null);
	return (
		<div
			style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
		>
			<Popover
				content={
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "0.25rem",
						}}
					>
						{["Red", "Green", "Blue"].map((color) => (
							<button
								key={color}
								type="button"
								onClick={() => setPicked(color)}
							>
								{color}
							</button>
						))}
					</div>
				}
				closeOnClick
			>
				<Button>Pick a color</Button>
			</Popover>
			{picked && <p>Picked: {picked}</p>}
		</div>
	);
};
