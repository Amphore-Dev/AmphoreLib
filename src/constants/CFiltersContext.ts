import {
	TCommonFilters,
	TDatesFilter,
	TPaginationFilters,
	TSearchFilter,
	TSortFilter,
} from "@interfaces/TFiltersContext";

export const DEFAULT_PAGINATION_FILTERS: TPaginationFilters = {
	page: 1,
	limit: 30,
	total: 0,
};

export const DEFAULT_SEARCH_FILTERS: TSearchFilter = {
	search: "",
};

export const DEFAULT_SORT_FILTERS: TSortFilter = {
	sortOrder: "asc",
	sortType: "",
};

export const DEFAULT_COMMON_FILTERS: TCommonFilters = {
	count: 0,
};

export const DEFAULT_DATE_FILTERS: TDatesFilter = {
	startDate: undefined,
	endDate: undefined,
};

export const DEFAULT_FILTERS = {
	...DEFAULT_DATE_FILTERS,
	...DEFAULT_PAGINATION_FILTERS,
	...DEFAULT_SEARCH_FILTERS,
	...DEFAULT_SORT_FILTERS,
	...DEFAULT_COMMON_FILTERS,
};

export const MIN_SEARCH_LENGTH = 3;
