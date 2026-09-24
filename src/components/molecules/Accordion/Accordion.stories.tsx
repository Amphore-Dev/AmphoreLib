import React, { useState } from "react";

import { sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { Button } from "../../atoms/Button/Button";

import { Accordion, IAccordionProps, TAccordionItem } from "./Accordion";

export default {
	title: "Components/Molecules/Accordion",
	component: Accordion,
	argTypes: {
		size: sizeArgType,
		multiple: { control: "boolean" },
		chevronPosition: { control: "inline-radio", options: ["start", "end"] },
	},
};

const ITEMS: TAccordionItem<string>[] = [
	{
		value: "shipping",
		title: "What are the delivery times?",
		content: "Allow 3 to 5 business days for domestic shipping.",
	},
	{
		value: "returns",
		title: "How do I return an item?",
		content: 'From your account, under "My orders", within 30 days.',
	},
	{
		value: "payment",
		title: "What payment methods do you accept?",
		content: "Credit card, PayPal, and wire transfer for businesses.",
		disabled: true,
	},
];

const Template: StoryFn<IAccordionProps<string>> = (args) => {
	const [value, setValue] = useState<string | string[] | null>(
		args.multiple ? [] : null
	);
	return (
		<div style={{ maxWidth: 480 }}>
			<Accordion
				{...args}
				items={ITEMS}
				value={value}
				onChange={setValue}
			/>
		</div>
	);
};

export const Base = Template.bind({});
Base.args = {};

export const Multiple = Template.bind({});
Multiple.args = { multiple: true };

export const WithPicto = () => {
	const [value, setValue] = useState<string | null>(null);
	return (
		<div style={{ maxWidth: 480 }}>
			<Accordion
				value={value}
				onChange={(v) => setValue(v as string | null)}
				items={[
					{
						value: "search",
						title: "Advanced search",
						content: "Filter by date, status, or amount.",
						picto: "search",
					},
					{
						value: "calendar",
						title: "Scheduling",
						content: "Book a slot directly online.",
						picto: "calendar",
					},
				]}
			/>
		</div>
	);
};

export const Sizes = () => {
	const [values, setValues] = useState<Record<string, string | null>>({
		sm: "shipping",
		md: "shipping",
		lg: "shipping",
	});
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "1.5rem",
				maxWidth: 480,
			}}
		>
			{(["sm", "md", "lg"] as const).map((size) => (
				<Accordion
					key={size}
					size={size}
					items={ITEMS}
					value={values[size]}
					onChange={(v) =>
						setValues((prev) => ({
							...prev,
							[size]: v as string | null,
						}))
					}
				/>
			))}
		</div>
	);
};

/**
 * `content` is plain `React.ReactNode` — nesting an <Accordion> inside
 * another one's item is just passing it as content, no special API needed.
 * Each level keeps its own independent value/onChange (two separate pieces
 * of controlled state here), same as any other nested-component case.
 */
export const Nested = () => {
	const [outerValue, setOuterValue] = useState<string[]>(["general"]);
	const [innerValue, setInnerValue] = useState<string[]>([]);

	return (
		<div style={{ maxWidth: 480 }}>
			<Accordion
				value={outerValue}
				onChange={(v) => setOuterValue(v as string[])}
				items={[
					{
						value: "general",
						title: "General information",
						content: "Name, address, customer contact details.",
					},
					{
						value: "faq",
						title: "Frequently asked questions",
						content: (
							<Accordion
								size="sm"
								items={ITEMS}
								value={innerValue}
								onChange={(v) => setInnerValue(v as string[])}
							/>
						),
					},
				]}
			/>
		</div>
	);
};

export const DefaultSizeFromConfig = () => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			gap: "1.5rem",
			maxWidth: 480,
		}}
	>
		<AmphoreProvider config={{ defaults: { size: "sm" } }}>
			<Accordion items={ITEMS} value={null} onChange={() => {}} />
		</AmphoreProvider>
		<AmphoreProvider config={{ defaults: { size: "lg" } }}>
			<Accordion items={ITEMS} value={null} onChange={() => {}} />
			{/* An explicit size prop still wins over the config default. */}
			<Accordion
				size="sm"
				items={ITEMS}
				value={null}
				onChange={() => {}}
			/>
		</AmphoreProvider>
	</div>
);

export const Unique = () => {
	const [value, setValue] = useState<string | null>("a");
	return (
		<div style={{ maxWidth: 480 }}>
			<Accordion
				value={value}
				onChange={(v) => setValue(v as string | null)}
				multiple={false}
				items={[
					{
						value: "a",
						title: "Section A",
						content: "Content A",
					},
				]}
			/>
		</div>
	);
};

const CLIENTS = [
	{
		value: "acme",
		name: "Acme",
		color: "#0f9be8",
		meta: "3 projects · 76:00",
	},
	{
		value: "nord",
		name: "Studio Nord",
		color: "#c2410c",
		meta: "2 projects · 23:00",
	},
];

/** A rich, non-interactive `title` in the toggle; links/buttons in `actions`, beside it. */
export const RichTitleWithActions = () => {
	const [value, setValue] = useState<string[]>(["acme"]);
	return (
		<div style={{ maxWidth: 640 }}>
			<Accordion
				value={value}
				onChange={(v) => setValue(v as string[])}
				chevronPosition="start"
				items={CLIENTS.map((client) => ({
					value: client.value,
					ariaLabel: client.name,
					title: (
						<span
							style={{
								display: "flex",
								alignItems: "center",
								gap: 8,
							}}
						>
							<span
								style={{
									width: 10,
									height: 10,
									borderRadius: 999,
									background: client.color,
								}}
							/>
							{client.name}
							<span style={{ fontWeight: 400, opacity: 0.7 }}>
								{client.meta}
							</span>
						</span>
					),
					actions: (
						<Button size="sm" picto="add">
							Project
						</Button>
					),
					content: `${client.name}'s projects.`,
				}))}
			/>
		</div>
	);
};

export const ChevronStart = Template.bind({});
ChevronStart.args = { chevronPosition: "start" };

/** Each header row becomes an <h3> — the WAI-ARIA accordion pattern. */
export const HeadingLevel = Template.bind({});
HeadingLevel.args = { headingLevel: 3 };

const RichTitle: React.FC<{ color: string; name: string; meta: string }> = ({
	color,
	name,
	meta,
}) => (
	<span style={{ display: "flex", alignItems: "center", gap: 8 }}>
		<span
			style={{
				width: 10,
				height: 10,
				borderRadius: 999,
				background: color,
				flexShrink: 0,
			}}
		/>
		{name}
		<span style={{ fontWeight: 400, opacity: 0.7 }}>{meta}</span>
	</span>
);

const ALL_FEATURES_ITEMS: TAccordionItem<string>[] = [
	{
		value: "acme",
		picto: "folder",
		ariaLabel: "Acme",
		title: (
			<RichTitle color="#0f9be8" name="Acme" meta="3 projects · 76:00" />
		),
		actions: (
			<>
				<Button
					size="sm"
					variant="ghost"
					picto="externalLink"
					aria-label="Open Acme"
				/>
				<Button size="sm" picto="add">
					Project
				</Button>
			</>
		),
		content: "Picto + rich title + two actions (icon-only and labelled).",
	},
	{
		value: "nord",
		picto: "briefcase",
		ariaLabel: "Studio Nord",
		title: (
			<RichTitle
				color="#c2410c"
				name="Studio Nord"
				meta="2 projects · 23:00"
			/>
		),
		actions: (
			<Button size="sm" variant="outline" picto="edit">
				Edit
			</Button>
		),
		content: "Picto + rich title + one outline action.",
	},
	{
		value: "plain",
		picto: "target",
		title: "Plain string title, no actions",
		content:
			"Picto + plain title: the classic rendering, nothing beside the toggle.",
	},
	{
		value: "internal",
		title: <RichTitle color="#a3a3a3" name="Internal" meta="no picto" />,
		ariaLabel: "Internal",
		actions: (
			<Button size="sm" picto="add">
				Project
			</Button>
		),
		content: "Rich title + action, without a picto.",
	},
	{
		value: "locked",
		picto: "lock",
		ariaLabel: "Archived client",
		title: (
			<RichTitle color="#737373" name="Archived client" meta="disabled" />
		),
		actions: (
			<Button size="sm" variant="ghost" picto="settings">
				Settings
			</Button>
		),
		content: "Never shown: the item is disabled.",
		disabled: true,
	},
];

/**
 * Every item-level prop at once (picto, rich title, ariaLabel, actions,
 * disabled), chevron at the start vs. at the end, each header in an <h3>.
 */
export const AllFeatures = () => {
	const [start, setStart] = useState<string[]>(["acme"]);
	const [end, setEnd] = useState<string[]>(["acme"]);
	const column = (
		label: string,
		position: "start" | "end",
		value: string[],
		setValue: (v: string[]) => void
	) => (
		<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
			<code>
				chevronPosition="{position}" — {label}
			</code>
			<Accordion
				value={value}
				onChange={(v) => setValue(v as string[])}
				chevronPosition={position}
				headingLevel={3}
				items={ALL_FEATURES_ITEMS}
			/>
		</div>
	);
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
				gap: 32,
				maxWidth: 1280,
			}}
		>
			{column("left", "start", start, setStart)}
			{column("right", "end", end, setEnd)}
		</div>
	);
};
