import React, {
	isValidElement,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";

import {
	FloatingArrow,
	FloatingFocusManager,
	arrow,
	autoUpdate,
	flip,
	offset,
	shift,
	useDismiss,
	useFloating,
	useId as useFloatingId,
	useInteractions,
	useRole,
	type Placement,
} from "@floating-ui/react";

import { AmphorePortal } from "@theme/AmphorePortal";
import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { useMediaQuery } from "@hooks/index";

import { cn } from "@utils/cn";

import { TLabel } from "@interfaces/index";

import { Button } from "../../atoms/Button/Button";
import { Card } from "../../atoms/Card/Card";

import styles from "./Tour.module.scss";

type TTourDevice = "desktop" | "mobile";

/** A value that may differ between desktop and mobile. */
type TPerDevice<T> = T | { desktop?: T; mobile?: T };

export type TTourStep = {
	/**
	 * CSS selector of the element this step points at, e.g.
	 * `'[data-tour="menu"]'` — or one per device when the element differs
	 * (a sidebar on desktop, a bottom nav bar on mobile). No selector (or
	 * none for the current device): the step is centered, no spotlight.
	 */
	target?: TPerDevice<string>;
	title: TPerDevice<React.ReactNode>;
	content: TPerDevice<React.ReactNode>;
	/** Desktop bubble only — the mobile sheet ignores it. Defaults to "bottom". */
	placement?: Placement;
	/** Gap (px) between the target and the spotlight's edge. Defaults to 6. */
	padding?: number;
	/**
	 * The target may legitimately never appear (an empty list, a feature
	 * that's off): once `targetTimeout` runs out, the step is skipped
	 * instead of closing the tour.
	 */
	optional?: boolean;
	/** Shows the step on one device only — the other one never counts it. */
	only?: TTourDevice;
	/**
	 * This step's primary button, instead of the tour's `nextLabel` /
	 * `doneLabel` — e.g. "Start the tour" on a welcome step.
	 */
	nextLabel?: React.ReactNode;
	/** This step's skip button, instead of the tour's `skipLabel` — e.g. "Later". Still closes with "skip". */
	skipLabel?: React.ReactNode;
	/**
	 * `false`: no "Step x of y" nor dots on this step, and it is left out
	 * of the count on the others — a welcome step before the tour proper,
	 * which then reads "Step 1 of 4", not "Step 2 of 5". Defaults to true.
	 */
	progress?: boolean;

	/** Custom class name for this step's bubble. */
	className?: string;

	/** Custom style for this step's bubble. */
	style?: React.CSSProperties;

	/** This step's footer layout, instead of the tour's `actionsAlign`. */
	actionsAlign?: TTourActionsAlign;
};

/**
 * `"end"`: dots at the start, buttons at the end, one row. `"start"`: the
 * other way round. `"center"`: a column, dots centered above centered
 * buttons (no dots row at all without progress).
 */
export type TTourActionsAlign = "start" | "center" | "end";

export type TTourCloseReason = "done" | "skip" | "missing";

export interface ITourProps {
	steps: TTourStep[];
	open: boolean;
	/**
	 * `"done"`: finished through the last step. `"skip"`: the skip button
	 * or Escape. `"missing"`: a non-optional step's target never showed up
	 * within `targetTimeout` — a bug on the consumer's side more than a
	 * choice of the person, so usually not worth persisting as "seen".
	 */
	onClose: (reason: TTourCloseReason) => void;
	/**
	 * Controlled current step — an index into `steps` (not into the steps
	 * visible on this device). Omit to let the tour manage it, starting
	 * over from the first step each time `open` turns true.
	 */
	step?: number;
	onStepChange?: (index: number) => void;
	/**
	 * `"popover"`: spotlight + a bubble anchored to the target.
	 * `"sheet"`: spotlight + a full-width panel, at the bottom of the
	 * screen or at the top when the target sits in the lower half.
	 * `"auto"` (default): popover above `mobileBreakpoint`, sheet below.
	 */
	variant?: "auto" | "popover" | "sheet";
	/** Below this width (px) the device is "mobile": sheet in `auto`, mobile targets/contents, `only` filtering. Defaults to 768. */
	mobileBreakpoint?: number;
	/** How long (ms) to wait for a step's target to appear in the DOM. Defaults to 3000. */
	targetTimeout?: number;
	/** Renders into `document.body` via AmphorePortal (theme scope re-applied). Defaults to false. */
	portal?: boolean;
	/** Defaults to "Next" (or `Tour.nextLabel` from the nearest AmphoreProvider). */
	nextLabel?: TLabel;
	/** Defaults to "Previous". */
	prevLabel?: TLabel;
	/** Defaults to "Skip". */
	skipLabel?: TLabel;
	/** Last step's primary button. Defaults to "Done". */
	doneLabel?: TLabel;
	/** `{current}` and `{total}` are replaced. Defaults to "Step {current} of {total}". */
	stepOfLabel?: TLabel;
	/** Footer layout of every step; a step's own `actionsAlign` wins. Defaults to "end". */
	actionsAlign?: TTourActionsAlign;
	className?: string;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TTourLabels = Pick<
	ITourProps,
	"nextLabel" | "prevLabel" | "skipLabel" | "doneLabel" | "stepOfLabel"
>;

const isPerDevice = <T,>(
	value: TPerDevice<T>
): value is { desktop?: T; mobile?: T } =>
	typeof value === "object" &&
	value !== null &&
	!Array.isArray(value) &&
	!isValidElement(value) &&
	("desktop" in value || "mobile" in value);

const forDevice = <T,>(value: TPerDevice<T>, device: TTourDevice) =>
	isPerDevice(value) ? value[device] : value;

type TRect = { top: number; left: number; width: number; height: number };

/**
 * V2 Tour — a guided walkthrough over the real interface: the page is
 * dimmed except the current step's target, and the step's text sits in a
 * bubble anchored to it (desktop) or in a full-width sheet (mobile). Same
 * engine and same steps on both: targets, contents and whole steps can
 * differ per device, the tour switches mid-way if the viewport crosses
 * `mobileBreakpoint`, and targets rendered late (async data) are waited
 * for. Passive: the page underneath is not clickable while it runs.
 * Controlled by `open`/`onClose` — when to start it and whether it was
 * already seen stays the consumer's business.
 */
export const Tour: React.FC<ITourProps> = ({
	steps,
	open,
	onClose,
	step: stepProp,
	onStepChange,
	variant = "auto",
	mobileBreakpoint = 768,
	targetTimeout = 3000,
	portal = false,
	nextLabel: nextLabelProp,
	prevLabel: prevLabelProp,
	skipLabel: skipLabelProp,
	doneLabel: doneLabelProp,
	stepOfLabel: stepOfLabelProp,
	actionsAlign = "end",
	className = "",
}) => {
	const { resolve } = useAmphoreLabels("Tour");
	const nextLabel = resolve("nextLabel", nextLabelProp);
	const prevLabel = resolve("prevLabel", prevLabelProp);
	const skipLabel = resolve("skipLabel", skipLabelProp);
	const doneLabel = resolve("doneLabel", doneLabelProp);
	const stepOfLabel = resolve("stepOfLabel", stepOfLabelProp);

	const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint - 1}px)`);
	const device: TTourDevice = isMobile ? "mobile" : "desktop";
	const display =
		variant === "auto" ? (isMobile ? "sheet" : "popover") : variant;

	// Indexes into `steps` of the ones this device shows.
	const visible = steps
		.map((s, i) => (!s.only || s.only === device ? i : -1))
		.filter((i) => i !== -1);

	const [internalStep, setInternalStep] = useState(0);
	const requested = stepProp ?? internalStep;
	// A step hidden on this device (the viewport just crossed the
	// breakpoint, or a controlled `step` pointing at one) falls on the
	// next visible one, else the previous one — without writing it back.
	const current =
		visible.find((i) => i >= requested) ??
		[...visible].reverse().find((i) => i < requested) ??
		-1;
	const position = visible.indexOf(current);
	const isLast = position === visible.length - 1;
	// What "Step x of y" and the dots count: steps with `progress: false`
	// (a welcome step) are shown but not counted.
	const counted = visible.filter((i) => steps[i].progress !== false);

	useEffect(() => {
		if (open && stepProp === undefined) setInternalStep(0);
	}, [open, stepProp]);

	const goTo = (index: number) => {
		if (stepProp === undefined) setInternalStep(index);
		onStepChange?.(index);
	};
	const next = () => {
		if (isLast) onClose("done");
		else goTo(visible[position + 1]);
	};
	const prev = () => {
		if (position > 0) goTo(visible[position - 1]);
	};

	// The timeout below outlives renders: it reads the latest ones.
	const latest = useRef({ next, onClose });
	latest.current = { next, onClose };

	const currentStep = current === -1 ? undefined : steps[current];
	const selector = currentStep?.target
		? forDevice(currentStep.target, device)
		: undefined;
	const optional = !!currentStep?.optional;

	const [target, setTarget] = useState<Element | null>(null);
	const [searching, setSearching] = useState(false);

	useEffect(() => {
		setTarget(null);
		if (!open || !currentStep || !selector) {
			setSearching(false);
			return;
		}
		const found = document.querySelector(selector);
		if (found) {
			setTarget(found);
			setSearching(false);
			return;
		}
		// Rendered late (a list waiting on its data, a lazy route):
		// watch the DOM until it shows up, or give up.
		setSearching(true);
		const observer = new MutationObserver(() => {
			const el = document.querySelector(selector);
			if (!el) return;
			observer.disconnect();
			clearTimeout(timer);
			setTarget(el);
			setSearching(false);
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
		});
		const timer = setTimeout(() => {
			observer.disconnect();
			setSearching(false);
			if (optional) latest.current.next();
			else latest.current.onClose("missing");
		}, targetTimeout);
		return () => {
			observer.disconnect();
			clearTimeout(timer);
		};
		// `currentStep` itself is a new object whenever the consumer
		// rebuilds `steps` inline: what matters is which step and which
		// selector.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open, current, selector, optional, targetTimeout]);

	useEffect(() => {
		if (!target) return;
		const reduced =
			typeof window.matchMedia === "function" &&
			window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		target.scrollIntoView?.({
			block: "nearest",
			inline: "nearest",
			behavior: reduced ? "auto" : "smooth",
		});
	}, [target]);

	const arrowRef = useRef<SVGSVGElement>(null);
	const { refs, floatingStyles, context } = useFloating({
		open,
		onOpenChange: (nextOpen) => {
			if (!nextOpen) onClose("skip");
		},
		placement: currentStep?.placement ?? "bottom",
		strategy: "fixed",
		whileElementsMounted:
			display === "popover" && target ? autoUpdate : undefined,
		middleware: [
			offset(14),
			flip({ padding: 12 }),
			// A target taller (or wider) than the room left around it -
			// a whole calendar - fits no side: the bubble slides back
			// over it rather than off screen.
			shift({ padding: 12, crossAxis: true }),
			arrow({ element: arrowRef, padding: 12 }),
		],
	});

	useLayoutEffect(() => {
		refs.setReference(target);
	}, [refs, target]);

	// The spotlight follows the target the same way the bubble does
	// (scroll, resize, layout shifts): autoUpdate on the target, with the
	// spotlight itself as the "floating" element it tracks against.
	const spotlightRef = useRef<HTMLDivElement>(null);
	const [rect, setRect] = useState<TRect | null>(null);
	useLayoutEffect(() => {
		setRect(null);
		const el = spotlightRef.current;
		if (!target || !el) return;
		const update = () => {
			const r = target.getBoundingClientRect();
			setRect({
				top: r.top,
				left: r.left,
				width: r.width,
				height: r.height,
			});
		};
		update();
		return autoUpdate(target, el, update);
	}, [target]);

	const dismiss = useDismiss(context, { outsidePress: false });
	const role = useRole(context, { role: "dialog" });
	const { getFloatingProps } = useInteractions([dismiss, role]);

	const titleId = useFloatingId();
	const contentId = useFloatingId();
	const primaryRef = useRef<HTMLButtonElement>(null);

	if (!open || !currentStep) return null;

	const ready = !searching && (!selector || !!target);
	const pad = currentStep.padding ?? 6;
	const centered = !selector;
	const showProgress = currentStep.progress !== false;
	const align = currentStep.actionsAlign ?? actionsAlign;

	// Sheet: at the bottom, unless that would cover the target.
	const sheetPosition =
		rect && rect.top + rect.height / 2 > window.innerHeight / 2
			? "top"
			: "bottom";

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowRight") {
			e.preventDefault();
			next();
		} else if (e.key === "ArrowLeft") {
			e.preventDefault();
			prev();
		}
	};

	const layer = (
		<div className={styles.root} data-variant={display}>
			{/* Always mounted: the spotlight's autoUpdate needs an element
			    to track against before the first rect is known. */}
			<div
				ref={spotlightRef}
				className={styles.spotlight}
				data-visible={!!target && !!rect}
				style={
					rect
						? {
								top: rect.top - pad,
								left: rect.left - pad,
								width: rect.width + pad * 2,
								height: rect.height + pad * 2,
							}
						: undefined
				}
				aria-hidden
			/>
			{!target && <div className={styles.backdrop} aria-hidden />}

			{ready && (
				<FloatingFocusManager
					context={context}
					initialFocus={primaryRef}
				>
					<Card
						ref={refs.setFloating}
						elevation={4}
						className={cn([
							styles.bubble,
							className,
							currentStep.className,
						])}
						data-variant={display}
						data-centered={centered}
						data-position={
							display === "sheet" ? sheetPosition : undefined
						}
						style={{
							...(currentStep.style ?? {}),
							...(display === "popover" && !centered
								? floatingStyles
								: undefined),
						}}
						aria-labelledby={titleId}
						aria-describedby={contentId}
						{...getFloatingProps({ onKeyDown })}
					>
						{display === "popover" && !centered && (
							<FloatingArrow
								ref={arrowRef}
								context={context}
								className={styles.arrow}
								width={14}
								height={7}
							/>
						)}
						{showProgress && (
							<span className={styles.counter}>
								{stepOfLabel
									.replace(
										"{current}",
										String(counted.indexOf(current) + 1)
									)
									.replace("{total}", String(counted.length))}
							</span>
						)}
						<h2 id={titleId} className={styles.title}>
							{forDevice(currentStep.title, device)}
						</h2>
						<div id={contentId} className={styles.content}>
							{forDevice(currentStep.content, device)}
						</div>
						<div
							className={styles.footer}
							data-actions-align={align}
						>
							{/* In a row it stays, even empty: it pushes the
							    buttons to their side. Centered, an empty one
							    would only leave a gap above them. */}
							{(showProgress || align !== "center") && (
								<div className={styles.dots} aria-hidden>
									{showProgress &&
										counted.map((i) => (
											<span
												key={i}
												data-active={i === current}
											/>
										))}
								</div>
							)}
							<div className={styles.actions}>
								{!isLast && (
									<Button
										size="sm"
										variant="ghost"
										onClick={() => onClose("skip")}
									>
										{currentStep.skipLabel ?? skipLabel}
									</Button>
								)}
								{position > 0 && (
									<Button
										size="sm"
										variant="outline"
										onClick={prev}
									>
										{prevLabel}
									</Button>
								)}
								<Button
									ref={primaryRef}
									size="sm"
									onClick={next}
								>
									{currentStep.nextLabel ??
										(isLast ? doneLabel : nextLabel)}
								</Button>
							</div>
						</div>
					</Card>
				</FloatingFocusManager>
			)}
		</div>
	);

	return portal ? <AmphorePortal>{layer}</AmphorePortal> : layer;
};
