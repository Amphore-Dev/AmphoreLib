import React, { isValidElement, useEffect, useMemo, useState } from "react";

import { t } from "i18next";
import {
	IUseFiltersContext,
	TFieldType,
	TFilterModalFilter,
	TFiltersSlice,
} from "types";

import { Button, Chip } from "@components/atoms";
import { IFiltersModalProps, TFilterList } from "@components/organisms";

import { cn } from "@utils/cn";

import "./ActiveFilters.scss";

interface IActiveFiltersProps<
	T extends Record<string, TFiltersSlice<object>>,
	K extends keyof T,
	S = T[K],
> {
	filtersKey?: keyof T;
	filters?: TFilterList;
	filtersContext?: IFiltersModalProps<T, K, S>["filtersContext"];
	className?: string;
	clearFieldsOnReset?: string[];
	rightContent?: React.ReactNode;
}

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
}: IActiveFiltersProps<T, K, S>) => {
	const { setFilters, options, setFilter } = (filtersContext ??
		{}) as Partial<IUseFiltersContext<T, K, TFiltersSlice<S>>>;
	const contextFilters = (filtersContext?.filters || {}) as TFiltersSlice<S>;
	const count = options?.countCallback
		? options.countCallback(contextFilters) || 0
		: 0;
	const [TotalFiltersCount, setTotalFiltersCount] = useState(count);

	const filtersMap: TFiltersMap = {};

	if (!contextFilters) return null;

	const flatFilters = filters.reduce<TFilterModalFilter[]>((acc, item) => {
		const fields =
			typeof item.fields === "function"
				? item.fields(false)
				: item.fields;

		return [...acc, ...(fields as TFilterModalFilter[])];
	}, []);

	if (!flatFilters.length && !rightContent) return null;

	const handleSetFilter = (name: keyof TFiltersSlice<S>, value: unknown) => {
		setFilter?.(name, value as TFiltersSlice<S>[keyof TFiltersSlice<S>]);
	};

	return (
		<div className={cn(["al__active-filters", className])}>
			{(!!count || !!rightContent) && (
				<div className="al__active-filters__header">
					<div className="al__active-filters__header__left">
						{!!count && (
							<>
								<p className="al__active-filters__title">
									{t("filters.selected", {
										count: TotalFiltersCount,
									})}
								</p>

								<Button
									size="s"
									picto={{
										icon: "refresh",
										className:
											"al__active-filters__reset-picto",
									}}
									color="transparent"
									className="al__active-filters__reset-btn"
									onClick={() => {
										const _values =
											(options?.defaultValues ||
												{}) as TFiltersSlice<S>;

										clearFieldsOnReset.forEach((field) => {
											delete _values[
												field as keyof TFiltersSlice<S>
											];
										});
										setFilters?.(_values, true);
										setTotalFiltersCount(
											options?.countCallback
												? options.countCallback(_values)
												: 0
										);
									}}
								>
									{t("filters.reset")}
								</Button>
							</>
						)}
					</div>
					{rightContent}
				</div>
			)}

			{!!count && (
				<ActiveFiltersList
					flatFilters={flatFilters}
					contextFilters={contextFilters}
					filtersMap={filtersMap}
					onSetFilter={handleSetFilter}
					onCountChange={setTotalFiltersCount}
				/>
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
}

const ActiveFiltersList = <S,>({
	flatFilters,
	contextFilters,
	filtersMap,
	onSetFilter,
	onCountChange,
}: IActiveFiltersListProps<S>) => {
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
						onClear = renderResObj.onClick
							? renderResObj.onClick
							: clearSingle;
					} else {
						content = filter.getFieldValue
							? (filter.getFieldValue(singleValue) as string)
							: String(singleValue);
						onClear = clearSingle;
					}

					const genValue = () => {
						if (typeof filterWithChip.chip === "function") {
							return filterWithChip.chip(
								singleValue,
								contextFilters
							);
						}

						const chipLabel = filterWithChip.chipLabel;
						const label =
							typeof chipLabel === "function"
								? chipLabel(singleValue, contextFilters)
								: chipLabel || filter.label;

						const chipContent = filter.valueDisplay
							? filter.valueDisplay(singleValue)
							: content;

						if (!chipContent) return null;

						return (
							<>
								{label}: {chipContent}
							</>
						);
					};

					const valueToDisplay = genValue();
					if (!valueToDisplay) return null;

					total++;
					return (
						<Chip
							key={`${String(filter.name)}-${idx}-${String(singleValue)}`}
							onDelete={onClear}
						>
							{valueToDisplay}
						</Chip>
					);
				})
				.filter(Boolean) as React.ReactElement[];
		});

		return { chips: mappedChips, totalCount: total };
	}, [contextFilters, filtersMap, flatFilters, onSetFilter]);

	useEffect(() => {
		onCountChange(totalCount);
	}, [onCountChange, totalCount]);

	return <div className="al__active-filters__list">{chips}</div>;
};
