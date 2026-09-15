import React, { useState } from "react";

import { colorArgType, sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { ITextAreaProps, TextArea } from "./TextArea";

export default {
	title: "Components/Atoms/TextArea",
	component: TextArea,
	argTypes: {
		size: sizeArgType,
		color: colorArgType,
		rows: { control: { type: "number" } },
		maxLength: { control: { type: "number" } },
		disabled: { control: { type: "boolean" } },
		required: { control: { type: "boolean" } },
		showCharCounter: { control: { type: "boolean" } },
		resizable: { control: { type: "boolean" } },
		autoGrow: { control: { type: "boolean" } },
		maxRows: { control: { type: "number" } },
	},
};

const Template: StoryFn<ITextAreaProps> = (args) => {
	const [value, setValue] = useState(args.value ?? "");
	return <TextArea {...args} value={value} onChange={setValue} />;
};

export const Base = Template.bind({});
Base.args = {
	label: "Description",
	placeholder: "Describe the task...",
};

export const WithError = Template.bind({});
WithError.args = {
	label: "Comment",
	value: "A comment that's too short",
	error: "Minimum 50 characters",
};

export const CharCounter = Template.bind({});
CharCounter.args = {
	label: "Bio",
	value: "Jane Doe, craftsperson since 1987.",
	maxLength: 160,
	showCharCounter: true,
};

export const AutoGrow = Template.bind({});
AutoGrow.args = {
	label: "Description",
	value: "This field grows automatically with the content.",
	autoGrow: true,
	placeholder: "Type several lines to see the field grow...",
};

export const AutoGrowMaxRows = Template.bind({});
AutoGrowMaxRows.args = {
	label: "Description",
	value: "Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6",
	autoGrow: true,
	maxRows: 4,
};

export const Sizes = () => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			gap: "1rem",
			maxWidth: 320,
		}}
	>
		<TextArea
			label="Small"
			size="sm"
			value=""
			onChange={() => {}}
			rows={2}
		/>
		<TextArea
			label="Medium"
			size="md"
			value=""
			onChange={() => {}}
			rows={2}
		/>
		<TextArea
			label="Large"
			size="lg"
			value=""
			onChange={() => {}}
			rows={2}
		/>
	</div>
);

export const Disabled = () => (
	<TextArea
		label="Description"
		value="Locked"
		onChange={() => {}}
		disabled
	/>
);

export const DefaultSizeFromConfig = () => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			gap: "1rem",
			maxWidth: 320,
		}}
	>
		<AmphoreProvider config={{ defaults: { size: "sm" } }}>
			<TextArea
				label="defaults.size: sm (no size)"
				value=""
				onChange={() => {}}
				rows={2}
			/>
		</AmphoreProvider>
		<AmphoreProvider config={{ defaults: { size: "lg" } }}>
			<TextArea
				label="defaults.size: lg (no size)"
				value=""
				onChange={() => {}}
				rows={2}
			/>
			{/* An explicit size prop still wins over the config default. */}
			<TextArea
				label='defaults.size: lg, size="sm" explicit'
				size="sm"
				value=""
				onChange={() => {}}
				rows={2}
			/>
		</AmphoreProvider>
	</div>
);
