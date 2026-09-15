import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import {
	IPeriodFilterProps,
	PeriodFilter,
	TPeriodRangeType,
} from "./PeriodFilter";

export default {
	title: "Components/Molecules/PeriodFilter",
	component: PeriodFilter,
	argTypes: {
		showPresets: { control: { type: "boolean" } },
		disabled: { control: { type: "boolean" } },
		// The Template drives from/to/onChange/range/presets itself.
		from: { control: false },
		to: { control: false },
		onChange: { control: false },
		presets: { control: false },
		range: { control: false },
	},
	parameters: {
		docs: {
			description: {
				component: `
Manages a period made of a \`from\`/\`to\` pair (\`Date | null\`, via \`DatePicker\`), with quick presets and an optional range-type selector.

**\`onChange\` priority** — for each side (\`from\`/\`to\`), in this order:
1. \`from.onChange\` / \`to.onChange\` (side-specific)
2. otherwise \`onChange(fieldName, value)\` (shared)

Clicking a preset calls this same resolution for \`from\` and \`to\` separately — a custom \`from.onChange\` therefore doesn't stop \`to\` from following the shared \`onChange\`.

**Preset activation** — a preset button is active ("solid") when \`from\`/\`to\` exactly match (via \`date-fns\`'s \`isSameDay\`) the period it would compute. \`presets\` (an array of \`TPeriodPreset\`) replaces the default list (\`["thisWeek", "thisMonth", "lastMonth"]\`) — \`showPresets={false}\` hides the row entirely.

**Range-type selector (\`range\`)** — optional, only appears when the \`range\` prop is given (\`{ value, onChange }\`): \`"between"\` / \`"starting"\` / \`"ending"\`, rendered via \`RadioFilter\`. Unlike the previous version, this is no longer a plain Formik field name — the component no longer reads from or writes to any ambient Formik context, everything goes through props.
				`,
			},
		},
	},
};

const Template: StoryFn<IPeriodFilterProps> = (args) => {
	const [from, setFrom] = useState<Date | null>(null);
	const [to, setTo] = useState<Date | null>(null);
	return (
		<PeriodFilter
			{...args}
			from={{ value: from }}
			to={{ value: to }}
			onChange={(field, value) =>
				field === "from" ? setFrom(value) : setTo(value)
			}
		/>
	);
};

export const Default = Template.bind({});
Default.args = {};

export const WithRangeType: StoryFn<IPeriodFilterProps> = (args) => {
	const [from, setFrom] = useState<Date | null>(null);
	const [to, setTo] = useState<Date | null>(null);
	const [rangeType, setRangeType] = useState<TPeriodRangeType | null>(
		"between"
	);
	return (
		<PeriodFilter
			{...args}
			from={{ value: from }}
			to={{ value: to }}
			onChange={(field, value) =>
				field === "from" ? setFrom(value) : setTo(value)
			}
			range={{ value: rangeType, onChange: setRangeType }}
		/>
	);
};

export const Disabled = Template.bind({});
Disabled.args = { disabled: true };

export const WithoutPresets = Template.bind({});
WithoutPresets.args = { showPresets: false };

export const CustomPresets = Template.bind({});
CustomPresets.args = { presets: ["thisMonth", "thisYear"] };

export const Prefilled: StoryFn<IPeriodFilterProps> = (args) => {
	const now = new Date();
	const [from, setFrom] = useState<Date | null>(
		new Date(now.getFullYear(), now.getMonth(), 1)
	);
	const [to, setTo] = useState<Date | null>(
		new Date(now.getFullYear(), now.getMonth() + 1, 0)
	);
	return (
		<PeriodFilter
			{...args}
			from={{ value: from }}
			to={{ value: to }}
			onChange={(field, value) =>
				field === "from" ? setFrom(value) : setTo(value)
			}
		/>
	);
};
