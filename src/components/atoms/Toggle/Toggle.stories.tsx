import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { IToggleProps, Toggle } from "./Toggle";

const Template: StoryFn<IToggleProps> = (args) => {
	const [checked, setChecked] = useState(args.defaultChecked || false);

	return (
		<div className="flex">
			<Toggle
				{...args}
				checked={checked}
				onChange={() => {
					setChecked((checked) => !checked);
				}}
			/>
		</div>
	);
};

export default {
	title: "Components/Atoms/Toggle",
	component: Template,
};

export const Default = {
	args: {
		label: "Label",
	},
};

export const Disabled = {
	args: {
		label: "Label",
		disabled: true,
	},
};

export const DisabledChecked = {
	args: {
		label: "Label",
		disabled: true,
		defaultChecked: true,
	},
};
