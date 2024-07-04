import React, { useEffect, useState } from "react";

import { StoryFn } from "@storybook/react";

import { IModalHeaderProps, IModalProps, Modal } from "./Modal";
import { Button, LoremIpsum, Picto } from "@components/atoms";

export default {
	title: "Components/Atoms/Modal",
	component: Modal,
	argTypes: {
		closeOnClickOutside: {
			control: {
				type: "boolean",
			},
		},
		size: {
			options: ["s", "m", "l", "auto"],
			control: "radio",
		},
	},
};

const Template: StoryFn<IModalProps> = (props) => {
	const [isDisplayed, setIsDisplayed] = useState(false);

	useEffect(() => {
		setIsDisplayed(props.isDisplayed);
	}, [props.isDisplayed]);

	return (
		<>
			<Button onClick={() => setIsDisplayed(true)}>Open modal</Button>
			<Modal
				{...props}
				isDisplayed={isDisplayed}
				onClose={() => setIsDisplayed(false)}
			>
				{props.children ?? <LoremIpsum />}
			</Modal>
		</>
	);
};

export const Base: any = Template.bind({});

Base.args = {
	title: "Modal",
	isDisplayed: false,
	closeOnClickOutside: true,
	className: "",
};

export const FullHeight: StoryFn = (props) => {
	return (
		<Base {...props} title="Fullheight modal">
			<LoremIpsum units="paragraphs" count={15} />
		</Base>
	);
};

export const CustomTitle: StoryFn = (props) => {
	return (
		<Base
			{...props}
			title={(props: IModalHeaderProps) => {
				const { onClose } = props;
				return (
					<div className="flex flex-wrap gap-2">
						<button onClick={onClose} className="flex items-center">
							<Picto
								icon="chevron"
								className="w-6 -ml-2 rotate-180"
							/>
						</button>
						<h2 className="text-lg font-semibold">
							Custom title with back button
						</h2>
					</div>
				);
			}}
		>
			<LoremIpsum units="paragraphs" count={15} />
		</Base>
	);
};

export const CustomHeader: StoryFn = (props) => {
	return (
		<Base
			{...props}
			title="Custom header modal"
			header={(props: IModalHeaderProps) => {
				const { onClose, title } = props;
				return (
					<div className="flex justify-between items-center w-full">
						<button onClick={onClose} className="flex items-center">
							<Picto
								icon="chevron"
								className="w-6 -ml-2 rotate-180"
							/>
							Back
						</button>
						{typeof title === "string" ? (
							<h2 className="text-lg font-semibold text-neutral-400">
								{title}
							</h2>
						) : (
							title(props)
						)}
					</div>
				);
			}}
		>
			<LoremIpsum units="paragraphs" count={15} />
		</Base>
	);
};
