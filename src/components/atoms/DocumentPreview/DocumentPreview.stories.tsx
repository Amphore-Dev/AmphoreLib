import React from "react";

import { StoryFn } from "@storybook/react";

import { DocumentPreview, IDocumentPreviewProps } from "./DocumentPreview";
import { makeSampleImageFile } from "./sampleImageFile";

export default {
	title: "Components/Atoms/DocumentPreview",
	component: DocumentPreview,
	argTypes: {
		file: {
			control: "file",
		},
	},
};

const Template: StoryFn<IDocumentPreviewProps> = (args) => (
	<div style={{ width: 120, height: 120 }}>
		<DocumentPreview {...args} />
	</div>
);

export const Image = Template.bind({});
Image.args = {
	file: makeSampleImageFile("photo.jpg"),
};

export const GenericFile = Template.bind({});
GenericFile.args = {
	file: new File(["fake-pdf-bytes"], "rapport.pdf", {
		type: "application/pdf",
	}),
};
