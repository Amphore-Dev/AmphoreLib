import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { IInputSearchProps, InputSearch } from "./InputSearch";

const Template: StoryFn<IInputSearchProps> = (args) => {
	const [value, setValue] = useState<string | null>("");

	return (
		<div className="flex flex-row gap-12 mr-auto">
			<InputSearch
				label="Rechercher"
				{...args}
				value={value}
				onChange={(val) => {
					setValue(val);
					alert("onChange called");
				}}
			/>
		</div>
	);
};

export default {
	title: "Components/Molecules/InputSearch",
	component: InputSearch,
	argTypes: {
		label: {
			control: {
				type: "text",
			},
		},
		delay: {
			control: {
				type: "number",
			},
		},
		debounced: {
			control: {
				type: "boolean",
			},
		},
		minLength: {
			control: {
				type: "number",
			},
		},
		disabled: {
			control: {
				type: "boolean",
			},
		},
		wrapperClassName: {
			control: {
				type: "text",
			},
		},
		className: {
			control: {
				type: "text",
			},
		},
		hasDefaultBorder: {
			control: {
				type: "boolean",
			},
		},
	},
	parameters: {
		controls: {
			include: [
				"label",
				"delay",
				"disabled",
				"debounced",
				"minLength",
				"hasDefaultBorder",
				"...",
			],
		},
	},
};

export const Base = Template.bind({});

Base.args = {};

export const HasDefaultBorder = Template.bind({});

HasDefaultBorder.args = {
	hasDefaultBorder: true,
};

export const Disabled = {
	args: {
		label: "Disabled",
		disabled: true,
		wrapperClassName: "flex flex-col mr-auto",
	},
	decorators: [
		(Story: StoryFn) => (
			<div className="flex flex-col mr-auto">
				<Story />
			</div>
		),
	],
};
