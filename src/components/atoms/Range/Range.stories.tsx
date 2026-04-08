import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { Range, IRangeProps } from "./Range";

export default {
	title: "Components/Atoms/Range",
	component: Range,
};

const Template: StoryFn<IRangeProps> = (args) => {
	const [value, setValue] = useState(args.value ?? 40);
	return (
		<div className="w-64">
			<Range {...args} value={value} onChange={setValue} />
			<div className="mt-2 text-sm text-neutral-500">{value}</div>
		</div>
	);
};

export const Default = Template.bind({});
Default.args = {
	min: 0,
	max: 100,
	step: 1,
	value: 40,
};

export const Disabled = Template.bind({});
Disabled.args = {
	...Default.args,
	disabled: true,
};

export const WithStep = Template.bind({});
WithStep.args = {
	min: 0,
	max: 10,
	step: 2,
	value: 4,
};
