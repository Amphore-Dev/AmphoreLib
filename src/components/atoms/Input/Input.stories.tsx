import React, { useState } from "react";

import { colorArgType, pictoArgType, sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { Input, IInputProps } from "./Input";

export default {
	title: "Components/Atoms/Input",
	component: Input,
	argTypes: {
		size: sizeArgType,
		color: colorArgType,
		picto: pictoArgType,
		maxLength: { control: { type: "number" } },
		disabled: { control: { type: "boolean" } },
		required: { control: { type: "boolean" } },
		isClearable: { control: { type: "boolean" } },
		clearLabel: { control: "text" },
	},
};

const Template: StoryFn<IInputProps> = (args) => {
	const [value, setValue] = useState(args.value ?? "");
	return <Input {...args} value={value} onChange={setValue} />;
};

export const Base = Template.bind({});
Base.args = {
	label: "Customer name",
	placeholder: "Jane Doe",
};

export const WithError = Template.bind({});
WithError.args = {
	label: "Email",
	value: "not-an-email",
	error: "Invalid email format",
};

export const WithPicto = Template.bind({});
WithPicto.args = {
	label: "Search",
	picto: "search",
	placeholder: "Search...",
};

export const Clearable = Template.bind({});
Clearable.args = {
	label: "Search",
	picto: "search",
	value: "amphore",
	isClearable: true,
};

export const MaxLength = Template.bind({});
MaxLength.args = {
	label: "ZIP code",
	placeholder: "10001",
	maxLength: 5,
};

export const Sizes = () => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			gap: "1rem",
			maxWidth: 280,
		}}
	>
		<Input
			label="Small"
			size="sm"
			value=""
			onChange={() => {}}
			placeholder="sm"
		/>
		<Input
			label="Medium"
			size="md"
			value=""
			onChange={() => {}}
			placeholder="md"
		/>
		<Input
			label="Large"
			size="lg"
			value=""
			onChange={() => {}}
			placeholder="lg"
		/>
	</div>
);

export const DefaultSizeFromConfig = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
		<AmphoreProvider config={{ defaults: { size: "sm" } }}>
			<Input
				label="defaults.size: sm (no size)"
				value=""
				onChange={() => {}}
			/>
		</AmphoreProvider>
		<AmphoreProvider config={{ defaults: { size: "lg" } }}>
			<Input
				label="defaults.size: lg (no size)"
				value=""
				onChange={() => {}}
			/>
			{/* An explicit size prop still wins over the config default. */}
			<Input
				label='defaults.size: lg, size="sm" explicit'
				size="sm"
				value=""
				onChange={() => {}}
			/>
		</AmphoreProvider>
	</div>
);

export const Disabled = () => (
	<Input
		label="Disabled field"
		value="Locked"
		onChange={() => {}}
		disabled
	/>
);
