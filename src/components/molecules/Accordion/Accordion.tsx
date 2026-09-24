import React, { useId } from "react";

import { useAmphoreDefaults } from "@theme/useAmphoreDefaults";

import type { TPictoName } from "@constants/index";

import { getPicto } from "@utils/UPicto";
import { cn } from "@utils/cn";

import { TSize } from "@interfaces/index";

import type { IPictoProps } from "../../atoms/Picto/Picto";
import { Picto } from "../../atoms/Picto/Picto";

import styles from "./Accordion.module.scss";

export interface TAccordionItem<T = string> {
	value: T;
	/**
	 * Rendered inside the toggle button: rich content (a dot, a badge, muted
	 * figures) is fine, interactive content (links, buttons) is not — it
	 * would be nested in a `<button>`, invalid and hidden from screen
	 * readers. Put those in `actions`.
	 */
	title: React.ReactNode;
	/** The toggle's accessible name when `title` is not plain text (e.g. "Acme" rather than "Acme · 3 projects · 76:00"). */
	ariaLabel?: string;
	/** Links/buttons at the end of the header row, outside the toggle button. */
	actions?: React.ReactNode;
	content: React.ReactNode;
	disabled?: boolean;
	/** Leading icon (see Picto), same convention as Input/Select — an icon name, or an `IPictoProps` object to pass other Picto props. */
	picto?: TPictoName | IPictoProps;
}

export interface IAccordionProps<T = string> {
	items: TAccordionItem<T>[];
	/** Single mode: `T | null`. Multi mode (`multiple`): `T[]`. Same convention as Select. */
	value?: T | T[] | null;
	onChange?: (value: T | T[] | null) => void;
	/** Lets more than one section be open at once. Defaults to true (multi-open) — pass `false` for a single-open (classic FAQ) accordion. */
	multiple?: boolean;
	/** Where the open/close chevron sits relative to the title. Defaults to "end". */
	chevronPosition?: "start" | "end";
	/** Wraps each header row in an `<hN>` (WAI-ARIA accordion pattern). Defaults to a plain div, leaving the page outline untouched. */
	headingLevel?: 2 | 3 | 4 | 5 | 6;
	size?: TSize;
	className?: string;
}

/**
 * The chevron icon points right at 0°. "end" keeps the classic down/up
 * pair; "start" is the tree convention, right when closed, down when open.
 */
export const chevronRotation = (
	position: "start" | "end",
	open: boolean
): number => ("start" === position ? (open ? 90 : 0) : open ? 270 : 90);

/**
 * V2 Accordion — controlled, generic over `T`. Same conventions as Select
 * (`items` array, `value`/`multiple` shape, `===` matching). Expand/collapse
 * is pure CSS (`grid-template-rows: 0fr -> 1fr`), no measured height.
 *
 * Each header row has two zones that never overlap: the toggle button
 * (chevron, picto, title — full width) and the optional `actions` beside
 * it. No click handler on the row itself, so nothing has to guess which
 * element was meant to be interactive.
 */
export function Accordion<T = string>({
	items,
	value,
	onChange,
	multiple = true,
	chevronPosition = "end",
	headingLevel,
	size: sizeProp,
	className = "",
}: IAccordionProps<T>) {
	const { size: defaultSize } = useAmphoreDefaults();
	const size = sizeProp ?? defaultSize ?? "md";
	const accordionId = useId();
	const HeaderRow: React.ElementType = headingLevel
		? `h${headingLevel}`
		: "div";

	const openValues: T[] = multiple
		? ((value as T[] | undefined) ?? [])
		: value === null || value === undefined
			? []
			: [value as T];

	const isOpen = (item: TAccordionItem<T>) => openValues.includes(item.value);

	const toggle = (item: TAccordionItem<T>) => {
		if (item.disabled) return;

		if (multiple) {
			const next = isOpen(item)
				? openValues.filter((v) => v !== item.value)
				: [...openValues, item.value];
			onChange?.(next);
		} else {
			onChange?.(isOpen(item) ? null : item.value);
		}
	};

	return (
		<div className={cn([styles.accordion, className])} data-size={size}>
			{items.map((item, index) => {
				const open = isOpen(item);
				const headerId = `${accordionId}-header-${index}`;
				const panelId = `${accordionId}-panel-${index}`;
				const chevron = (
					<Picto
						icon="chevron"
						rotation={chevronRotation(chevronPosition, open)}
						className={styles.chevron}
					/>
				);

				return (
					<div
						key={String(item.value)}
						className={styles.item}
						data-open={open || undefined}
					>
						<HeaderRow className={styles.headerRow}>
							<button
								id={headerId}
								type="button"
								className={styles.header}
								aria-expanded={open}
								aria-controls={panelId}
								aria-label={item.ariaLabel}
								aria-disabled={item.disabled || undefined}
								disabled={item.disabled}
								onClick={() => toggle(item)}
							>
								{"start" === chevronPosition && chevron}
								{!!item.picto && (
									<Picto
										{...getPicto(item.picto)}
										className={styles.picto}
									/>
								)}
								<span className={styles.title}>
									{item.title}
								</span>
								{"end" === chevronPosition && chevron}
							</button>
							{!!item.actions && (
								<div className={styles.actions}>
									{item.actions}
								</div>
							)}
						</HeaderRow>

						{/* role="region" per item is correct but noisy for a screen
						    reader's landmark list on a long accordion (e.g. a
						    50-item FAQ) — acceptable trade-off here since most
						    real usage is a handful of sections. */}
						<div
							id={panelId}
							role="region"
							aria-labelledby={headerId}
							className={styles.panel}
							data-open={open || undefined}
						>
							{/* Two nested divs, not one: .panelInner is the grid
							    item that actually needs to collapse to 0
							    (min-height: 0 + overflow: hidden) — padding
							    can't live here too, since padding is a fixed
							    floor unaffected by min-height, so it'd leave a
							    residual gap the content still peeks through
							    at rest. .panelContent carries the padding
							    instead, one level deeper, fully clipped by
							    .panelInner's own overflow: hidden. */}
							<div className={styles.panelInner}>
								<div className={styles.panelContent}>
									{item.content}
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
