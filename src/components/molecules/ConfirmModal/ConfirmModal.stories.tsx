import React, { useState } from "react";

import { sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { Button } from "../../atoms/Button/Button";

import { ConfirmModal, IConfirmModalProps } from "./ConfirmModal";

export default {
	title: "Components/Molecules/ConfirmModal",
	component: ConfirmModal,
	argTypes: {
		portal: { control: "boolean" },
		size: sizeArgType,
		confirmColor: {
			control: "select",
			options: [
				"primary",
				"danger",
				"success",
				"warning",
				"info",
				"neutral",
				"black",
				"white",
			],
		},
	},
};

const Template: StoryFn<IConfirmModalProps> = (args) => {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button onClick={() => setOpen(true)}>Open</Button>
			<ConfirmModal
				{...args}
				open={open}
				onClose={() => setOpen(false)}
				onConfirm={() => {
					setOpen(false);
				}}
			/>
		</>
	);
};

export const Base = Template.bind({});
Base.args = {
	title: "Confirm the action",
	children: "Are you sure you want to continue?",
};

export const Destructive = Template.bind({});
Destructive.args = {
	title: "Delete the item",
	children: "This action cannot be undone.",
	confirmColor: "danger",
	confirmText: "Delete",
};

export const AsyncConfirm = () => {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button onClick={() => setOpen(true)}>Open</Button>
			<ConfirmModal
				open={open}
				onClose={() => setOpen(false)}
				title="Save"
				confirmText="Save"
				onConfirm={() =>
					new Promise<void>((resolve) => {
						setTimeout(() => {
							resolve();
							setOpen(false);
						}, 1500);
					})
				}
			>
				Simulates a 1.5s network call before closing.
			</ConfirmModal>
		</>
	);
};
