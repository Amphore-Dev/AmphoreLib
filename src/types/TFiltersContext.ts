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

/** `true` means "use the raw value as-is"; an object customizes the URL key/encoding/decoding. */
export type TParamCodec<V> = true | TParamsAccessors<V>;

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
