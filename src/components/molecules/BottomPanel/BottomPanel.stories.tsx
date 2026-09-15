import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { BottomPanel, IBottomPanelProps } from "./BottomPanel";

export default {
	title: "Components/Molecules/BottomPanel",
	component: BottomPanel,
	argTypes: {
		defaultHeight: { control: "number" },
		minHeight: { control: "number" },
		maxHeightRatio: { control: "number" },
		closeThreshold: { control: "number" },
		open: { control: false },
		onOpenChange: { control: false },
		openLabel: { control: "text" },
		collapsedLabel: { control: "text" },
		collapseLabel: { control: "text" },
		expandLabel: { control: "text" },
	},
	parameters: {
		// Fixed-position, fills the viewport height — same reason Modal
		// needs this (see memory/amphorelib-v2-conventions.md).
		docs: { story: { height: "500px" } },
	},
};

const Template: StoryFn<IBottomPanelProps> = (args) => {
	const [open, setOpen] = useState(args.open ?? true);
	return (
		<div style={{ height: 460, position: "relative", overflow: "hidden" }}>
			<BottomPanel {...args} open={open} onOpenChange={setOpen}>
				{args.children}
			</BottomPanel>
		</div>
	);
};

export const Base = Template.bind({});
Base.args = {
	open: true,
	children: (
		<div>
			<h3 style={{ margin: "0 0 8px" }}>Task #482</h3>
			<p style={{ margin: 0 }}>
				Drag the handle to resize, or tap it to
				collapse/expand.
			</p>
		</div>
	),
};

export const Collapsed = Template.bind({});
Collapsed.args = {
	...Base.args,
	open: false,
};

export const CustomHeights = Template.bind({});
CustomHeights.args = {
	...Base.args,
	defaultHeight: 320,
	minHeight: 64,
};
