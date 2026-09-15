import React from "react";

import { StoryFn } from "@storybook/react";

import { FlexGrid, IFlexGridProps } from "./FlexGrid";
import { FlexGridItem } from "./FlexGridItem";

export default {
	title: "Components/Atoms/FlexGrid",
	component: FlexGrid,
	argTypes: {
		columns: { control: "number" },
		minItemWidth: { control: "text" },
		gap: { control: "text" },
	},
};

const itemStyle: React.CSSProperties = {
	background: "var(--amp-color-ghost-bg)",
	padding: "1rem",
	borderRadius: "var(--amp-radius-md)",
};

const Template: StoryFn<IFlexGridProps> = (args) => <FlexGrid {...args} />;

export const Base = Template.bind({});
Base.args = {
	columns: 3,
	minItemWidth: "150px",
	gap: "1rem",
	children: [1, 2, 3, 4, 5].map((n) => (
		<div key={n} style={itemStyle}>
			Item {n}
		</div>
	)),
};

export const NoColumnLimit = Template.bind({});
NoColumnLimit.args = {
	minItemWidth: "150px",
	gap: "1rem",
	children: [1, 2, 3, 4, 5, 6, 7].map((n) => (
		<div key={n} style={itemStyle}>
			Item {n}
		</div>
	)),
};

export const CustomGap = Template.bind({});
CustomGap.args = {
	columns: 4,
	minItemWidth: "150px",
	gap: "1rem 2rem",
	children: [
		<div key={0} data-span={3} style={itemStyle}>
			Item 1 (spans 3 columns via data-span)
		</div>,
		...[2, 3, 4, 5].map((n) => (
			<div key={n} style={itemStyle}>
				Item {n}
			</div>
		)),
	],
};

export const ManualSpans = () => (
	<FlexGrid columns={3} minItemWidth="200px" gap="1rem">
		<FlexGridItem span={3}>
			<div style={itemStyle}>
				Full width (span 3, via FlexGridItem)
			</div>
		</FlexGridItem>
		<FlexGridItem span={2}>
			<div style={itemStyle}>
				Two columns (span 2, via FlexGridItem)
			</div>
		</FlexGridItem>
		<div style={itemStyle}>One column (auto)</div>
		<div data-span={2} style={itemStyle}>
			Two columns (span 2, via data-span)
		</div>
		<div style={itemStyle}>One column (auto)</div>
	</FlexGrid>
);
