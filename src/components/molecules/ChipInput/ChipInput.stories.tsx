import React, { useState } from "react";

import { colorArgType, sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { ChipInput, IChipInputProps } from "./ChipInput";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
	title: "Components/Molecules/ChipInput",
	component: ChipInput,
	argTypes: {
		size: sizeArgType,
		color: colorArgType,
		maxCount: { control: { type: "number" } },
		showCounter: { control: { type: "boolean" } },
		allowDuplicates: { control: { type: "boolean" } },
		addOnBlur: { control: { type: "boolean" } },
		rejectInvalid: { control: { type: "boolean" } },
		disabled: { control: { type: "boolean" } },
		required: { control: { type: "boolean" } },
	},
};

const Template: StoryFn<IChipInputProps> = (args) => {
	const [value, setValue] = useState(args.value ?? []);
	return (
		<div style={{ maxWidth: 480 }}>
			<ChipInput {...args} value={value} onChange={setValue} />
		</div>
	);
};

export const Base = Template.bind({});
Base.args = {
	label: "Tags",
	placeholder: "Type, then Enter, a comma or a space",
	value: ["design", "frontend"],
};

export const Emails = Template.bind({});
Emails.args = {
	label: "Invoice emails (6 max)",
	placeholder: "Paste a list, or type one then Enter",
	value: ["martin.dupont@example.com", "not-an-email"],
	maxCount: 6,
	validate: (value: string) => EMAIL.test(value),
};

export const RejectInvalid = Template.bind({});
RejectInvalid.args = {
	label: "Invoice emails",
	placeholder: "An invalid one stays in the field",
	validate: (value: string) => EMAIL.test(value),
	rejectInvalid: true,
};

export const TicketKeys = Template.bind({});
TicketKeys.args = {
	label: "Ticket prefixes",
	placeholder: "CHR, T4",
	value: ["CHR"],
	normalize: (value: string) => value.toUpperCase(),
	validate: (value: string) => /^[A-Z][A-Z0-9_]*$/.test(value),
	rejectInvalid: true,
};

export const CustomSeparators = Template.bind({});
CustomSeparators.args = {
	label: "Attendees (semicolon-separated)",
	placeholder: "Jean Dupont; Marie Curie",
	separators: /;/,
	value: ["Jean Dupont"],
};

export const WithError = Template.bind({});
WithError.args = {
	label: "Tags",
	error: "At least one tag",
};

export const Disabled = Template.bind({});
Disabled.args = {
	label: "Tags",
	value: ["design", "frontend"],
	disabled: true,
};

export const DefaultSizeFromConfig = () => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			gap: "1rem",
			maxWidth: 480,
		}}
	>
		<AmphoreProvider config={{ defaults: { size: "sm" } }}>
			<ChipInput label="defaults.size: sm (no size)" value={["alpha"]} />
		</AmphoreProvider>
		<AmphoreProvider config={{ defaults: { size: "sm" } }}>
			<ChipInput
				label="defaults.size: sm, size='lg' wins"
				size="lg"
				value={["alpha"]}
			/>
		</AmphoreProvider>
	</div>
);
