import React from "react";

import { StoryFn } from "@storybook/react";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { Card, ICardProps } from "./Card";

export default {
	title: "Components/Atoms/Card",
	component: Card,
	argTypes: {
		elevation: { control: "select", options: [undefined, 1, 2, 3, 4, 5] },
		noPadding: { control: { type: "boolean" } },
		bordered: { control: { type: "boolean" } },
		shadow: { control: "object" },
	},
};

const Template: StoryFn<ICardProps> = (args) => (
	<Card {...args}>
		<p style={{ margin: 0, fontWeight: 600 }}>Order #4127</p>
		<p style={{ margin: "0.5rem 0 0", fontSize: 13, opacity: 0.7 }}>
			18 items · delivery expected Sept 14
		</p>
	</Card>
);

export const Base = Template.bind({});
Base.args = {};

/**
 * `shadow` sets the base geometry — `x`/`y` the light direction, `blur` the
 * softness (default 2× `y`); `elevation` scales all of it.
 */
export const Shadow = () => (
	<div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
		{[
			{ x: 0, y: 1 },
			{ x: 2, y: 2 },
			{ x: -2, y: 2 },
			{ x: 0, y: -1 },
			{ x: 0, y: 0, blur: 1 },
			{ y: 1, blur: 8 },
			{ y: 1, blur: 0 },
		].map((shadow) => (
			<Card
				key={JSON.stringify(shadow)}
				elevation={3}
				shadow={shadow}
				style={{ width: 140 }}
			>
				<span style={{ fontSize: 12, opacity: 0.6 }}>
					{JSON.stringify(shadow)}
				</span>
			</Card>
		))}
	</div>
);

export const Elevated = Template.bind({});
Elevated.args = { elevation: 3 };

export const ElevationLevels = () => (
	<div style={{ display: "flex", gap: "1.5rem" }}>
		{([1, 2, 3, 4, 5] as const).map((level) => (
			<Card key={level} elevation={level} style={{ width: 120 }}>
				<span style={{ fontSize: 12, opacity: 0.6 }}>
					elevation {level}
				</span>
			</Card>
		))}
	</div>
);

export const NoPadding = () => (
	<Card noPadding style={{ width: 240 }}>
		<img
			src="https://picsum.photos/240/120"
			alt=""
			style={{ display: "block", width: "100%", borderRadius: "inherit" }}
		/>
	</Card>
);

export const DarkTheme = () => (
	<AmphoreProvider theme="dark">
		<div style={{ display: "flex", gap: "1.5rem" }}>
			<Card elevation={2} style={{ width: 200 }}>
				<p style={{ margin: 0, fontWeight: 600 }}>Order #4127</p>
				<p style={{ margin: "0.5rem 0 0", fontSize: 13, opacity: 0.7 }}>
					theme=&quot;dark&quot;
				</p>
			</Card>
		</div>
	</AmphoreProvider>
);

/** Padding comes from `--amp-card-padding` (density), not a `size` prop. */
export const Density = () => (
	<div style={{ display: "flex", gap: "1.5rem" }}>
		<AmphoreProvider config={{ density: "comfortable" }}>
			<Card style={{ width: 200 }}>
				<span style={{ fontSize: 12, opacity: 0.6 }}>comfortable</span>
			</Card>
		</AmphoreProvider>
		<AmphoreProvider config={{ density: "compact" }}>
			<Card style={{ width: 200 }}>
				<span style={{ fontSize: 12, opacity: 0.6 }}>compact</span>
			</Card>
		</AmphoreProvider>
	</div>
);
