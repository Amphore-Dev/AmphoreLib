import React from "react";

import { colorArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { ILinkProps, Link } from "./Link";

export default {
	title: "Components/Atoms/Link",
	component: Link,
	argTypes: {
		underline: { control: "radio", options: ["always", "hover", "none"] },
		color: colorArgType,
		external: { control: "boolean" },
		disabled: { control: "boolean" },
	},
};

const Template: StoryFn<ILinkProps> = (args) => <Link {...args} />;

export const Base = Template.bind({});
Base.args = { href: "#", children: "Learn more" };

export const External = Template.bind({});
External.args = {
	href: "https://example.com",
	children: "Documentation",
	external: true,
};

export const Disabled = Template.bind({});
Disabled.args = { href: "#", children: "Unavailable", disabled: true };

export const Underlines = () => (
	<div style={{ display: "flex", gap: "1.5rem" }}>
		<Link href="#" underline="always">
			always
		</Link>
		<Link href="#" underline="hover">
			hover
		</Link>
		<Link href="#" underline="none">
			none
		</Link>
	</div>
);

export const InParagraph = () => (
	<p style={{ maxWidth: 360, fontSize: 14 }}>
		By continuing, you agree to our{" "}
		<Link href="#">terms of service</Link> and our{" "}
		<Link href="#" underline="always">
			privacy policy
		</Link>
		.
	</p>
);
