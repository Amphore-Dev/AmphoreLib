import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { IToolBarProps, ToolBar, TToolBarItem } from "./ToolBar";

export default {
	title: "Components/Molecules/ToolBar",
	component: ToolBar,
	argTypes: {
		portal: { control: "boolean" },
		position: { control: "radio", options: ["top", "bottom"] },
	},
};

const items: TToolBarItem[] = [
	{ id: "bold", label: "Bold", picto: "check" },
	{ id: "italic", label: "Italic", picto: "star" },
	{
		id: "colors",
		label: "Colors",
		picto: "star",
		popoverContent: (
			<div style={{ display: "flex", gap: "0.5rem" }}>
				{["#EB144C", "#00D084", "#0693E3"].map((c) => (
					<div
						key={c}
						style={{
							width: 24,
							height: 24,
							borderRadius: "50%",
							background: c,
						}}
					/>
				))}
			</div>
		),
	},
];

const Template: StoryFn<IToolBarProps> = (args) => {
	const [activeItem, setActiveItem] = useState<string | undefined>();
	return (
		<ToolBar {...args} activeItem={activeItem} onChange={setActiveItem} />
	);
};

export const Base = Template.bind({});
Base.args = { items };

export const LabelsOnly = Template.bind({});
LabelsOnly.args = {
	items: [
		{ id: "list", label: "List" },
		{ id: "table", label: "Table" },
		{ id: "image", label: "Image" },
	],
};

export const AtTopOfScreen = Template.bind({});
AtTopOfScreen.args = { items, position: "top" };

export const Portal = Template.bind({});
Portal.args = {
	...Base.args,
	portal: true,
};
