import React from "react";

import { StoryFn } from "@storybook/react";

import { ILinkProps, Link } from "./Link";

const Template: StoryFn<ILinkProps> = (args) => (
	<div className="flex">
		<Link {...args} />
	</div>
);

export default {
	title: "Components/Atoms/Link",
	component: Template,
};

export const Default = Template.bind({});

Default.args = {
	label: "Link",
	picto: "download",
	href: window.location.href,
};

export const NoHrefButWithOnClick = Template.bind({});

NoHrefButWithOnClick.args = {
	...Default.args,
	href: undefined,
	onClick: () => {
		alert("Link clicked");
	},
};

export const NoPicto = Template.bind({});

NoPicto.args = {
	...Default.args,
	picto: undefined,
};
