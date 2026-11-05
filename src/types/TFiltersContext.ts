import { TFieldRendererMap } from "./TFields";

export type TPaginationResponse<T> = {
	page: number;
	items: T[];
	total: number;
	limit: number;
};

export type TDatesFilter = {
	startDate?: string;
	endDate?: string;
};

export type TPaginationFilters = {
	page?: number;
	limit?: number;
	total?: number;
};

export type TSearchFilter = {
	search?: string;
};

export type TStatusFilter = {
	status?: string | null;
};

export type TSortOrder = "asc" | "desc";

export type TSortFilter = {
	sortOrder?: TSortOrder;
	sortType?: string;
};

export type TCommonFilters = {
	count?: number;
};

export type TDefaultFilters = TCommonFilters &
	TDatesFilter &
	TPaginationFilters &
	TSearchFilter &
	TStatusFilter &
	TSortFilter;

export type TFiltersSlice<S> = TDefaultFilters & S;

export type TParamsAccessors<S> = {
	get?: (value: S) => string | undefined;
	set?: (value: string) => Partial<S> | null;
	key?: string;
};

/**
 * How one state key relates to the URL:
 * - `true`: written and read as-is;
 * - an object: customizes the URL key/encoding/decoding;
 * - `false`: managed, but kept out of the URL. Never written, never read, and
 *   removed from the URL on every sync (a param another screen left behind,
 *   say), where a key left out of `params` is not touched at all.
 */
export type TParamCodec<V> = boolean | TParamsAccessors<V>;

export type TParamsCodecs<S extends object> = {
	[P in keyof S]?: TParamCodec<S[P]>;
};

export type TFiltersContextOptions<S extends object> = {
	countCallback?: (filters: S) => number;
	defaultValues?: Partial<S>;
	params?: Partial<TParamsCodecs<S>>;
	resetPageOnChange?: boolean;
	updateUrlParams?: boolean;
	skipInitFromUrl?: boolean;
};

export interface IUseFiltersContext<T, K extends keyof T, S = T[K]> {
	filters: S;
	filtersKey: K;
	setFilters: (
		newFilters: S,
		replace?: boolean,
		fromSetPagination?: boolean
	) => void;
	setFilter: <SK extends keyof S>(key: SK, value: S[SK]) => void;
	getPagination: () => Partial<TPaginationFilters>;
	setPagination: (pagination: Partial<TPaginationFilters>) => void;
	count: number;
	setCount: (newCount: number) => void;
	getParams: (filters?: S) => Record<string, string>;
	getQueryKeys: (filters?: S) => string[];
	options?: TFiltersContextOptions<TFiltersSlice<S>>;
	fieldRenderers?: Partial<TFieldRendererMap>;
}
