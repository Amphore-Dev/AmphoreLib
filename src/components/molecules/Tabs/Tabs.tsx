import React, { useEffect, useId, useRef, useState } from "react";

import { useAmphoreDefaults } from "@theme/useAmphoreDefaults";
import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { getPicto } from "@utils/UPicto";
import { cn } from "@utils/cn";

import { TColor, TLabel, TSize, TTabItem } from "@interfaces/index";

import { Picto } from "../../atoms/Picto/Picto";

import styles from "./Tabs.module.scss";

export interface ITabsProps<T = string> {
	items: TTabItem<T>[];
	value: T;
	onChange: (value: T) => void;
	size?: TSize;
	color?: TColor;
	className?: string;
	/** aria-label for the left scroll arrow, shown once the tab strip overflows. Defaults to "Scroll left" (or `Tabs.scrollLeftLabel` from the nearest AmphoreProvider — see useAmphoreLabels). */
	scrollLeftLabel?: TLabel;
	/** aria-label for the right scroll arrow. Defaults to "Scroll right" (or `Tabs.scrollRightLabel` from the nearest AmphoreProvider). */
	scrollRightLabel?: TLabel;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TTabsLabels = Pick<
	ITabsProps,
	"scrollLeftLabel" | "scrollRightLabel"
>;

/**
 * V2 Tabs — controlled tab strip, manual activation (WAI-ARIA "tabs"
 * pattern): arrows/Home/End move focus only, Enter/Space/click selects.
 * Data-driven `items`, not compound `<Tab>`/`<TabPanel>` children — renders
 * only the tablist; panel content is the consumer's own via the separate
 * `TabPanel` below, both reading the same controlled `value`.
 */
export function Tabs<T = string>({
	items,
	value,
	onChange,
	size: sizeProp,
	color = "primary",
	className = "",
	scrollLeftLabel: scrollLeftLabelProp,
	scrollRightLabel: scrollRightLabelProp,
}: ITabsProps<T>) {
	const { size: defaultSize } = useAmphoreDefaults();
	const size = sizeProp ?? defaultSize ?? "md";
	const { resolve } = useAmphoreLabels("Tabs");
	const scrollLeftLabel = resolve("scrollLeftLabel", scrollLeftLabelProp);
	const scrollRightLabel = resolve("scrollRightLabel", scrollRightLabelProp);
	const tabsId = useId();
	const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
	const listRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);
	const [isScrollable, setIsScrollable] = useState(false);

	const enabledIndexes = items.reduce<number[]>((acc, item, index) => {
		if (!item.disabled) acc.push(index);
		return acc;
	}, []);

	// Roving tabindex follows *focus*, not the selected value — under manual
	// activation the two can differ while arrowing through tabs before
	// committing one. Falls back to the first enabled tab if the selected
	// value isn't found (or is disabled).
	const selectedIndex = items.findIndex((item) => item.value === value);
	const [focusedIndex, setFocusedIndex] = useState(
		selectedIndex !== -1 ? selectedIndex : (enabledIndexes[0] ?? 0)
	);

	// Keeps the roving tabindex in sync when `value` changes from outside
	// (e.g. a consumer switching tabs programmatically), without fighting
	// in-progress arrow-key navigation (this only reacts to `value` itself).
	useEffect(() => {
		if (selectedIndex !== -1) setFocusedIndex(selectedIndex);
	}, [selectedIndex]);

	// Whenever the selected tab changes (click, Enter/Space, or a consumer
	// switching it externally) and the strip is actually scrollable, bring it
	// into view centered — otherwise selecting a tab hidden off-screen (e.g.
	// via keyboard) leaves the user staring at the wrong part of the strip.
	// No-op when everything already fits (nothing to scroll to begin with).
	useEffect(() => {
		const el = listRef.current;
		if (!el || selectedIndex === -1) return;
		if (el.scrollWidth <= el.clientWidth) return;
		tabRefs.current[selectedIndex]?.scrollIntoView?.({
			behavior: "smooth",
			inline: "center",
			block: "nearest",
		});
	}, [selectedIndex]);

	// 1px tolerance: scrollLeft/scrollWidth are subpixel-fuzzy across
	// browsers, an exact 0/max comparison flickers the arrows at rest.
	const updateScrollState = () => {
		const el = listRef.current;
		if (!el) return;
		setIsScrollable(el.scrollWidth > el.clientWidth + 1);
		setCanScrollLeft(el.scrollLeft > 1);
		setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
	};

	useEffect(() => {
		updateScrollState();
		const el = listRef.current;
		if (!el) return;
		// ResizeObserver: catches the strip growing/shrinking (items change,
		// container resize) that a plain scroll listener alone would miss.
		const resizeObserver = new ResizeObserver(updateScrollState);
		resizeObserver.observe(el);
		el.addEventListener("scroll", updateScrollState, { passive: true });
		return () => {
			resizeObserver.disconnect();
			el.removeEventListener("scroll", updateScrollState);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps -- re-measure whenever the tab set itself changes
	}, [items]);

	// Scrolls to the next tab that isn't already fully visible on that side,
	// centered — not a fixed pixel amount, so it always lands on a real tab
	// regardless of how many fit per "page".
	const scrollByDirection = (direction: 1 | -1) => {
		const el = listRef.current;
		if (!el) return;
		const containerRect = el.getBoundingClientRect();
		const tabs = tabRefs.current.filter(
			(tab): tab is HTMLButtonElement => tab !== null
		);
		const target =
			direction === 1
				? tabs.find(
						(tab) =>
							tab.getBoundingClientRect().right >
							containerRect.right + 1
					)
				: [...tabs]
						.reverse()
						.find(
							(tab) =>
								tab.getBoundingClientRect().left <
								containerRect.left - 1
						);
		target?.scrollIntoView?.({
			behavior: "smooth",
			inline: "center",
			block: "nearest",
		});
	};

	const nextEnabledIndex = (
		from: number,
		direction: 1 | -1
	): number | null => {
		if (enabledIndexes.length === 0) return null;
		const pos = enabledIndexes.indexOf(from);
		const base =
			pos === -1 ? (direction === 1 ? -1 : enabledIndexes.length) : pos;
		const nextPos =
			(base + direction + enabledIndexes.length) % enabledIndexes.length;
		return enabledIndexes[nextPos];
	};

	const moveFocus = (index: number) => {
		tabRefs.current[index]?.focus();
		setFocusedIndex(index);
	};

	const select = (index: number) => {
		if (items[index].disabled) return;
		moveFocus(index);
		onChange(items[index].value);
	};

	const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
		let nextIndex: number | null = null;

		if (e.key === "ArrowRight") nextIndex = nextEnabledIndex(index, 1);
		else if (e.key === "ArrowLeft") nextIndex = nextEnabledIndex(index, -1);
		else if (e.key === "Home") nextIndex = enabledIndexes[0] ?? null;
		else if (e.key === "End")
			nextIndex = enabledIndexes[enabledIndexes.length - 1] ?? null;

		// Enter/Space aren't handled here — the browser already turns those
		// into a `click` on a focused native <button>, which `onClick` below
		// already selects on.
		if (nextIndex === null) return;
		e.preventDefault();
		moveFocus(nextIndex);
	};

	return (
		<div className={styles.wrapper}>
			{isScrollable && (
				<button
					type="button"
					className={cn([styles.arrow, styles.arrowLeft])}
					onClick={() => scrollByDirection(-1)}
					disabled={!canScrollLeft}
					aria-label={scrollLeftLabel}
					// Not part of the tablist's own roving-tabindex sequence —
					// scrolling is a viewport concern, not a tab to select.
					tabIndex={-1}
				>
					<Picto icon="chevron" rotation={180} />
				</button>
			)}

			<div
				ref={listRef}
				role="tablist"
				className={cn([styles.tabs, className])}
				data-size={size}
			>
				{items.map((item, index) => {
					const selected = item.value === value;
					return (
						<button
							key={String(item.value)}
							ref={(node) => {
								tabRefs.current[index] = node;
							}}
							id={`${tabsId}-tab-${index}`}
							type="button"
							role="tab"
							aria-selected={selected}
							aria-disabled={item.disabled || undefined}
							tabIndex={index === focusedIndex ? 0 : -1}
							disabled={item.disabled}
							data-color={color}
							className={cn([
								styles.tab,
								selected && styles.tabActive,
							])}
							onClick={() => select(index)}
							onKeyDown={(e) => handleKeyDown(e, index)}
						>
							{!!item.picto && (
								<Picto
									{...getPicto(item.picto)}
									className={styles.picto}
								/>
							)}
							{item.label}
						</button>
					);
				})}
			</div>

			{isScrollable && (
				<button
					type="button"
					className={cn([styles.arrow, styles.arrowRight])}
					onClick={() => scrollByDirection(1)}
					disabled={!canScrollRight}
					aria-label={scrollRightLabel}
					tabIndex={-1}
				>
					<Picto icon="chevron" />
				</button>
			)}
		</div>
	);
}

export interface ITabPanelProps {
	active: boolean;
	children?: React.ReactNode;
	className?: string;
}

/**
 * Pairs with `Tabs` via the same controlled `value` the consumer already
 * owns — pass `active={value === "..."}`. Deliberately not wired through
 * context/ids: keeping both components ignorant of each other's internals
 * means either can be used alone (a `Tabs` strip driving something other
 * than a panel, e.g. filtering a list) without dragging the other in.
 */
export const TabPanel: React.FC<ITabPanelProps> = ({
	active,
	children,
	className = "",
}) => {
	if (!active) return null;

	return (
		<div role="tabpanel" className={cn([styles.panel, className])}>
			{children}
		</div>
	);
};
