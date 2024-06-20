/* story for the useModal hook */
import React from "react";

import { Meta } from "@storybook/addon-docs";
import { StoryFn } from "@storybook/react";

import { useModal } from "./useModal";
import { Button } from "@components/atoms";
import { LoremIpsum } from "@components/atoms/LoremIpsum/LoremIpsum";
import { Modal } from "@components/atoms/Modal/Modal";

export default {
	title: "Hooks/useModal",
	component: useModal,
	// parameters: {
	// 	docs: {
	// 		page: () => (
	// 			<>
	// 				<Meta title="Style Guide/Colors" />
	// 				<h1>useModal</h1>
	// 				<div className="pt-32">
	// 					<Template />
	// 				</div>
	// 			</>
	// 		),
	// 	},
	// },
};

const Template: StoryFn = (props) => {
	const { isDisplayed, toggle } = useModal();
	return (
		<>
			<Button onClick={() => toggle()}>Open modal</Button>
			<Modal
				title="Modal"
				isDisplayed={isDisplayed}
				onClose={() => {
					toggle();
				}}
				{...props}
			>
				{props.children ?? <LoremIpsum />}
			</Modal>
		</>
	);
};

export const Base: any = Template.bind({});

Base.args = {
	title: "Modal",
};
