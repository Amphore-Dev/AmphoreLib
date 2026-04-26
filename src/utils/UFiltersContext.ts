import { TFiltersSlice, TParamsCodecs } from "@interfaces/TFiltersContext";

export function applyDefaults<M extends Record<string, object>>(
	map: M,
	DEFAULTS: TFiltersSlice<object>
): { [K in keyof M]: TFiltersSlice<M[K]> } {
	const out = {} as { [K in keyof M]: TFiltersSlice<M[K]> };
	(Object.keys(map) as Array<keyof M>).forEach((k) => {
		out[k] = {
			...DEFAULTS,
			...map[k],
		};
	});
	return out;
}

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
