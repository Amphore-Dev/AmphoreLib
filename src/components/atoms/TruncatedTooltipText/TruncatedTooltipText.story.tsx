import React from "react";

import { Meta, StoryObj } from "@storybook/react";

import { TruncatedTooltipText } from "./TruncatedTooltipText";

const meta: Meta<typeof TruncatedTooltipText> = {
	title: "Components/Atoms/TruncatedTooltipText",
	component: TruncatedTooltipText,
	argTypes: {
		maxLines: {
			control: { type: "number", min: 1, max: 10 },
			description: "Number of lines before showing tooltip",
		},
	},
};

const longText =
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent efficitur, nisl sed commodo luctus, risus neque varius sapien, sed convallis nulla nulla a augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin sit amet metus nec metus vulputate laoreet. Aliquam erat volutpat.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent efficitur, nisl sed commodo luctus, risus neque varius sapien, sed convallis nulla nulla a augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin sit amet metus nec metus vulputate laoreet.";

export default meta;
type Story = StoryObj<typeof TruncatedTooltipText>;

export const SingleLine: Story = {
	args: {
		children: longText,
	},
};

export const TwoLines: Story = {
	args: {
		children: longText,
		maxLines: 2,
	},
};

export const ThreeLines: Story = {
	args: {
		children: longText,
		maxLines: 3,
	},
};

export const FourLines: Story = {
	args: {
		children: longText,
		maxLines: 4,
	},
};
