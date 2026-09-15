import React, { useState } from "react";

import { sizeArgType } from "@stories/StoriesArgs";
import { StoryFn } from "@storybook/react";

import { AmphoreProvider } from "@theme/AmphoreProvider";

import { Accordion, IAccordionProps, TAccordionItem } from "./Accordion";

export default {
	title: "Components/Molecules/Accordion",
	component: Accordion,
	argTypes: {
		size: sizeArgType,
		multiple: { control: "boolean" },
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
		content:
			'From your account, under "My orders", within 30 days.',
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
