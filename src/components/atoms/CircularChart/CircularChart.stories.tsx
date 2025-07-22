import type { Meta, StoryObj } from "@storybook/react";

import { CircularChart } from "./CircularChart";

const meta: Meta<typeof CircularChart> = {
	title: "Components/Atoms/CircularChart",
	component: CircularChart,
	tags: ["autodocs"],
	argTypes: {
		progress: {
			control: { type: "range", min: 0, max: 1.5, step: 0.01 },
		},

		value: {
			control: "text",
		},
		size: {
			control: "number",
		},
		strokeWidth: {
			control: "number",
		},
		animationDuration: {
			control: "number",
		},
	},
};

export default meta;
type Story = StoryObj<typeof CircularChart>;

export const Default: Story = {
	args: {
		progress: 0.85,
		value: "85h15",
		title: "Ce mois-ci",
		color: "#0f9be8",
		backgroundColor: "#e0f1fe",
		colors: [
			{
				color: "#0f9be8",
				backgroundColor: "#e0f1fe",
				progress: 1.5,
			},
			{
				color: "#009b00",
				backgroundColor: "#e2f7e1",
				progress: 1,
			},
			{
				color: "#f39c12",
				backgroundColor: "#ffefe0",
				progress: 0.8,
			},
			{
				color: "#e74c3c",
				backgroundColor: "#fce4e4",
				progress: 0.33,
			},
		],
	},
};
