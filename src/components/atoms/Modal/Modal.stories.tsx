import React, { useEffect, useState } from "react";

import { StoryFn } from "@storybook/react";

import { Modal } from "./Modal";
import { Button, LoremIpsum } from "@components/atoms";

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

const Template: StoryFn = (props) => {
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
