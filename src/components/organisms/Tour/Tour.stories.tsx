import React, { useEffect, useState } from "react";

import { StoryFn } from "@storybook/react";

import { Button } from "../../atoms/Button/Button";
import { Card } from "../../atoms/Card/Card";

import { ITourProps, TTourStep, Tour } from "./Tour";

export default {
	title: "Components/Organisms/Tour",
	component: Tour,
	argTypes: {
		variant: { control: "select", options: ["auto", "popover", "sheet"] },
		mobileBreakpoint: { control: "number" },
		targetTimeout: { control: "number" },
		portal: { control: "boolean" },
	},
	parameters: {
		// The tour covers the viewport: the docs iframe needs room.
		docs: { story: { inline: false, height: "560px" } },
	},
};

const STEPS: TTourStep[] = [
	{
		target: {
			desktop: '[data-tour="menu"]',
			mobile: '[data-tour="navbar"]',
		},
		title: "The menu",
		content: {
			desktop:
				"Projects, views, reports and clients: everything starts here. The ≡ button folds it into icons.",
			mobile: "Projects, views and reports are one tap away, down here.",
		},
		placement: "right-start",
	},
	{
		target: '[data-tour="view"]',
		title: "Your active view",
		content:
			"A view groups projects together. One comes with the account, you can add others.",
		placement: "bottom-start",
	},
	{
		target: '[data-tour="calendar"]',
		title: "The main view",
		content:
			"Each day shows the tasks logged on it and the total hours. Click a day to open it.",
		placement: "top",
	},
	{
		target: '[data-tour="new-task"]',
		title: "Log a task",
		content: "Pick a project, a duration, a description: that's it.",
		placement: "bottom-end",
	},
];

/** A small app shell to point at — sidebar on desktop, bottom bar on mobile. */
const FakeApp: React.FC<{ children?: React.ReactNode; late?: boolean }> = ({
	children,
	late = false,
}) => {
	// `late`: the calendar only shows up after a second, like a list
	// waiting on its data.
	const [calendarShown, setCalendarShown] = useState(!late);
	useEffect(() => {
		if (!late) return;
		const t = setTimeout(() => setCalendarShown(true), 1000);
		return () => clearTimeout(t);
	}, [late]);

	return (
		<div
			style={{
				display: "flex",
				minHeight: 520,
				gap: "0.75rem",
				fontFamily: "var(--amp-font)",
				color: "var(--amp-color-ink)",
			}}
		>
			<style>{`
				.tour-demo-side { display: flex; }
				.tour-demo-nav { display: none; }
				@media (max-width: 767px) {
					.tour-demo-side { display: none; }
					.tour-demo-nav { display: flex; }
				}
			`}</style>
			<Card
				className="tour-demo-side"
				data-tour="menu"
				style={{ width: 180, flexDirection: "column", gap: "0.5rem" }}
			>
				{["Home", "Search", "Projects", "Views", "Reports"].map((l) => (
					<span key={l}>{l}</span>
				))}
			</Card>
			<div
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					gap: "0.75rem",
				}}
			>
				<div style={{ display: "flex", gap: "0.5rem" }}>
					<Button variant="outline" data-tour="view">
						All my projects
					</Button>
					<span style={{ flex: 1 }} />
					<Button picto="add" data-tour="new-task">
						New task
					</Button>
				</div>
				{calendarShown ? (
					<Card
						data-tour="calendar"
						style={{ flex: 1, minHeight: 280 }}
					>
						Calendar
					</Card>
				) : (
					<Card style={{ flex: 1, minHeight: 280 }}>Loading…</Card>
				)}
				<Card
					className="tour-demo-nav"
					data-tour="navbar"
					style={{ justifyContent: "space-around" }}
				>
					<span>Home</span>
					<span>Projects</span>
					<span>Views</span>
				</Card>
			</div>
			{children}
		</div>
	);
};

const Template: StoryFn<ITourProps & { late?: boolean }> = ({
	late,
	...args
}) => {
	const [open, setOpen] = useState(true);
	const [lastReason, setLastReason] = useState<string>();
	return (
		<FakeApp late={late}>
			{!open && (
				<div
					style={{
						position: "fixed",
						right: 16,
						bottom: 16,
						display: "flex",
						gap: "0.5rem",
						alignItems: "center",
					}}
				>
					{lastReason && <small>closed: {lastReason}</small>}
					<Button onClick={() => setOpen(true)}>
						Replay the tour
					</Button>
				</div>
			)}
			<Tour
				{...args}
				open={open}
				onClose={(reason) => {
					setLastReason(reason);
					setOpen(false);
				}}
			/>
		</FakeApp>
	);
};

/** Spotlight + bubble on desktop, sheet below 768px — resize the canvas to watch it switch mid-tour. */
export const Default = Template.bind({});
Default.args = { steps: STEPS };

export const Sheet = Template.bind({});
Sheet.args = { steps: STEPS, variant: "sheet" };

/** A first step with no target: centered, no spotlight. */
export const CenteredStep = Template.bind({});
CenteredStep.args = {
	steps: [
		{
			title: "Welcome!",
			content: "A 30-second tour of the interface. Skip it anytime.",
		},
		...STEPS,
	],
};

/** Step 3's target renders a second late — the tour waits for it. */
export const AsyncTarget = Template.bind({});
AsyncTarget.args = { steps: STEPS, late: true };

/** An `optional` step whose target never exists is skipped after `targetTimeout`; a required one would close the tour with "missing". */
export const MissingTarget = Template.bind({});
MissingTarget.args = {
	targetTimeout: 1000,
	steps: [
		STEPS[0],
		{
			target: '[data-tour="nowhere"]',
			title: "Never shown",
			content: "Its target doesn't exist.",
			optional: true,
		},
		...STEPS.slice(1),
	],
};

/** A step shown on mobile only: on desktop the count says 4, below 768px it says 5. */
export const OnlyMobileStep = Template.bind({});
OnlyMobileStep.args = {
	steps: [
		...STEPS.slice(0, 3),
		{
			target: '[data-tour="navbar"]',
			title: "Swipe between days",
			content: "On a phone, swipe the calendar left or right.",
			only: "mobile",
		},
		STEPS[3],
	],
};

/** Inside a `transform` + `overflow: hidden` box: inline, the layer would be trapped in it; `portal` escapes it. */
export const Portaled: StoryFn<ITourProps> = (args) => {
	const [open, setOpen] = useState(true);
	return (
		<div
			style={{
				transform: "translateZ(0)",
				overflow: "hidden",
				border: "1px dashed var(--amp-color-border)",
			}}
		>
			<FakeApp>
				{!open && (
					<Button onClick={() => setOpen(true)}>
						Replay the tour
					</Button>
				)}
				<Tour {...args} open={open} onClose={() => setOpen(false)} />
			</FakeApp>
		</div>
	);
};
Portaled.args = { steps: STEPS, portal: true };
