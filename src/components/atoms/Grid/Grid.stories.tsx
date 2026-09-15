import React from "react";

import { StoryFn } from "@storybook/react";

import { Grid, IGridProps } from "./Grid";

export default {
	title: "Components/Atoms/Grid",
	component: Grid,
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

const Template: StoryFn<IGridProps> = (args) => <Grid {...args} />;

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
	children: [1, 2, 3, 4, 5].map((n) => (
		<div key={n} style={itemStyle}>
			Item {n}
		</div>
	)),
};

// The property FlexGrid can't offer: a `Fragment` grouping several fields
// (here, one per "group") stays fully transparent to layout — every field
// inside still lands as its own grid item, not one opaque cell per group.
// FlexGrid's `Children.map` would instead see each Fragment as a single
// child and wrap the whole thing in one FlexGridItem, collapsing it.
export const TransparentToFragments = () => (
	<Grid columns={3} minItemWidth="150px" gap="1rem">
		<React.Fragment>
			<div style={itemStyle}>Group A · Field 1</div>
			<div style={itemStyle}>Group A · Field 2</div>
		</React.Fragment>
		<React.Fragment>
			<div style={itemStyle}>Group B · Field 1</div>
		</React.Fragment>
	</Grid>
);
