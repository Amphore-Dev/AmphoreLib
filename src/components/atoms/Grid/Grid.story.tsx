// stories for Grid component
import React from "react";

import { Meta, StoryObj } from "@storybook/react";

import { Grid } from "./Grid";

const meta: Meta<typeof Grid> = {
	title: "Components/Molecules/Grid",
	component: Grid,
	parameters: {
		docs: {
			description: {
				component: `
Grid est un composant de layout responsive basé sur CSS Grid.

Il permet :
- de définir un nombre de colonnes
- d'imposer une largeur minimale par item
- de gérer l'espacement entre les éléments

Le nombre de colonnes s’adapte automatiquement lorsque l’espace disponible est insuffisant.
				`,
			},
		},
	},
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const Default: Story = {
	args: {
		columns: 3,
		minItemWidth: "150px",
		gap: "1rem",
		children: (
			<>
				<div style={{ backgroundColor: "#f0f0f0", padding: "1rem" }}>
					Item 1
				</div>
				<div style={{ backgroundColor: "#f0f0f0", padding: "1rem" }}>
					Item 2
				</div>
				<div style={{ backgroundColor: "#f0f0f0", padding: "1rem" }}>
					Item 3
				</div>
				<div style={{ backgroundColor: "#f0f0f0", padding: "1rem" }}>
					Item 4
				</div>
				<div style={{ backgroundColor: "#f0f0f0", padding: "1rem" }}>
					Item 5
				</div>
			</>
		),
	},
};

export const CustomGap: Story = {
	name: "Différents gaps pour rows & columns",
	args: {
		columns: 4,
		minItemWidth: "150px",
		gap: "1rem 2rem",
		children: (
			<>
				<div style={{ backgroundColor: "#f0f0f0", padding: "1rem" }}>
					Item 1
				</div>
				<div style={{ backgroundColor: "#f0f0f0", padding: "1rem" }}>
					Item 2
				</div>
				<div style={{ backgroundColor: "#f0f0f0", padding: "1rem" }}>
					Item 3
				</div>
				<div style={{ backgroundColor: "#f0f0f0", padding: "1rem" }}>
					Item 4
				</div>
				<div style={{ backgroundColor: "#f0f0f0", padding: "1rem" }}>
					Item 5
				</div>
				<div style={{ backgroundColor: "#f0f0f0", padding: "1rem" }}>
					Item 6
				</div>
				<div style={{ backgroundColor: "#f0f0f0", padding: "1rem" }}>
					Item 7
				</div>
			</>
		),
	},
};
