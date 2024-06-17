import React from "react";
import { StoryFn } from "@storybook/react";
import { HeadBar } from "./HeadBar";

export default {
	title: "Components/Molecules/HeadBar",
	component: HeadBar,
	argTypes: {
		leftContent: {
			control: "node",
		},
		rightContent: {
			control: "node",
		},
		className: {
			control: "text",
		},
	},
};

const Template: StoryFn = (props) => {
	return <HeadBar {...props} />;
};

export const Base: any = Template.bind({});

Base.args = {
	className: "bg-neutral-50",
	leftContent: 
		<div>Left Content</div>
	,
	rightContent: <>
		<div>Menu 1</div>
		<div>Menu 2</div>
		<div className="p-5 bg-neutral-200 rounded-full"/>
	</>,
};

export const Menu: StoryFn = (props) => {
	return (
		<HeadBar
			{...props}
			onMenuClick={() => {
				alert("Menu Clicked");
			}}
		/>
	);
};
