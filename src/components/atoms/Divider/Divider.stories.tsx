import React from "react";

import { StoryFn } from "@storybook/react";

import { Divider, IDividerProps } from "./Divider";

export default {
	title: "Components/Atoms/Divider",
	component: Divider,
	argTypes: {
		orientation: { control: "radio", options: ["horizontal", "vertical"] },
		label: { control: "text" },
	},
};

const Template: StoryFn<IDividerProps> = (args) => <Divider {...args} />;

export const Base = Template.bind({});
Base.args = {};

export const WithLabel = Template.bind({});
WithLabel.args = { label: "or" };

export const Vertical = () => (
	<div
		style={{
			display: "flex",
			alignItems: "center",
			gap: "1rem",
			height: 40,
		}}
	>
		<span>Left</span>
		<Divider orientation="vertical" />
		<span>Right</span>
	</div>
);

export const BetweenSections = () => (
	<div style={{ maxWidth: 320 }}>
		<p style={{ margin: 0 }}>Sign in with an email</p>
		<div style={{ margin: "1rem 0" }}>
			<Divider label="or" />
		</div>
		<p style={{ margin: 0 }}>Continue with Google</p>
	</div>
);
