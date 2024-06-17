import React from "react";
import { StoryFn } from "@storybook/react/*";
import { Toggle } from "./Toggle";

export default {
	title: "Components/Atoms/Toggle",
	component: Toggle,
	argTypes: {
		checked: {
			control: "boolean",
		},
		disabled: {
			control: "boolean",
		},
	},
};

const Template: StoryFn<React.ComponentProps<typeof Toggle>> = (args) => {
	const [checked, setChecked] = React.useState(args.checked);

	React.useEffect(() => {
		setChecked(args.checked);
	}, [args.checked]);
	return (
		<Toggle
			{...args}
			checked={checked}
			onChange={() => {
				setChecked(!checked);
			}}
		/>
	);
};

export const Base = Template.bind({});

Base.args = {
	checked: false,
	disabled: false,
	label: "Toggle",
};

export const Checked = Template.bind({});
Checked.args = {
	checked: true,
};

export const States = Template.bind({});
States.args = {
	checked: true,
	states: true,
};
