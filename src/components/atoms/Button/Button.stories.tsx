import React from "react";

import { colorArgType, pictoArgType, sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { Button, IButtonProps } from "./Button";

export default {
	title: "Components/Atoms/Button",
	component: Button,
	argTypes: {
		color: colorArgType,
		variant: {
			control: "radio",
			options: ["solid", "outline", "ghost", "link"],
		},
		size: sizeArgType,
		disabled: { control: { type: "boolean" } },
		isLoading: { control: { type: "boolean" } },
		picto: pictoArgType,
		children: { control: { type: "text" } },
	},
	parameters: {
		controls: {
			include: [
				"color",
				"variant",
				"size",
				"disabled",
				"isLoading",
				"picto",
				"children",
			],
		},
	},
};

const Template: StoryFn<IButtonProps> = (args) => (
	<div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
		<Button {...args} size="sm" />
		<Button {...args} size="md" />
		<Button {...args} size="lg" />
	</div>
);

export const Base = Template.bind({});
Base.args = {
	children: "Button",
	color: "primary",
	variant: "solid",
	disabled: false,
	isLoading: false,
};

const COLORS = [
	"primary",
	"danger",
	"success",
	"warning",
	"info",
	"neutral",
	"black",
	"white",
] as const;

/** Every color works with every variant — orthogonal props, not a combinatorial enum. */
export const ColorByVariant = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
		{(["solid", "outline", "ghost", "link"] as const).map((variant) => (
			<div
				key={variant}
				style={{
					display: "flex",
					gap: "0.75rem",
					alignItems: "center",
				}}
			>
				<span style={{ width: 64, fontSize: 12, opacity: 0.6 }}>
					{variant}
				</span>
				{COLORS.map((color) => (
					<Button key={color} color={color} variant={variant}>
						{color}
					</Button>
				))}
			</div>
		))}
	</div>
);

export const Loading = () => (
	<div style={{ display: "flex", gap: "1rem" }}>
		<Button color="primary" isLoading>
			Saving...
		</Button>
		<Button color="danger" variant="outline" isLoading>
			Deleting...
		</Button>
	</div>
);

export const WithPicto = () => (
	<div style={{ display: "flex", gap: "1rem" }}>
		<Button picto="search">Search</Button>
		<Button picto="search" variant="outline" color="danger">
			Search
		</Button>
	</div>
);

/**
 * Plain, with a leading picto, and loading (spinner in the picto's place)
 * all render at the exact same height per size — an explicit line-height
 * (not "normal") governs the row height regardless of which of the three
 * is present.
 */
export const NoHeightChange = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
		{(["sm", "md", "lg"] as const).map((size) => (
			<div
				key={size}
				style={{
					display: "flex",
					gap: "0.75rem",
					alignItems: "center",
				}}
			>
				<span style={{ width: 40, fontSize: 12, opacity: 0.6 }}>
					{size}
				</span>
				<Button size={size}>No picto</Button>
				<Button size={size} picto="search">
					With picto
				</Button>
				<Button size={size} isLoading>
					Loading
				</Button>
			</div>
		))}
	</div>
);

export const Disabled = () => (
	<div style={{ display: "flex", gap: "1rem" }}>
		<Button color="primary" disabled>
			Unavailable
		</Button>
		<Button color="danger" variant="outline" disabled>
			Unavailable
		</Button>
	</div>
);

/** No `size` prop anywhere below — both rows read it from config.defaults.size instead. */
export const DefaultSizeFromConfig = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
		<AmphoreProvider config={{ defaults: { size: "sm" } }}>
			<div
				style={{
					display: "flex",
					gap: "0.75rem",
					alignItems: "center",
				}}
			>
				<span style={{ width: 110, fontSize: 12, opacity: 0.6 }}>
					defaults.size: sm
				</span>
				<Button>No size</Button>
				<Button>No size</Button>
			</div>
		</AmphoreProvider>
		<AmphoreProvider config={{ defaults: { size: "lg" } }}>
			<div
				style={{
					display: "flex",
					gap: "0.75rem",
					alignItems: "center",
				}}
			>
				<span style={{ width: 110, fontSize: 12, opacity: 0.6 }}>
					defaults.size: lg
				</span>
				<Button>No size</Button>
				{/* An explicit size prop still wins over the config default. */}
				<Button size="sm">size=&quot;sm&quot; explicit</Button>
			</div>
		</AmphoreProvider>
	</div>
);

export const ThemedVariants = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
		<AmphoreProvider
			config={{ style: "sharp", colors: { primary: "#141414" } }}
		>
			<div style={{ display: "flex", gap: "0.75rem" }}>
				<Button variant="solid">Sharp</Button>
				<Button variant="outline">Sharp outline</Button>
			</div>
		</AmphoreProvider>
		<AmphoreProvider
			config={{ style: "round", colors: { primary: "#e2673f" } }}
		>
			<div style={{ display: "flex", gap: "0.75rem" }}>
				<Button variant="solid">Round</Button>
				<Button variant="outline">Round outline</Button>
			</div>
		</AmphoreProvider>
	</div>
);
