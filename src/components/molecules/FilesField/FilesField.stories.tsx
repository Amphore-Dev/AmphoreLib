import React, { useState } from "react";

import { sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { makeSampleImageFile } from "@components/atoms/DocumentPreview/sampleImageFile";

import { FilesField, IFilesFieldProps } from "./FilesField";

export default {
	title: "Components/Molecules/FilesField",
	component: FilesField,
	argTypes: {
		name: { control: "text" },
		maxFiles: { control: "number" },
		orientation: { control: "radio", options: ["vertical", "horizontal"] },
		size: sizeArgType,
		placeholder: { control: "text" },
		accept: { control: "text" },
		maxFileSize: { control: "number" },
		isRemovable: { control: { type: "boolean" } },
		disabled: { control: { type: "boolean" } },
		required: { control: { type: "boolean" } },
		error: { control: "text" },
		hideError: { control: { type: "boolean" } },
		columns: { control: "number" },
		minItemWidth: { control: "text" },
		gap: { control: "text" },
		// The Template drives value/onChange itself; no control for callbacks.
		value: { control: false },
		onChange: { control: false },
		customPreview: { control: false },
		onFileTypeError: { control: false },
		onMaxSizeError: { control: false },
	},
};

const Template: StoryFn<IFilesFieldProps> = (args) => {
	const [files, setFiles] = useState<(File | null)[]>(args.value ?? []);
	return <FilesField {...args} value={files} onChange={setFiles} />;
};

export const SingleFile = Template.bind({});
SingleFile.args = { name: "document" };

export const MultipleFilesHorizontal = Template.bind({});
MultipleFilesHorizontal.args = {
	name: "photos",
	maxFiles: 3,
	orientation: "horizontal",
};

export const MultipleFilesVertical = Template.bind({});
MultipleFilesVertical.args = {
	name: "documents",
	maxFiles: 3,
	orientation: "vertical",
};

export const Prefilled = Template.bind({});
Prefilled.args = {
	name: "photos",
	maxFiles: 2,
	orientation: "horizontal",
	value: [
		makeSampleImageFile("photo1.jpg"),
		makeSampleImageFile("photo2.jpg"),
	],
};
