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
	title: string;
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
	size?: TSize;
	className?: string;
}

/**
 * V2 Accordion — controlled, generic over `T`. Same conventions as Select
 * (`items` array, `value`/`multiple` shape, `===` matching). Expand/collapse
 * is pure CSS (`grid-template-rows: 0fr -> 1fr`), no measured height.
 */
export function Accordion<T = string>({
	items,
	value,
	onChange,
	multiple = true,
	size: sizeProp,
	className = "",
}: IAccordionProps<T>) {
	const { size: defaultSize } = useAmphoreDefaults();
	const size = sizeProp ?? defaultSize ?? "md";
	const accordionId = useId();

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

				return (
					<div
						key={String(item.value)}
						className={styles.item}
						data-open={open || undefined}
					>
						<button
							id={headerId}
							type="button"
							className={styles.header}
							aria-expanded={open}
							aria-controls={panelId}
							aria-disabled={item.disabled || undefined}
							disabled={item.disabled}
							onClick={() => toggle(item)}
						>
							{!!item.picto && (
								<Picto
									{...getPicto(item.picto)}
									className={styles.picto}
								/>
							)}
							<span className={styles.title}>{item.title}</span>
							<Picto
								icon="chevron"
								rotation={open ? 270 : 90}
								className={styles.chevron}
							/>
						</button>

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
