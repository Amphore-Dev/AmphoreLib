import React, { useState } from "react";

import { sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { makeSampleImageFile } from "../DocumentPreview/sampleImageFile";

import { IInputFileProps, InputFile } from "./InputFile";

export default {
	title: "Components/Atoms/InputFile",
	component: InputFile,
	argTypes: {
		size: sizeArgType,
		orientation: { control: "radio", options: ["vertical", "horizontal"] },
		placeholder: { control: "text" },
		removeFileLabel: { control: "text" },
		accept: { control: "text" },
		maxFileSize: { control: "number" },
		isRemovable: { control: { type: "boolean" } },
		disabled: { control: { type: "boolean" } },
		required: { control: { type: "boolean" } },
		error: { control: "text" },
		hideError: { control: { type: "boolean" } },
		id: { control: "text" },
		name: { control: "text" },
		// The Template drives value/onChange itself; no control for callbacks.
		value: { control: false },
		onChange: { control: false },
		customPreview: { control: false },
		onFileTypeError: { control: false },
		onMaxSizeError: { control: false },
	},
};

const Template: StoryFn<IInputFileProps> = (args) => {
	const [file, setFile] = useState<File | null>(args.value ?? null);
	return (
		<div style={{ width: 400 }}>
			<InputFile {...args} value={file} onChange={setFile} />
		</div>
	);
};

export const Default = Template.bind({});
Default.args = {};

export const Large = Template.bind({});
Large.args = { size: "lg", placeholder: "Drag a file here" };

export const Medium = Template.bind({});
Medium.args = { size: "md" };

export const Small = Template.bind({});
Small.args = { size: "sm" };

export const WithAcceptedFormats = Template.bind({});
WithAcceptedFormats.args = {
	accept: ".pdf,image/*",
	maxFileSize: 5000,
	placeholder: "PDF or image, 5 MB max",
};

export const Disabled = Template.bind({});
Disabled.args = { disabled: true };

export const WithError = Template.bind({});
WithError.args = { error: "File required", required: true };

export const Prefilled = Template.bind({});
Prefilled.args = {
	value: makeSampleImageFile("photo.jpg"),
};

export const NotRemovable = Template.bind({});
NotRemovable.args = {
	value: new File(["fake-pdf-bytes"], "contrat.pdf", {
		type: "application/pdf",
	}),
	isRemovable: false,
};

export const CustomPreview = Template.bind({});
CustomPreview.args = {
	value: new File(["fake-image-bytes"], "avatar.png", { type: "image/png" }),
	customPreview: (file) => (
		<div style={{ padding: 8, textAlign: "center" }}>📄 {file.name}</div>
	),
};

export const HorizontalEmpty = Template.bind({});
HorizontalEmpty.args = { orientation: "horizontal" };

export const HorizontalPrefilled = Template.bind({});
HorizontalPrefilled.args = {
	orientation: "horizontal",
	value: makeSampleImageFile("mountain-view.jpg"),
};

export const HorizontalSizes: StoryFn<IInputFileProps> = (args) => {
	const file = makeSampleImageFile("photo.jpg");
	const [small, setSmall] = useState<File | null>(file);
	const [medium, setMedium] = useState<File | null>(file);
	const [large, setLarge] = useState<File | null>(file);
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: 12,
				width: 260,
			}}
		>
			<InputFile
				{...args}
				orientation="horizontal"
				size="sm"
				value={small}
				onChange={setSmall}
			/>
			<InputFile
				{...args}
				orientation="horizontal"
				size="md"
				value={medium}
				onChange={setMedium}
			/>
			<InputFile
				{...args}
				orientation="horizontal"
				size="lg"
				value={large}
				onChange={setLarge}
			/>
		</div>
	);
};

// Regression: the empty-state thumbnail used to ignore `size` entirely
// (a flat 2.5rem regardless), and the filled row was taller than the
// empty one at "md" (2.75rem thumbnail + padding > empty's 2.5rem) — each
// row here should be the exact same height, filled or not, for its size.
export const HorizontalEmptyVsFilledBySize: StoryFn<IInputFileProps> = (
	args
) => {
	const file = makeSampleImageFile("photo.jpg");
	const [smEmpty, setSmEmpty] = useState<File | null>(null);
	const [smFilled, setSmFilled] = useState<File | null>(file);
	const [mdEmpty, setMdEmpty] = useState<File | null>(null);
	const [mdFilled, setMdFilled] = useState<File | null>(file);
	const [lgEmpty, setLgEmpty] = useState<File | null>(null);
	const [lgFilled, setLgFilled] = useState<File | null>(file);
	const row = (size: "sm" | "md" | "lg") => (
		<div style={{ display: "flex", gap: 12 }}>
			<div style={{ width: 220 }}>
				<InputFile
					{...args}
					orientation="horizontal"
					size={size}
					value={
						size === "sm"
							? smEmpty
							: size === "md"
								? mdEmpty
								: lgEmpty
					}
					onChange={
						size === "sm"
							? setSmEmpty
							: size === "md"
								? setMdEmpty
								: setLgEmpty
					}
				/>
			</div>
			<div style={{ width: 220 }}>
				<InputFile
					{...args}
					orientation="horizontal"
					size={size}
					value={
						size === "sm"
							? smFilled
							: size === "md"
								? mdFilled
								: lgFilled
					}
					onChange={
						size === "sm"
							? setSmFilled
							: size === "md"
								? setMdFilled
								: setLgFilled
					}
				/>
			</div>
		</div>
	);
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
			<div
				style={{ display: "flex", gap: 12, fontSize: 12, opacity: 0.6 }}
			>
				<span style={{ width: 220 }}>empty</span>
				<span style={{ width: 220 }}>filled</span>
			</div>
			{row("sm")}
			{row("md")}
			{row("lg")}
		</div>
	);
};

/** No `size` prop anywhere below — both rows read it from config.defaults.size instead. */
export const DefaultSizeFromConfig = () => {
	const file = makeSampleImageFile("photo.jpg");
	const [smVal, setSmVal] = useState<File | null>(file);
	const [lgVal, setLgVal] = useState<File | null>(file);
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
			<AmphoreProvider config={{ defaults: { size: "sm" } }}>
				<div style={{ width: 200 }}>
					<InputFile
						orientation="horizontal"
						value={smVal}
						onChange={setSmVal}
					/>
				</div>
			</AmphoreProvider>
			<AmphoreProvider config={{ defaults: { size: "lg" } }}>
				<div style={{ width: 200 }}>
					<InputFile
						orientation="horizontal"
						value={lgVal}
						onChange={setLgVal}
					/>
				</div>
			</AmphoreProvider>
		</div>
	);
};
