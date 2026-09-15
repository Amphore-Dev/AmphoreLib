import React, { useState } from "react";

import { colorArgType, pictoArgType, sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { Badge, IBadgeProps } from "./Badge";

export default {
	title: "Components/Atoms/Badge",
	component: Badge,
	argTypes: {
		size: sizeArgType,
		variant: { control: "radio", options: ["solid", "outline", "tint"] },
		color: colorArgType,
		picto: pictoArgType,
		pill: { control: "boolean" },
		// onRemove isn't itself controllable (a function) — this toggle wires/
		// unwires a no-op handler so Controls can still demo the remove button.
		removable: { control: "boolean" },
		onRemove: { table: { disable: true } },
	},
};

type TBadgeStoryArgs = IBadgeProps & { removable?: boolean };

const Template: StoryFn<TBadgeStoryArgs> = ({ removable, ...args }) => (
	<Badge {...args} onRemove={removable ? () => {} : undefined} />
);

export const Base = Template.bind({});
Base.args = { children: "Badge" };

export const ColorByVariant = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
		{(["solid", "outline", "tint"] as const).map((variant) => (
			<div
				key={variant}
				style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
			>
				<span style={{ width: 70, fontSize: 12, opacity: 0.6 }}>
					{variant}
				</span>
				{(
					[
						"primary",
						"danger",
						"success",
						"warning",
						"info",
						"neutral",
						"black",
						"white",
					] as const
				).map((color) => (
					<Badge key={color} color={color} variant={variant}>
						{color}
					</Badge>
				))}
			</div>
		))}
	</div>
);

export const WithPicto = Template.bind({});
WithPicto.args = { children: "Confirmed", picto: "check", color: "success" };

export const Removable = () => {
	const [tags, setTags] = useState(["React", "TypeScript", "Vite"]);
	return (
		<div style={{ display: "flex", gap: "0.5rem" }}>
			{tags.map((tag) => (
				<Badge
					key={tag}
					variant="tint"
					onRemove={() => setTags((t) => t.filter((x) => x !== tag))}
					removeLabel={`Remove ${tag}`}
				>
					{tag}
				</Badge>
			))}
		</div>
	);
};

export const Shape = () => (
	<div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
		<Badge>Follows the theme radius</Badge>
		<Badge pill>Always a capsule (pill)</Badge>
	</div>
);

export const Sizes = () => (
	<div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
		<Badge size="sm">Small</Badge>
		<Badge size="md">Medium</Badge>
		<Badge size="lg">Large</Badge>
	</div>
);

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
				<Badge>No size</Badge>
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
				<Badge>No size</Badge>
				{/* An explicit size prop still wins over the config default. */}
				<Badge size="sm">size=&quot;sm&quot; explicit</Badge>
			</div>
		</AmphoreProvider>
	</div>
);

export const Pill = () => (
	<div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
		<Badge pill>Pill Badge</Badge>
		<Badge>Regular Badge</Badge>
	</div>
);
