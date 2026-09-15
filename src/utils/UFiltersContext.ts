import { TFiltersSlice, TParamsCodecs } from "@interfaces/index";

/** Merges `DEFAULTS` under every slice in `map`, letting each slice's own values override. */
export function applyDefaults<M extends Record<string, object>>(
	map: M,
	DEFAULTS: TFiltersSlice<object>
): { [K in keyof M]: TFiltersSlice<M[K]> } {
	const out = {} as { [K in keyof M]: TFiltersSlice<M[K]> };
	(Object.keys(map) as Array<keyof M>).forEach((k) => {
		out[k] = {
			...DEFAULTS,
			...map[k],
		} as TFiltersSlice<M[typeof k]>;
	});
	return out;
}

/** Keeps only the keys `defaultSliceFilters` declares — drops any stale/unknown key a saved slice might carry. */
export const cleanSlice = <S extends object>(
	defaultSliceFilters = {} as S,
	sliceFilters = {} as S
) => {
	if (!sliceFilters) return defaultSliceFilters;
	const out = {} as Partial<S>;
	for (const key of Object.keys(defaultSliceFilters) as (keyof S)[]) {
		if (key in sliceFilters) out[key] = sliceFilters[key];
	}
	return out;
};

/** Encodes a filters slice into URL params, using each key's codec (`true` = raw value, or a `{get,set,key}` accessor). Only declared keys are emitted. */
export const genFiltersParams = <S extends TFiltersSlice<object>>(
	filters: S,
	paramsCodecs?: Partial<TParamsCodecs<S>>
) => {
	const enabled = paramsCodecs ?? ({} as Partial<TParamsCodecs<S>>);
	const out: Record<string, string> = {};

	for (const stateKey of Object.keys(filters) as (keyof S)[]) {
		const cfg = enabled[stateKey];
		if (!cfg) continue;

		const urlKey =
			typeof cfg === "object" && cfg.key ? cfg.key : String(stateKey);

		const value = filters[stateKey];
		const encoded =
			typeof cfg === "object" && cfg.get
				? cfg.get(value)
				: typeof cfg === "object" && cfg.key
					? value
					: cfg === true
						? value
						: undefined;

		if (
			encoded !== null &&
			encoded !== undefined &&
			String(encoded) !== ""
		) {
			out[urlKey] = String(encoded);
		}
	}

	return Object.fromEntries(
		Object.entries(out).sort(([a], [b]) => a.localeCompare(b))
	);
};
