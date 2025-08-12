import React from "react";

import { StoryFn } from "@storybook/react";

import { TagColors, TagSizes } from "../Tag/Tag";
import { Badge, IBadgeProps } from "./Badge";

const Template: StoryFn<IBadgeProps> = (args) => (
	<div className="flex items-center gap-6">
		<Badge {...args} />
	</div>
);

export default {
	title: "Components/Atoms/Badge",
	component: Badge,
	argTypes: {
		color: {
			control: "radio",
			options: TagColors,
		},
		size: {
			control: "radio",
			options: TagSizes,
		},
		value: {
			control: {
				type: "number",
			},
		},
	},
};

export const Default = Template.bind({});

Default.args = {
	value: 100,
	color: "primary",
};

export const VariantColor = () => {
	return (
		<div className="flex items-start gap-2">
			{BadgeColors.map((color) => (
				<Badge key={color} color={color} value={100} />
			))}
		</div>
	);
};

export const Size = () => {
	return (
		<div className="flex gap-2">
			<Badge color="primary" value={1} />
			<Badge color="primary" value={10} />
			<Badge color="primary" value={100} />
		</div>
	);
};
