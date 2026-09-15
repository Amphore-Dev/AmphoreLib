import React from "react";

import { colorArgType, sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { ISpinnerProps, Spinner } from "./Spinner";

export default {
	title: "Components/Atoms/Spinner",
	component: Spinner,
	argTypes: {
		size: sizeArgType,
		color: colorArgType,
	},
};

const Template: StoryFn<ISpinnerProps> = (args) => <Spinner {...args} />;

export const Base = Template.bind({});
Base.args = {};

export const Sizes = () => (
	<div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
		<Spinner size="sm" />
		<Spinner size="md" />
		<Spinner size="lg" />
	</div>
);

export const Colors = () => (
	<div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
		{(
			[
				"primary",
				"danger",
				"success",
				"warning",
				"info",
				"neutral",
				"black",
			] as const
		).map((color) => (
			<Spinner key={color} color={color} />
		))}
	</div>
);

export const DefaultSizeFromConfig = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
		<AmphoreProvider config={{ defaults: { size: "sm" } }}>
			<div
				style={{
					display: "flex",
					gap: "0.75rem",
					alignItems: "center",
				}}
			>
				<span style={{ width: 110, fontSize: 12, opacity: 0.6 }}>
					defaults.size: sm
				</span>
				<Spinner />
			</div>
		</AmphoreProvider>
		<AmphoreProvider config={{ defaults: { size: "lg" } }}>
			<div
				style={{
					display: "flex",
					gap: "0.75rem",
					alignItems: "center",
				}}
			>
				<span style={{ width: 110, fontSize: 12, opacity: 0.6 }}>
					defaults.size: lg
				</span>
				<Spinner />
				{/* An explicit size prop still wins over the config default. */}
				<Spinner size="sm" />
			</div>
		</AmphoreProvider>
	</div>
);
