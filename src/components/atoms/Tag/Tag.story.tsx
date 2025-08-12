import React from "react";

import { StoryFn } from "@storybook/react";

import { Tag, TagColors, ITagProps, TagSizes } from "./Tag";

const Template: StoryFn<ITagProps> = (args) => (
	<div className="flex items-center gap-6">
		<Tag {...args} />
	</div>
);

export default {
	title: "Components/Atoms/Tag",
	component: Tag,
	argTypes: {
		color: {
			control: "radio",
			options: TagColors,
		},
		size: {
			control: "radio",
			options: TagSizes,
		},
	},
};

export const Default = Template.bind({});

Default.args = {
	children: "Tag",
	color: "primary",
	size: "s",
};

export const VariantColor = () => {
	return (
		<div className="flex items-start gap-2">
			{TagColors.map((color) => (
				<Tag key={color} color={color}>
					{color}
				</Tag>
			))}
		</div>
	);
};

export const Size = () => {
	return (
		<div className="flex gap-2">
			<Tag color="primary">new</Tag>
			<Tag color="primary">warning</Tag>
			<Tag color="primary">hello</Tag>
		</div>
	);
};
