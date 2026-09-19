import React, { useState } from "react";

import { StoryFn } from "@storybook/react";

import { Button } from "@components/atoms";

import { SidePanel, ISidePanelProps } from "./SidePanel";

export default {
	title: "Components/Molecules/SidePanel",
	component: SidePanel,
	argTypes: {
		portal: { control: "boolean" },
		title: { control: "text" },
		hideCloseButton: { control: "boolean" },
		overlay: { control: "boolean" },
		mobileBreakpoint: { control: "number" },
		mobileMode: {
			control: "radio",
			options: ["bottomPanel", "modal"],
		},
		keepDockedOnMobile: { control: "boolean" },
		open: { control: false },
		onOpenChange: { control: false },
	},
	parameters: {
		docs: { story: { height: "420px" } },
	},
};

const page = (children: React.ReactNode) => (
	<div
		style={{
			display: "flex",
			height: 380,
			gap: 16,
			// A visibly different ground from the panel's own card
			// background — otherwise a plain 1px border is the only thing
			// separating "the page" from "the panel", easy to miss at a
			// glance.
			background: "var(--amp-color-ghost-bg)",
			padding: 16,
			borderRadius: "var(--amp-radius-md)",
			position: "relative",
			overflow: "hidden",
			// BottomPanel is `position: fixed` — without an ancestor that
			// establishes its own containing block (transform does this
			// per spec), "fixed" resolves against the real iframe
			// viewport, not this 380px-tall box, and renders clipped out
			// of the docs preview entirely. Deliberate use of the same
			// mechanism the z-index stacking-context bug came from
			// elsewhere this session — there it was an accidental trap,
			// here it's exactly what a confined demo needs.
			transform: "translateZ(0)",
		}}
	>
		{children}
	</div>
);

// Every story below reopens the same way: closing the panel (its own
// close button, or on mobile dragging/tapping the handle to `open:false`)
// must not be a dead end within the demo.
const mainContent = (onOpen: () => void) => (
	<div
		style={{
			flex: 1,
			minWidth: 0,
			background: "var(--amp-color-card)",
			borderRadius: "var(--amp-radius-md)",
			padding: 16,
			display: "flex",
			flexDirection: "column",
			gap: 12,
		}}
	>
		<Button size="sm" onClick={onOpen}>
			Open the panel
		</Button>
		<p style={{ margin: 0, color: "var(--amp-color-sub)", fontSize: 13 }}>
			Rest of the page (a task list, a table…) — the panel docks beside
			it, not on top of it.
		</p>
	</div>
);

// Storybook's own docs-canvas iframe is usually narrower than 1280px, so
// every story here pins `mobileBreakpoint` explicitly instead of relying
// on the embed's real width — otherwise these render the BottomPanel
// fallback instead of the desktop panel they're meant to demonstrate (no
// header, no title, no close button — that's the mobile tree, by design).
const FORCE_DESKTOP = 1;
const FORCE_MOBILE = 4000;

const Template: StoryFn<ISidePanelProps> = (args) => {
	const [open, setOpen] = useState(args.open ?? true);
	return page(
		<>
			{mainContent(() => setOpen(true))}
			<SidePanel {...args} open={open} onOpenChange={setOpen} />
		</>
	);
};

export const Base = Template.bind({});
Base.args = {
	mobileBreakpoint: FORCE_DESKTOP,
	open: true,
	title: "Task #482",
	children: <p style={{ margin: 0 }}>Panel content — a task's detail.</p>,
};

export const WithoutTitle = Template.bind({});
WithoutTitle.args = {
	...Base.args,
	title: undefined,
	children: <p style={{ margin: 0 }}>No title — just the close button.</p>,
};

export const HideCloseButton = Template.bind({});
HideCloseButton.args = {
	...Base.args,
	hideCloseButton: true,
};

// `overlay`: position:fixed instead of sticky — floats above the page
// instead of sitting in the flow as a real column (main content behind
// it keeps its own full width, doesn't shrink to make room). No dimming
// backdrop, no outside-click-to-close — add those around it yourself if
// this needs to behave like a modal.
export const Overlay = Template.bind({});
Overlay.args = {
	...Base.args,
	overlay: true,
};

// Below `mobileBreakpoint`, SidePanel renders as a BottomPanel instead —
// no header/title row, no close button: the handle (tap to toggle, drag
// to resize) is the mobile equivalent of both. `mobileBreakpoint` forced
// high here so this always shows the mobile tree regardless of the
// embed's real width. `bottomPanelProps.defaultHeight` kept well under
// the demo's own 380px-tall box — the real component still clamps to
// `maxHeightRatio` of the true viewport, but this preview box is much
// shorter than a real screen, and BottomPanel's `fixed` positioning
// doesn't know that: an unclamped default here would render taller than
// the box, clipped from the top (its own handle included) by the box's
// `overflow: hidden` — that's a demo-sizing issue, not a component bug.
export const MobileFallback = Template.bind({});
MobileFallback.args = {
	mobileBreakpoint: FORCE_MOBILE,
	open: true,
	title: "Task #482",
	bottomPanelProps: { defaultHeight: 260 },
	children: (
		<p style={{ margin: 0 }}>
			On mobile: drag the handle to resize, or tap it to collapse/expand —
			no separate close button.
		</p>
	),
};

// `keepDockedOnMobile`: default is off — on mobile, closing behaves like
// desktop, nothing rendered at all. This story opts back into BottomPanel's
// native docked-peek behavior: closed still shows a handle to tap/drag back
// open, for cases with something worth peeking at even while "closed" (a
// mini player, an ongoing upload).
export const KeepDockedOnMobile = Template.bind({});
KeepDockedOnMobile.args = {
	mobileBreakpoint: FORCE_MOBILE,
	open: false,
	keepDockedOnMobile: true,
	title: "Task #482",
	bottomPanelProps: { defaultHeight: 260 },
	children: (
		<p style={{ margin: 0 }}>
			Content hidden while closed — tap the handle to show it.
		</p>
	),
};

// `mobileMode="modal"`: below `mobileBreakpoint`, a centered Modal instead
// of the BottomPanel sheet — dimmed backdrop, header with the title and
// close button, Escape / outside-click all closing through
// `onOpenChange(false)`. `keepDockedOnMobile` and `bottomPanelProps` have
// nothing to act on here; `modalProps` is the passthrough instead. The
// Modal's overlay is `position: fixed`, so the demo box's `transform`
// confines it the same way it confines the BottomPanel above.
export const MobileModal = Template.bind({});
MobileModal.args = {
	mobileBreakpoint: FORCE_MOBILE,
	mobileMode: "modal",
	open: true,
	title: "Task #482",
	modalProps: { size: "sm" },
	children: (
		<p style={{ margin: 0 }}>
			On mobile: a centered dialog — close it from the header, Escape, or
			the backdrop.
		</p>
	),
};

export const Portal = Template.bind({});
Portal.args = {
	...Base.args,
	portal: true,
};
