import React from "react";

import { Pictos } from "@constants/CPictos";
import { StoryFn } from "@storybook/react";

import { Button, IButtonProps } from "./Button";

export default {
	title: "Components/Atoms/Button",
	component: Button,
	argTypes: {
		outline: {
			control: {
				type: "boolean",
			},
		},
		disabled: {
			control: {
				type: "boolean",
			},
		},
		isLoading: {
			control: {
				type: "boolean",
			},
		},
		color: {
			control: "radio",
			options: [
				"black",
				"white",
				"primary",
				"red",
				"green",
				"yellow",
				"transparent",
			],
		},
		children: {
			control: {
				type: "text",
			},
		},
		picto: {
			control: {
				type: "select",
			},
			options: Object.keys(Pictos),
			description: "Icon to display in the button.",
		},
		"...": {
			description: "All default button props",
			control: {
				disable: true,
			},
		},
	},
	parameters: {
		controls: {
			include: [
				"outline",
				"color",
				"disabled",
				"isLoading",
				"children",
				"picto",
				"...",
			],
		},
	},
};

const Template: StoryFn<IButtonProps> = (args) => (
	<div className="flex items-center gap-6">
		<Button {...args} size="s" />
		<Button {...args} />
		<Button {...args} size="l" />
	</div>
);

export const Base = Template.bind({});

Base.args = {
	children: "Button",
	outline: true,
	disabled: false,
	isLoading: false,
};

export const Sizes = () => {
	return (
		<div className="flex items-start gap-12">
			<Button color="black" outline>
				Default Raisin
			</Button>
			<Button color="black" outline size={"s"}>
				Small Raisin
			</Button>
		</div>
	);
};

export const Loading = () => {
	return (
		<div className="flex gap-12">
			<Button color="black" outline isLoading>
				Loading...
			</Button>
			<Button color="white" isLoading>
				Loading...
			</Button>
		</div>
	);
};

export const Disabled = () => {
	return (
		<div className="flex gap-12">
			<Button color="black" outline disabled>
				Hey there 👋
			</Button>
			<Button color="white" disabled>
				Popcorn 🍿
			</Button>
		</div>
	);
};

export const CustomPicto = () => {
	return (
		<div className="flex gap-12">
			<Button color="black" outline picto="logo">
				With Picto name
			</Button>
			<Button
				color="yellow"
				outline
				picto={{
					icon: "logo",
					style: { color: "red", rotate: "22.5deg" },
					className: "animate-spin",
				}}
			>
				Custom Picto props
			</Button>
		</div>
	);
};
