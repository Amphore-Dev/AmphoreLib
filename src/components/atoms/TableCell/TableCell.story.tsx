import React from "react";

import { Pictos } from "@constants/CPictos";
import { StoryFn, StoryObj } from "@storybook/react";

import { TTableItemAction } from "@interfaces/TTable";

import { ITableCellProps, TableCell } from "./TableCell";

export default {
	title: "Components/Atoms/TableCell",
	component: TableCell,
	argTypes: {
		size: {
			control: "select",
			options: [
				"1",
				"2",
				"3",
				"4",
				"5",
				"6",
				"7",
				"8",
				"9",
				"10",
				"11",
				"12",
			],
		},
		value: {
			control: "text",
		},
		description: {
			control: "text",
		},
		badge: {
			control: "boolean",
		},
		itemActions: {
			control: "boolean",
		},
		onClick: {
			control: "boolean",
		},
		onSelect: {
			control: "boolean",
		},
		selectable: {
			control: "boolean",
		},
		button: {
			control: "boolean",
		},
		render: {
			control: "function",
		},
		picto: {
			options: Object.keys(Pictos),
		},
	},
	args: {
		onSelect: false,
		selectable: true,
		onClick: false,
	},
};

type TTableCellPropsStory<T = unknown> = Omit<
	ITableCellProps<T>,
	"onSelect"
> & {
	onSelect?: false | (() => void);
};

type TTableCellStory = StoryObj<TTableCellPropsStory<unknown>>;

const Template: StoryFn<TTableCellPropsStory<unknown>> = (args) => {
	return (
		<table className="w-full table-fixed">
			<tr className="h-[60px]">
				<TableCell
					{...args}
					onSelect={
						args.onSelect
							? (selected) =>
									console.warn(
										selected ? "Selected" : "unselected"
									)
							: undefined
					}
					onClick={
						args.onClick ? () => alert("Cell Clicked") : undefined
					}
					button={
						args.button
							? {
									label: "Button",
									onClick: () => alert("Button clicked"),
								}
							: undefined
					}
					badge={args.badge ? "Badge" : undefined}
					itemActions={
						args.itemActions ? STORY_ITEM_ACTIONS : undefined
					}
				/>
			</tr>
		</table>
	);
};

const STORY_ITEM_ACTIONS: TTableItemAction<unknown>[] = [
	{
		label: "Add to list",
		icon: "plus",
		onClick: () => alert("Action 1"),
		disabled: false,
	},
	{
		label: "Edit",
		icon: "edit",
		onClick: () => alert("Action 2"),
		disabled: false,
	},
	{
		label: "Delete",
		icon: "trash",
		onClick: () => alert("Action 2"),
		disabled: false,
	},
	{
		label: "Info",
		icon: "alertCircle",
		onClick: () => alert("Action 3"),
		disabled: true,
	},
];

export const Default: TTableCellStory = Template.bind({});
Default.storyName = "Default";
Default.args = {
	value: "Content",
	description: "Description",
	button: {
		label: "Button",
		onClick: () => alert("Button clicked"),
	},
	itemActions: STORY_ITEM_ACTIONS,
};

export const CustomRender: TTableCellStory = Template.bind({});
CustomRender.storyName = "Custom Render";
CustomRender.args = {
	render: () => (
		<div className="flex items-center gap-2">
			<img
				src="https://placeholderimage.eu/api/40/40"
				alt="Custom"
				className="rounded-md"
			/>
			<span
				style={{
					fontFamily: "comicsansms",
					background:
						"linear-gradient(to right, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff)",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",
				}}
				className="font-bold uppercase"
			>
				Custom Render pour les cas spécifiques
			</span>
		</div>
	),
};

export const WithCheckbox: TTableCellStory = Template.bind({});
WithCheckbox.storyName = "With Checkbox";
WithCheckbox.args = {
	value: "Content",
	description: "Description",
	selectable: true,
	onSelect: () => alert("Selected"),
	badge: "",
};

export const LongContent: TTableCellStory = Template.bind({});
LongContent.storyName = "Long Content";
LongContent.args = {
	value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	description:
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	onSelect: false,
};

export const WithPicto: TTableCellStory = Template.bind({});
WithPicto.storyName = "With Picto";
WithPicto.args = {
	value: "06 12 34 56 78",
	picto: "phoneOutgoing",
	className: "text-primary-500",
};

export const WithItemActions: TTableCellStory = Template.bind({});
WithItemActions.storyName = "With Item Actions";
WithItemActions.args = {
	itemActions: STORY_ITEM_ACTIONS,
};

export const WithButton: TTableCellStory = Template.bind({});
WithButton.storyName = "With Button";
WithButton.args = {
	button: {
		label: "Button",
		onClick: () => alert("Button clicked"),
	},
};

export const WithBadge: TTableCellStory = Template.bind({});
WithBadge.storyName = "With Badge";
WithBadge.args = {
	value: "Content",
	description: "Description",
	badge: "Badge",
};
