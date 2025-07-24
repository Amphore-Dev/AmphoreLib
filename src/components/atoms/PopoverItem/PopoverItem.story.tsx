import React from "react";

import { Meta, StoryFn } from "@storybook/react";

import { PopoverItem, PopoverItemProps } from "./PopoverItem";

const meta: Meta<typeof PopoverItem> = {
	title: "Components/Atoms/PopoverItem",
	component: PopoverItem,
	args: {
		icon: "check", // adapter selon les noms d'icône valides dans ton composant Picto
		rtl: false,
	},
	argTypes: {
		onClick: { action: "clicked" },
		icon: {
			control: "text",
			description: "Nom de l’icône (propagée à Picto)",
		},
		rtl: {
			control: "boolean",
			description: "Affiche l’icône et le texte à droite",
		},
		children: {
			control: "text",
		},
	},
};

export default meta;

const Template: StoryFn<PopoverItemProps> = (args) => <PopoverItem {...args} />;

export const Default = Template.bind({});
Default.args = {
	children: "Nouvel élément",
	icon: "edit",
};

export const WithoutIcon = Template.bind({});
WithoutIcon.args = {
	children: "Sans icône",
};

export const Reversed = Template.bind({});
Reversed.args = {
	children: "Icône à droite",
	icon: "chevron",
	rtl: true,
};

export const ReactNodeChildren = Template.bind({});
ReactNodeChildren.args = {
	children: (
		<>
			<span>Texte avec </span>
			<strong>élément React</strong>
		</>
	),
	icon: "info",
	rtl: false,
};

export const ReactNodeUndefChildren = Template.bind({});
ReactNodeChildren.args = {
	children: undefined,
	icon: "info",
	rtl: false,
};
