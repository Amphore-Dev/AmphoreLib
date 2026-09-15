import React, {
	isValidElement,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { Badge, Button } from "@components/atoms";

import { cn } from "@utils/cn";

import {
	IUseFiltersContext,
	TFieldType,
	TFilterModalFilter,
	TFiltersModalGroup,
	TFiltersSlice,
	TLabel,
} from "@interfaces/index";

import styles from "./ActiveFilters.module.scss";

export interface IActiveFiltersProps<
	T extends Record<string, TFiltersSlice<object>>,
	K extends keyof T,
	S = T[K],
> {
	filters?: TFiltersModalGroup[];
	filtersContext?: IUseFiltersContext<T, K, S>;
	className?: string;
	/** Fields to drop from the default values when the global "reset" is used (e.g. keeping a tab-scoped filter untouched). */
	clearFieldsOnReset?: string[];
	rightContent?: React.ReactNode;
	/** Defaults to "Reset" (or `common.reset`/`ActiveFilters.resetLabel` from the nearest AmphoreProvider — see useAmphoreLabels). */
	resetLabel?: TLabel;
	/** Defaults to "Show more" (or `ActiveFilters.showMoreLabel` from the nearest AmphoreProvider). */
	showMoreLabel?: TLabel;
	/** Defaults to "Show less" (or `ActiveFilters.showLessLabel` from the nearest AmphoreProvider). */
	showLessLabel?: TLabel;
	/** i18n hook for the count label — `count => "3 active filters"`. */
	countLabel?: (count: number) => string;
	/** i18n for the period filter's implicit chip — `(from, to) => "From ... to ..."`. */
	periodLabel?: (from: unknown, to: unknown) => React.ReactNode;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TActiveFiltersLabels = Pick<
	IActiveFiltersProps<Record<string, TFiltersSlice<object>>, string>,
	"resetLabel" | "showMoreLabel" | "showLessLabel"
>;

type TRenderResultObject = {
	render: React.ReactNode;
	onClick?: () => void;
};

type TFiltersMap = {
	[K in TFieldType]?: (
		filter: TFilterModalFilter,
		value: unknown
	) => null | TRenderResultObject | JSX.Element;
};

/**
 * V2 ActiveFilters — a chip list of every non-empty filter, with a
 * "see more"/"see less" row once they overflow their container.
 * Removing a chip clears just that filter (or, for a `period` filter, both
 * `from`/`to`) via `filtersContext.setFilter`/`setFilters` — the same
 * `Badge`'s `onRemove` used everywhere else a removable tag is needed
 * (decision 5), no separate `Chip` component.
 */
export const ActiveFilters = <
	T extends Record<string, TFiltersSlice<object>>,
	K extends keyof T,
	S = T[K],
>({
	filters = [],
	filtersContext,
	className,
	clearFieldsOnReset = [],
	rightContent,
	resetLabel: resetLabelProp,
	showMoreLabel: showMoreLabelProp,
	showLessLabel: showLessLabelProp,
	countLabel = (count) => `${count} active filter${count > 1 ? "s" : ""}`,
	periodLabel = (from, to) => (
		<>
			From {String(from ?? "…")} to {String(to ?? "…")}
		</>
	),
}: IActiveFiltersProps<T, K, S>) => {
	const { resolve } = useAmphoreLabels("ActiveFilters");
	const resetLabel = resolve("resetLabel", resetLabelProp, "reset");
	const showMoreLabel = resolve("showMoreLabel", showMoreLabelProp);
	const showLessLabel = resolve("showLessLabel", showLessLabelProp);

	const { setFilters, options, setFilter } = (filtersContext ??
		{}) as Partial<IUseFiltersContext<T, K, TFiltersSlice<S>>>;
	const contextFilters = (filtersContext?.filters || {}) as TFiltersSlice<S>;
	const count = options?.countCallback
		? options.countCallback(contextFilters) || 0
		: 0;
	const [totalFiltersCount, setTotalFiltersCount] = useState(count);

	const filtersMap: TFiltersMap = {
		period: (filter, _value) => {
			const periodFilter = filter as TFilterModalFilter & {
				from?: { name?: string };
				to?: { name?: string };
				getFieldValue?: (value: unknown) => React.ReactNode;
			};
			const fromName = periodFilter.from?.name || "from";
			const toName = periodFilter.to?.name || "to";

			const from = contextFilters?.[fromName as keyof TFiltersSlice<S>];
			const to = contextFilters?.[toName as keyof TFiltersSlice<S>];

			if (from || to) {
				return {
					render: (periodFilter.getFieldValue
						? periodFilter.getFieldValue({ from, to })
						: periodLabel(from, to)) as React.ReactNode,
					onClick: () => {
						setFilters?.({
							...contextFilters,
							[fromName as keyof TFiltersSlice<S>]: null,
							[toName as keyof TFiltersSlice<S>]: null,
						});
					},
				};
			}

			return null;
		},
	};

	if (!contextFilters) return null;

	const flatFilters = filters.reduce<TFilterModalFilter[]>((acc, group) => {
		const fields =
			typeof group.fields === "function"
				? group.fields(false)
				: group.fields;
		return [...acc, ...fields];
	}, []);

	if (!flatFilters.length && !rightContent) return null;

	const handleSetFilter = (name: keyof TFiltersSlice<S>, value: unknown) => {
		setFilter?.(name, value as TFiltersSlice<S>[keyof TFiltersSlice<S>]);
	};

	return (
		<div className={cn([styles.wrapper, className])}>
			{(!!count || !!rightContent) && (
				<div className={styles.header}>
					<div className={styles.headerLeft}>
						{!!count && (
							<div className={styles.countRow}>
								<p className={styles.title}>
									{countLabel(totalFiltersCount)}
								</p>
								<Button
									size="sm"
									picto="refresh"
									variant="ghost"
									color="neutral"
									className={styles.resetBtn}
									onClick={() => {
										const values = {
											...((options?.defaultValues ||
												{}) as TFiltersSlice<S>),
										};
										clearFieldsOnReset.forEach((field) => {
											delete values[
												field as keyof TFiltersSlice<S>
											];
										});
										setFilters?.(values, true);
										setTotalFiltersCount(
											options?.countCallback
												? options.countCallback(values)
												: 0
										);
									}}
								>
									{resetLabel}
								</Button>
							</div>
						)}
						{!!count && (
							<ActiveFiltersList
								flatFilters={flatFilters}
								contextFilters={contextFilters}
								filtersMap={filtersMap}
								onSetFilter={handleSetFilter}
								onCountChange={setTotalFiltersCount}
								showMoreLabel={showMoreLabel}
								showLessLabel={showLessLabel}
							/>
						)}
					</div>
					{rightContent}
				</div>
			)}
		</div>
	);
};

interface IActiveFiltersListProps<S> {
	flatFilters: TFilterModalFilter[];
	contextFilters: TFiltersSlice<S>;
	filtersMap: TFiltersMap;
	onSetFilter: (name: keyof TFiltersSlice<S>, value: unknown) => void;
	onCountChange: (count: number) => void;
	showMoreLabel: string;
	showLessLabel: string;
}

const ActiveFiltersList = <S,>({
	flatFilters,
	contextFilters,
	filtersMap,
	onSetFilter,
	onCountChange,
	showMoreLabel,
	showLessLabel,
}: IActiveFiltersListProps<S>) => {
	const [expanded, setExpanded] = useState(false);
	const [isMeasuring, setIsMeasuring] = useState(true);
	const [hiddenStart, setHiddenStart] = useState<number | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const seeMoreRef = useRef<HTMLButtonElement>(null);
	const prevChipsRef = useRef<React.ReactElement[] | null>(null);
	const lastWidthRef = useRef(0);

	const { chips, totalCount } = useMemo(() => {
		let total = 0;

		const mappedChips = flatFilters.flatMap((filter) => {
			const filterWithChip = filter as TFilterModalFilter & {
				chip?: (
					value: unknown,
					filters: TFiltersSlice<S>
				) => React.ReactNode;
				chipLabel?:
					| React.ReactNode
					| ((
							value: unknown,
							filters: TFiltersSlice<S>
					  ) => React.ReactNode);
			};
			const name = filter.name as keyof TFiltersSlice<S>;
			const rawValue = contextFilters[name] as unknown;
			const renderFn = filtersMap[filter.type as TFieldType];

			const values = Array.isArray(rawValue) ? rawValue : [rawValue];

			return values
				.map((singleValue, idx) => {
					const renderRes = renderFn
						? renderFn(filter, singleValue)
						: null;

					if (renderFn && !renderRes) return null;
					if (
						!renderFn &&
						(singleValue === null || singleValue === undefined)
					)
						return null;

					let content: React.ReactNode;
					let onClear: () => void;

					const clearSingle = () => {
						if (!Array.isArray(rawValue)) {
							onSetFilter(name, null);
							return;
						}
						let removed = false;
						const next = rawValue.filter((v) => {
							if (!removed && Object.is(v, singleValue)) {
								removed = true;
								return false;
							}
							return true;
						});
						onSetFilter(name, next.length ? next : null);
					};

					if (renderRes && isValidElement(renderRes)) {
						content = renderRes;
						onClear = clearSingle;
					} else if (
						typeof renderRes === "object" &&
						renderRes !== null
					) {
						const renderResObj = renderRes as TRenderResultObject;
						content = renderResObj.render;
						onClear = renderResObj.onClick ?? clearSingle;
					} else {
						content = filter.getFieldValue
							? (filter.getFieldValue(singleValue) as string)
							: String(singleValue);
						onClear = clearSingle;
					}

					const label = (() => {
						if (typeof filterWithChip.chip === "function") {
							return filterWithChip.chip(
								singleValue,
								contextFilters
							);
						}
						const chipLabel = filterWithChip.chipLabel;
						const resolvedLabel =
							typeof chipLabel === "function"
								? chipLabel(singleValue, contextFilters)
								: chipLabel || filter.label;

						const chipContent = filter.valueDisplay
							? filter.valueDisplay(singleValue)
							: content;

						if (!chipContent) return null;

						return (
							<>
								{resolvedLabel}: {chipContent}
							</>
						);
					})();

					if (!label) return null;

					total++;
					return (
						<Badge
							key={`${String(filter.name)}-${idx}-${String(singleValue)}`}
							onRemove={onClear}
							variant="outline"
							data-active-filter-chip=""
						>
							{label}
						</Badge>
					);
				})
				.filter(Boolean) as React.ReactElement[];
		});

		return { chips: mappedChips, totalCount: total };
	}, [contextFilters, filtersMap, flatFilters, onSetFilter]);

	// Re-measure synchronously (before paint) whenever the chip set itself
	// changes — avoids a flash of the wrong overflow state.
	if (prevChipsRef.current !== chips) {
		prevChipsRef.current = chips;
		if (!isMeasuring) setIsMeasuring(true);
	}

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const ro = new ResizeObserver((entries) => {
			const width = entries[0]?.contentRect.width ?? 0;
			if (Math.abs(width - lastWidthRef.current) > 1) {
				lastWidthRef.current = width;
				setIsMeasuring(true);
			}
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	useLayoutEffect(() => {
		if (!isMeasuring) return;

		const container = containerRef.current;
		if (!container || expanded) {
			setHiddenStart(null);
			setIsMeasuring(false);
			return;
		}

		const containerWidth = container.clientWidth;
		if (!containerWidth) {
			setIsMeasuring(false);
			return;
		}

		const chipEls = Array.from(
			container.querySelectorAll<HTMLElement>("[data-active-filter-chip]")
		);
		if (!chipEls.length) {
			setHiddenStart(null);
			setIsMeasuring(false);
			return;
		}

		const GAP = 8;
		const seeMoreWidth = (seeMoreRef.current?.offsetWidth ?? 90) + GAP;

		let usedWidth = 0;
		let cutoff = chipEls.length;

		for (let i = 0; i < chipEls.length; i++) {
			const chipWidth = chipEls[i].offsetWidth;
			const gapBefore = i > 0 ? GAP : 0;
			const newUsed = usedWidth + gapBefore + chipWidth;
			const isLast = i === chipEls.length - 1;

			if (!isLast && newUsed + seeMoreWidth > containerWidth) {
				cutoff = i;
				break;
			} else if (isLast && newUsed > containerWidth) {
				cutoff = i;
				break;
			}
			usedWidth = newUsed;
		}

		setHiddenStart(cutoff < chipEls.length ? cutoff : null);
		setIsMeasuring(false);
	}, [isMeasuring, expanded]);

	useEffect(() => {
		onCountChange(totalCount);
	}, [onCountChange, totalCount]);

	const showAll = expanded || isMeasuring;
	const visibleChips = showAll
		? chips
		: hiddenStart !== null
			? chips.slice(0, hiddenStart)
			: chips;
	const showSeeMore = !expanded && hiddenStart !== null && !isMeasuring;

	return (
		<div ref={containerRef} className={styles.list}>
			{visibleChips}

			{(showSeeMore || isMeasuring) && (
				<button
					ref={seeMoreRef}
					className={styles.seeMore}
					style={isMeasuring ? { visibility: "hidden" } : undefined}
					tabIndex={isMeasuring ? -1 : 0}
					onClick={() => setExpanded(true)}
				>
					{showMoreLabel}
				</button>
			)}

			{expanded && (
				<button
					className={styles.seeMore}
					onClick={() => {
						setExpanded(false);
						setIsMeasuring(true);
					}}
				>
					{showLessLabel}
				</button>
			)}
		</div>
	);
};
