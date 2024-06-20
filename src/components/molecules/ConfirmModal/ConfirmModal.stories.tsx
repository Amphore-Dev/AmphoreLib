import React from "react";

import { StoryFn } from "@storybook/react";

import { useModal } from "@hooks/useModal/useModal";

import { ConfirmModal, IConfirmModalProps } from "./ConfirmModal";
import { Button } from "@components/atoms";

export default {
	title: "Components/Molecules/ConfirmModal",
	component: ConfirmModal,
	argTypes: {
		closeOnClickOutside: {
			control: {
				type: "boolean",
			},
		},
	},
};

const Template: StoryFn<IConfirmModalProps> = (args) => {
	const { isDisplayed, toggle } = useModal();

	return (
		<>
			<Button onClick={toggle}>Open Modal</Button>
			<ConfirmModal
				{...args}
				onConfirm={
					args.onConfirm
						? () => args.onConfirm()
						: () => {
								alert("Confirmed");
								toggle();
							}
				}
				onClose={() => {
					alert("Closed");
					toggle();
				}}
				onCancel={() => {
					alert("Cancelled");
					toggle();
				}}
				isDisplayed={isDisplayed}
			/>
		</>
	);
};

export const Base = Template.bind({});

const DefaultsArgs = {
	isDisplayed: false,
	title: "Are you sure?",
	text: "This action cannot be undone.",
	cancelText: "Cancel",
	confirmText: "Confirm",
	onClose: () => alert("closed"),
	onCancel: () => alert("cancelled"),
	closeOnClickOutside: true,
};

Base.args = DefaultsArgs;

export const Promises = Template.bind({});
Promises.args = {
	...DefaultsArgs,
	onConfirm: () =>
		new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve("Confirmed");
			}, 2000);
		}),
};
