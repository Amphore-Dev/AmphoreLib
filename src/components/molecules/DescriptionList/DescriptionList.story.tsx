import React from "react";

import { StoryFn } from "@storybook/react";

import { DescriptionList, IDescriptionListProps } from "./DescriptionList";

const Template: StoryFn<IDescriptionListProps> = (args) => (
	<div className="flex">
		<DescriptionList {...args} />
	</div>
);

export default {
	title: "Components/Molecules/DescriptionList",
	component: Template,
};

export const Default = Template.bind({});

Default.args = {
	label: "Label",
	info: {
		text: "Information",
		picto: "moon",
	},
};

export const Required = Template.bind({});

Required.args = {
	...Default.args,
	required: true,
};

export const NoPicto = Template.bind({});

NoPicto.args = {
	...Default.args,
	info: {
		text: "Information",
	},
};

export const ClickableInfo = Template.bind({});

ClickableInfo.args = {
	...Default.args,
	info: {
		text: "Information",
		picto: "moon",
		onClick: () => {
			alert("Info clicked");
		},
	},
};

export const UnderlinedClickableInfo = Template.bind({});

UnderlinedClickableInfo.args = {
	...Default.args,
	info: {
		text: "Information",
		picto: "moon",
		onClick: () => {
			alert("Info clicked");
		},
		isUnderlined: true,
	},
};

export const WithMaxLines = Template.bind({});

WithMaxLines.args = {
	label: "Label",
	info: {
		text: "This is a long text that will be truncated after a certain number of lines. It keeps going and going to demonstrate the truncation behavior with a tooltip on hover.his is a long text that will be truncated after a certain number of lines. It keeps going and going to demonstrate the truncation behavior with a tooltip on hover.his is a long text that will be truncated after a certain number of lines. It keeps going and going to demonstrate the truncation behavior with a tooltip on hover.",
		maxLines: 2,
	},
};

export const WithAction = Template.bind({});

WithAction.args = {
	label: "Label",
	action: {
		picto: "plus",
		label: "Action",
		onClick: () => {
			alert("Action clicked");
		},
	},
};
