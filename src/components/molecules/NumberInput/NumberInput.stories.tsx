import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { INumberInputProps, NumberInput } from "./NumberInput";

const Template: StoryFn<INumberInputProps> = (args) => {
	const [value, setValue] = useState<number | null>(null);

	return (
		<div className="flex flex-row gap-12 mr-auto">
			<NumberInput
				label="Quantité"
				{...args}
				value={value}
				onChange={(val) => setValue(val)}
			/>
		</div>
	);
};

export default {
	title: "Components/Molecules/NumberInput",
	component: NumberInput,
	argTypes: {
		label: { control: { type: "text" } },
		disabled: { control: { type: "boolean" } },
		required: { control: { type: "boolean" } },
		error: { control: { type: "text" } },
		min: { control: { type: "number" } },
		max: { control: { type: "number" } },
		maximumFractionDigits: { control: { type: "number" } },
		minimumFractionDigits: { control: { type: "number" } },
		thousandSeparator: { control: { type: "text" } },
		decimalSeparator: { control: { type: "text" } },
		prefix: { control: { type: "text" } },
		postfix: { control: { type: "text" } },
		size: { control: { type: "radio" }, options: ["s", "m"] },
	},
	parameters: {
		controls: {
			include: [
				"label",
				"disabled",
				"required",
				"error",
				"min",
				"max",
				"maximumFractionDigits",
				"minimumFractionDigits",
				"thousandSeparator",
				"decimalSeparator",
				"prefix",
				"postfix",
				"size",
				"...",
			],
		},
	},
};

export const Base = Template.bind({});
Base.args = {};

export const NoLabel = Template.bind({});
NoLabel.args = {
	label: undefined,
	size: "s",
};

export const WithThousandSeparator = Template.bind({});
WithThousandSeparator.args = {
	thousandSeparator: " ",
	maximumFractionDigits: 0,
};

export const Currency = Template.bind({});
Currency.args = {
	postfix: " €",
	maximumFractionDigits: 2,
	minimumFractionDigits: 2,
	thousandSeparator: " ",
};

export const MinMax = Template.bind({});
MinMax.args = {
	min: 0,
	max: 100,
	required: true,
};

export const Sizes: StoryFn = () => {
	const [mValue, setMValue] = useState<number | null>(null);
	const [sValue, setSValue] = useState<number | null>(null);

	return (
		<div className="flex flex-row items-start gap-8 mr-auto">
			<NumberInput
				label="Default (m)"
				size="m"
				value={mValue}
				onChange={(value) => setMValue(value)}
			/>
			<NumberInput
				label="Compact (s)"
				size="s"
				value={sValue}
				onChange={(value) => setSValue(value)}
			/>
		</div>
	);
};
