import React from "react";
import { StoryFn } from "@storybook/react/*";
import { LanguageSwitcher, ILanguageSwitcher } from "./LanguageSwitcher";

export default {
	title: "Components/Molecules/LanguageSwitcher",
	component: LanguageSwitcher,
	argTypes: {
		handleChange: {
			action: "handleChange",
		},
	},
};

const Template: StoryFn<ILanguageSwitcher> = (args) => {
	return <LanguageSwitcher {...args} />;
};

export const Base = Template.bind({});

Base.args = {
	handleChange: (code) => {
		alert(`Language changed to ${code}`);
	},
};
