import { useCallback, useLayoutEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";

import { IPaginationProp, IFilters } from "@interfaces";

import {
	getDatesFromParams,
	getPageNumberFromParams,
	cleanObject,
} from "utils";

interface IAdditionalParam {
	key: string;
	getValue?: (value: string) => any;
}

interface IUseListProps {
	pagination?: IPaginationProp;
	selected?: any[];
	setPagintation?: (pagination: any) => void;
	setSelected?: (selected: any) => void;
	params?: URLSearchParams;
	setParams?: (params: URLSearchParams) => void;
	defaultSort?: string;
	additionalFilters?: IAdditionalParam[];
	minSearchLength?: number;
}

export interface IUseListValues {
	Pagination: IPagination;
	setPagintation: (pagination: IPagination) => void;
	handlePageChange: (page: number) => void;
	Selected: any[];
	setSelected: (selected: any) => void;
	params: URLSearchParams;
	setParams: (params: URLSearchParams) => void;
	Filters: IFilters;
	setFilters: (filters: IFilters) => void;
	setFilter: (filter: string, value?: any, clearSelection?: boolean) => void;
	IsExporting: boolean;
	setIsExporting: (isExporting: boolean) => void;
	changeFilters: (filters: IFilters, resetPagination?: boolean) => void;
	getFiltersKeys: () => string[];
	getPaginationKeys: () => string[];
}

export const useList = <T>(props?: IUseListProps): IUseListValues => {
	const MIN_SEARCH_LENGTH = props?.minSearchLength || 3;
	const DEFAULT_SORT = props?.defaultSort || null;

	const [IsExporting, setIsExporting] = useState(false);

	const [params, setParams] = useSearchParams();

	const [Pagination, setPagintation] = useState({
		currentPage:
			props?.pagination?.currentPage ?? getPageNumberFromParams(params),
		totalCount: props?.pagination?.totalCount ?? 0,
		pageSize: props?.pagination?.pageSize ?? 50,
	});

	const [AdditionalFilters] = useState<IAdditionalParam[] | undefined>(
		props?.additionalFilters
	);

	const getAdditionalParams = useCallback(() => {
		if (!AdditionalFilters) return {};
		return AdditionalFilters?.reduce((acc: any, param) => {
			const value = params.get(param.key);

			if (value) {
				acc[param.key] = param.getValue ? param.getValue(value) : value;
			}
			return acc;
		}, {});
	}, [params, AdditionalFilters]);

	const [Filters, setFilters] = useState<IFilters>({
		status: params.get("status") || undefined,
		search: params.get("search") || undefined,
		sortType: params.get("sortType") || DEFAULT_SORT,
		...getDatesFromParams(params),
		...getAdditionalParams(),
	});

	const [Selected, setSelected] = useState<T[]>(props?.selected || []);

	const changeFilters = (
		filters: IFilters,
		resetPagination: boolean = true
	) => {
		const newFilters = {
			...Filters,
			...filters,
		};
		setFilters(newFilters);

		if (resetPagination)
			setPagintation({
				...Pagination,
				currentPage: 1,
			});
	};

	const setFilter = (
		filter: string,
		value?: object,
		clearSelection: boolean = true
	) => {
		if (clearSelection) setSelected([]);
		changeFilters({
			...Filters,
			[filter]: value,
		});
	};

	const getFiltersKeys = () => {
		const ret: string[] = [];
		Filters.status && ret.push(Filters.status ?? "all");
		Filters.search &&
			Filters?.search?.length >= MIN_SEARCH_LENGTH &&
			ret.push(Filters.search ?? "");
		Filters.sortType && ret.push(Filters.sortType ?? DEFAULT_SORT);
		Filters.dateBetweenName && ret.push(Filters.dateBetweenName ?? "");
		Filters.dateBetweenStart && ret.push(Filters.dateBetweenStart ?? "");
		Filters.dateBetweenEnd && ret.push(Filters.dateBetweenEnd ?? "");
		Object.keys(getAdditionalParams()).forEach((key) => {
			ret.push(Filters[key] ?? "");
		});

		return ret;
	};

	const getPaginationKeys = () => {
		return [
			Pagination.currentPage.toString(),
			Pagination.pageSize.toString(),
		];
	};

	const handlePageChange = (page: number) => {
		setPagintation({
			...Pagination,
			currentPage: page,
		});
	};

	useLayoutEffect(() => {
		const newPrams: any = {
			page:
				Pagination.currentPage > 1 ? Pagination.currentPage : undefined,
			status: Filters.status ?? undefined,
			search:
				Filters.search?.length >= MIN_SEARCH_LENGTH
					? Filters.search
					: undefined,
			sortType:
				Filters.sortType && Filters.sortType !== DEFAULT_SORT
					? Filters.sortType
					: undefined,
			dateBetweenName: Filters.dateBetweenName ?? undefined,
			dateBetweenStart: Filters.dateBetweenStart ?? undefined,
			dateBetweenEnd: Filters.dateBetweenEnd ?? undefined,
		};

		if (AdditionalFilters) {
			AdditionalFilters.forEach((param) => {
				newPrams[param.key] = Filters[param.key] ?? undefined;
			});
		}
		setParams(cleanObject(newPrams, true));
	}, [
		Pagination,
		Filters,
		setParams,
		DEFAULT_SORT,
		AdditionalFilters,
		getAdditionalParams,
		MIN_SEARCH_LENGTH,
	]);

	const values: IUseListValues = {
		Pagination,
		Selected,
		setPagintation,
		handlePageChange,
		setSelected,
		params,
		setParams,
		Filters,
		setFilters,
		setFilter,
		IsExporting,
		setIsExporting,
		changeFilters,
		getFiltersKeys,
		getPaginationKeys,
	};

	return values;
};
