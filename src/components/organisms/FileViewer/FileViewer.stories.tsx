import React from "react";

import { makeSamplePdfFile } from "@stories/samplePdfFile";
import { StoryFn } from "@storybook/react";

import { makeSampleImageFile } from "@components/atoms/DocumentPreview/sampleImageFile";

import { FileViewer, IFileViewerProps } from "./FileViewer";

export default {
	title: "Components/Organisms/FileViewer",
	component: FileViewer,
	parameters: {
		docs: { story: { height: "420px" } },
	},
	argTypes: {
		// Storybook's "file" control always yields a `File[]` (even for a
		// single upload), never the bare `File` `FileViewer.src` expects —
		// the Template below unwraps it.
		src: { control: { type: "file", accept: "image/*,application/pdf" } },
		continuous: { control: "boolean" },
		zoomOutLabel: { control: "text" },
		zoomInLabel: { control: "text" },
		resetZoomLabel: { control: "text" },
		previousPageLabel: { control: "text" },
		nextPageLabel: { control: "text" },
		downloadLabel: { control: "text" },
		loadingLabel: { control: "text" },
		pdfErrorLabel: { control: "text" },
		unsupportedFormatLabel: { control: "text" },
		previewAltLabel: { control: "text" },
	},
};

const Template: StoryFn<IFileViewerProps> = (args) => {
	const src = Array.isArray(args.src) ? args.src[0] : args.src;
	return (
		<div
			style={{
				height: 380,
				border: "1px solid var(--amp-color-border)",
				borderRadius: "var(--amp-radius-md)",
			}}
		>
			{src && <FileViewer {...args} src={src} />}
		</div>
	);
};

export const Image = Template.bind({});
Image.args = {
	src: makeSampleImageFile("photo.jpg"),
};

export const Pdf = Template.bind({});
Pdf.args = {
	src: makeSamplePdfFile("rapport.pdf"),
};

// One page at a time, the pager swapping it — instead of the default
// stacked column.
export const PdfSinglePage = Template.bind({});
PdfSinglePage.args = {
	src: makeSamplePdfFile("rapport.pdf"),
	continuous: false,
};

export const PdfError = Template.bind({});
PdfError.args = {
	src: "https://example.com/broken.pdf",
};

// A URL source has no `File.type` to read — type is inferred from the
// extension in the path instead (see `inferType` in FileViewer.tsx).
export const FromUrl = Template.bind({});
FromUrl.args = {
	src: "https://pdfobject.com/pdf/sample.pdf",
};

export const UnsupportedFormat = Template.bind({});
UnsupportedFormat.args = {
	src: "https://example.com/archive.zip",
};
