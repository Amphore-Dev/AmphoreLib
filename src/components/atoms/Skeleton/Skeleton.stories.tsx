import React from "react";

import { StoryFn } from "@storybook/react";

import { ISkeletonProps, Skeleton } from "./Skeleton";

export default {
	title: "Components/Atoms/Skeleton",
	component: Skeleton,
	argTypes: {
		variant: { control: "radio", options: ["text", "circle", "rect"] },
		width: { control: "text" },
		height: { control: "text" },
	},
};

const Template: StoryFn<ISkeletonProps> = (args) => <Skeleton {...args} />;

export const Base = Template.bind({});
Base.args = {};

export const Circle = Template.bind({});
Circle.args = { variant: "circle" };

export const Rect = Template.bind({});
Rect.args = { variant: "rect" };

export const CustomSize = Template.bind({});
CustomSize.args = { variant: "circle", width: 80, height: 80 };

/** A common composition: avatar + a couple of text lines, standing in for a loading card. */
export const CardPlaceholder = () => (
	<div style={{ display: "flex", gap: "0.75rem", maxWidth: 320 }}>
		<Skeleton variant="circle" width={48} height={48} />
		<div
			style={{
				flex: 1,
				display: "flex",
				flexDirection: "column",
				gap: "0.5rem",
			}}
		>
			<Skeleton width="60%" />
			<Skeleton width="90%" />
			<Skeleton width="40%" />
		</div>
	</div>
);
