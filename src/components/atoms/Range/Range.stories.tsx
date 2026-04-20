import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { Range, IRangeProps } from "./Range";

import { cn } from "@utils/cn";

export default {
	title: "Components/Atoms/Range",
	component: Range,
	args: {
		centered: false,
	},
	argTypes: {
		centered: {
			description:
				"If true, the fill will be centered around the middle value",
			control: {
				type: "boolean",
			},
		},
		min: {
			control: {
				type: "number",
			},
		},
		max: {
			control: {
				type: "number",
			},
		},
		step: {
			control: {
				type: "number",
			},
		},
		value: {
			control: {
				type: "number",
			},
		},
	},
};

const Template: StoryFn<IRangeProps> = (args) => {
	const [value, setValue] = useState(args.value ?? 40);
	return (
		<div className="w-64">
			<Range
				centered={false}
				{...args}
				value={value}
				onChange={setValue}
			/>
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
	centered: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
	...Default.args,
	disabled: true,
};

export const WithStep = Template.bind({});
WithStep.args = {
	...Default.args,
	min: 0,
	max: 10,
	step: 2,
	value: 4,
};

export const Centered = Template.bind({});
Centered.args = {
	centered: true,
	min: -50,
	max: 50,
	value: 0,
};

const HideParentTemplate: StoryFn<IRangeProps> = (args) => {
	const [value, setValue] = useState(args.value ?? 40);

	const parentRef = React.useRef<HTMLDivElement>(null);
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = React.useState(false);

	return (
		<div
			className={cn([
				"parent-cont bg-neutral-500 p-4 rounded",
				isDragging && "bg-opacity-0",
			])}
			ref={parentRef}
		>
			<div className="w-64 bg-neutral-800 p-4 rounded" ref={inputRef}>
				<Range
					centered={false}
					{...args}
					value={value}
					onChange={setValue}
					onMouseDown={(e) => {
						setIsDragging(true);
					}}
					onMouseUp={(e) => {
						setIsDragging(false);
					}}
				/>
				<div className="mt-2 text-sm text-neutral-500">{value}</div>
			</div>
		</div>
	);
};

export const HideParentOnDrag = HideParentTemplate.bind({});
HideParentOnDrag.args = {
	...Default.args,
};
