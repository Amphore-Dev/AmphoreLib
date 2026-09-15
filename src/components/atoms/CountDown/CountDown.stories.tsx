import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { CountDown, ICountDownProps } from "./CountDown";

export default {
	title: "Components/Atoms/CountDown",
	component: CountDown,
	argTypes: {
		seconds: { control: "number" },
	},
};

const Template: StoryFn<ICountDownProps> = (args) => (
	<CountDown {...args} onEnd={() => alert("Done!")} />
);

export const Base = Template.bind({});
Base.args = { seconds: 10 };

export const CustomTemplate = Template.bind({});
CustomTemplate.args = { seconds: 10, text: "Resend available in {time}s" };

export const FunctionTemplate = Template.bind({});
FunctionTemplate.args = {
	seconds: 5,
	text: (n: number) => (n > 1 ? `${n} seconds left` : "Almost done…"),
};

export const RestartableExample = () => {
	const [key, setKey] = useState(0);
	return (
		<div
			style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
		>
			<CountDown key={key} seconds={5} onEnd={() => {}} />
			<button type="button" onClick={() => setKey((k) => k + 1)}>
				Restart
			</button>
		</div>
	);
};
