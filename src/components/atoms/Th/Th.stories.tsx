import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { IThProps, Th } from "./Th";

export default {
	title: "Components/Atoms/Th",
	component: Th,
	argTypes: {
		sortable: { control: { type: "boolean" } },
		sticky: { control: "radio", options: [undefined, "left", "right"] },
	},
};

const Template: StoryFn<IThProps> = (args) => (
	<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
		<Th>Name</Th>
		<Th {...args}>Email</Th>
		<Th>Role</Th>
	</div>
);

export const Base = Template.bind({});
Base.args = {};

export const Sortable = () => {
	const [key, setKey] = useState<"name" | "email" | undefined>(undefined);
	const [direction, setDirection] = useState<"asc" | "desc" | undefined>();
	return (
		<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
			<Th
				sortable
				sortDirection={key === "name" ? direction : undefined}
				onSort={() => {
					setKey("name");
					setDirection((d) => (d === "asc" ? "desc" : "asc"));
				}}
			>
				Name
			</Th>
			<Th
				sortable
				sortDirection={key === "email" ? direction : undefined}
				onSort={() => {
					setKey("email");
					setDirection((d) => (d === "asc" ? "desc" : "asc"));
				}}
			>
				Email
			</Th>
			<Th>Role</Th>
		</div>
	);
};

export const StickyRight = Template.bind({});
StickyRight.args = { sticky: "right" };
