import React, { useState } from "react";

import { sizeArgType } from "@stories/StoriesArgs";

import { Button } from "../../atoms/Button/Button";

import { IModalProps, Modal } from "./Modal";

export default {
	title: "Components/Molecules/Modal",
	component: Modal,
	argTypes: {
		size: sizeArgType,
		closeOnOverlayClick: { control: "boolean" },
		closeOnEscape: { control: "boolean" },
		hideCloseButton: { control: "boolean" },
		closeLabel: { control: "text" },
		portal: { control: "boolean" },
	},
	// Inline by default (see Modal.tsx) — the modal covers the story's own
	// iframe viewport, not the whole page. Addon-docs otherwise embeds that
	// iframe at a small default height, clipping the modal. This asks for a
	// taller one specifically on the docs page (Canvas tab is unaffected/
	// full-size). The `Portaled` story escapes this entirely.
	parameters: {
		docs: { story: { height: "420px" } },
	},
};

const Template = (args: Partial<IModalProps>) => {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button onClick={() => setOpen(true)}>Open the modal</Button>
			<Modal
				title="Confirm deletion"
				{...args}
				open={open}
				onClose={() => setOpen(false)}
			>
				<p style={{ margin: 0 }}>
					This action cannot be undone. Do you want to continue?
				</p>
			</Modal>
		</>
	);
};

export const Base = Template.bind({});
Base.args = {};

export const WithFooter = () => {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button onClick={() => setOpen(true)}>Open the modal</Button>
			<Modal
				open={open}
				onClose={() => setOpen(false)}
				title="Delete the order"
				footer={
					<>
						<Button variant="ghost" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button color="danger" onClick={() => setOpen(false)}>
							Delete
						</Button>
					</>
				}
			>
				<p style={{ margin: 0 }}>
					This action cannot be undone. Do you want to continue?
				</p>
			</Modal>
		</>
	);
};

export const Sizes = () => {
	const [openSize, setOpenSize] = useState<"sm" | "md" | "lg" | null>(null);
	return (
		<>
			<div style={{ display: "flex", gap: "0.5rem" }}>
				<Button onClick={() => setOpenSize("sm")}>Small</Button>
				<Button onClick={() => setOpenSize("md")}>Medium</Button>
				<Button onClick={() => setOpenSize("lg")}>Large</Button>
			</div>
			<Modal
				open={openSize !== null}
				onClose={() => setOpenSize(null)}
				title={`Modal ${openSize}`}
				size={openSize ?? "md"}
			>
				<p style={{ margin: 0 }}>Modal content.</p>
			</Modal>
		</>
	);
};

export const LongBody = () => {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button onClick={() => setOpen(true)}>Open the modal</Button>
			<Modal
				open={open}
				onClose={() => setOpen(false)}
				title="Terms of service"
				footer={
					<>
						<Button variant="ghost" onClick={() => setOpen(false)}>
							Decline
						</Button>
						<Button onClick={() => setOpen(false)}>Accept</Button>
					</>
				}
			>
				{Array.from({ length: 30 }, (_, i) => (
					<p key={i} style={{ margin: "0 0 1rem" }}>
						Paragraph {i + 1} — test content to check that only the
						modal's body scrolls, while the title and footer stay
						fixed (sticky) at the top and bottom.
					</p>
				))}
			</Modal>
		</>
	);
};

export const NoCloseButton = () => {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button onClick={() => setOpen(true)}>Open</Button>
			<Modal
				open={open}
				onClose={() => setOpen(false)}
				title="Processing"
				hideCloseButton
				closeOnOverlayClick={false}
				closeOnEscape={false}
				footer={<Button onClick={() => setOpen(false)}>Finish</Button>}
			>
				<p style={{ margin: 0 }}>
					Only the button below closes this modal.
				</p>
			</Modal>
		</>
	);
};

/**
 * `portal` renders the overlay into `document.body` through AmphorePortal,
 * which re-applies the nearest AmphoreProvider's theme scope inside the
 * portal — so it's styled exactly like the inline version. Here the trigger
 * sits inside a `transform`ed, `overflow: hidden` box: inline, the fixed
 * overlay would be trapped and clipped by that ancestor; portaled, it
 * covers the whole viewport as expected.
 */
export const Portaled = () => {
	const [open, setOpen] = useState(false);
	return (
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
			<p style={{ margin: "0 0 0.75rem", color: "var(--amp-color-sub)" }}>
				transform + overflow: hidden ancestor
			</p>
			<Button onClick={() => setOpen(true)}>Open (portaled)</Button>
			<Modal
				open={open}
				onClose={() => setOpen(false)}
				title="Portaled modal"
				portal
			>
				<p style={{ margin: 0 }}>
					Rendered into document.body, theme scope re-applied — not
					clipped by the dashed box.
				</p>
			</Modal>
		</div>
	);
};
Portaled.parameters = { docs: { story: { height: "auto" } } };
