import React, { useState } from "react";

import { colorArgType, sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { TTabItem } from "@interfaces/index";

import { ITabsProps, Tabs, TabPanel } from "./Tabs";

export default {
	title: "Components/Molecules/Tabs",
	component: Tabs,
	argTypes: {
		size: sizeArgType,
		color: colorArgType,
		scrollLeftLabel: { control: "text" },
		scrollRightLabel: { control: "text" },
	},
};

const ITEMS: TTabItem<string>[] = [
	{ value: "infos", label: "Information" },
	{ value: "billing", label: "Billing" },
	{ value: "history", label: "History", disabled: true },
	{ value: "settings", label: "Settings" },
	{ value: "extra", label: "Extra" },
	{ value: "options", label: "Options" },
	{ value: "hidden", label: "Hidden", disabled: true },
];

const Template: StoryFn<ITabsProps<string>> = (args) => {
	const [value, setValue] = useState(args.value ?? ITEMS[0].value);
	return (
		<Tabs
			{...args}
			items={args.items ?? ITEMS}
			value={value}
			onChange={setValue}
		/>
	);
};

export const Base = Template.bind({});
Base.args = { items: ITEMS, value: "infos" };

export const WithPanels = () => {
	const [value, setValue] = useState("infos");
	return (
		<div style={{ maxWidth: 480 }}>
			<Tabs items={ITEMS} value={value} onChange={setValue} />
			<TabPanel active={value === "infos"}>
				<p style={{ margin: 0 }}>
					Name, address, customer contact details.
				</p>
			</TabPanel>
			<TabPanel active={value === "billing"}>
				<p style={{ margin: 0 }}>Payment methods and invoices.</p>
			</TabPanel>
			<TabPanel active={value === "settings"}>
				<p style={{ margin: 0 }}>Notification preferences.</p>
			</TabPanel>
		</div>
	);
};

const MANY_ITEMS: TTabItem<string>[] = Array.from({ length: 12 }, (_, i) => ({
	value: `tab-${i}`,
	label: `Tab ${i + 1}`,
}));

/** Narrow container to force overflow — scroll arrows appear on the side(s) with more content, and scroll one not-fully-visible tab into view (centered) per click. */
export const ScrollableOverflow = () => {
	const [value, setValue] = useState("tab-0");
	return (
		<div style={{ maxWidth: 320 }}>
			<Tabs items={MANY_ITEMS} value={value} onChange={setValue} />
		</div>
	);
};

export const WithPicto = () => {
	const [value, setValue] = useState("infos");
	return (
		<Tabs
			value={value}
			onChange={setValue}
			items={[
				{ value: "infos", label: "Information", picto: "search" },
				{ value: "billing", label: "Billing", picto: "calendar" },
			]}
		/>
	);
};

export const Colors = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
		{(
			[
				"primary",
				"danger",
				"success",
				"warning",
				"info",
				"neutral",
				"black",
			] as const
		).map((color) => (
			<Tabs
				key={color}
				color={color}
				items={ITEMS.slice(0, 2)}
				value="infos"
				onChange={() => {}}
			/>
		))}
	</div>
);

export const Sizes = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
		<Tabs size="sm" items={ITEMS} value="infos" onChange={() => {}} />
		<Tabs size="md" items={ITEMS} value="infos" onChange={() => {}} />
		<Tabs size="lg" items={ITEMS} value="infos" onChange={() => {}} />
	</div>
);

export const DefaultSizeFromConfig = () => (
	<div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
		<AmphoreProvider config={{ defaults: { size: "sm" } }}>
			<Tabs items={ITEMS} value="infos" onChange={() => {}} />
		</AmphoreProvider>
		<AmphoreProvider config={{ defaults: { size: "lg" } }}>
			<Tabs items={ITEMS} value="infos" onChange={() => {}} />
			{/* An explicit size prop still wins over the config default. */}
			<Tabs size="sm" items={ITEMS} value="infos" onChange={() => {}} />
		</AmphoreProvider>
	</div>
);
