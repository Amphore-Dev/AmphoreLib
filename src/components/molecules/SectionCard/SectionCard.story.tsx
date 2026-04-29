// stories for SectionCard component
import React from "react";

import { StoryFn } from "@storybook/react";

import { SectionCard } from "./SectionCard";
import { Button } from "@components/atoms";

export default {
	title: "Components/Molecules/SectionCard",
	component: SectionCard,
};

const Template: StoryFn = (args) => (
	<div className="p-4 bg-neutral-50">
		<SectionCard title="Section Card" {...args} />
	</div>
);

export const Default = Template.bind({});
Default.args = {
	title: "Section Card Title",
	children: <p>This is the content of the section card.</p>,
};

export const WithActions = Template.bind({});
WithActions.args = {
	title: "Section Card with Actions",
	actions: <Button>Action</Button>,
	children: <p>This section card has an action button.</p>,
};

export const CustomTitle = Template.bind({});
CustomTitle.args = {
	title: (
		<h2
			style={{
				fontFamily: "Comic sans ms",
			}}
			className="!text-3xl text-pink-500"
		>
			Custom Title
		</h2>
	),
	children: <p>This section card has a custom title.</p>,
};

export const CustomClassName = Template.bind({});
CustomClassName.args = {
	title: "Section Card with Custom Class",
	className: "custom-section-card",
	children: <p>This section card has a custom class name for styling.</p>,
};
