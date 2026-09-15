import { TDefaultFilters } from "@interfaces/index";

/** Baseline every filters slice starts from before its own app-specific defaults are merged in. */
export const DEFAULT_FILTERS: TDefaultFilters = {
	count: 0,
	page: 1,
	limit: 20,
};
