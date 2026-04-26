import { useContext, useEffect, useRef } from "react";

import { FiltersCtxValue } from "@contexts/FiltersContext/FiltersContext";
import {
	IUseFiltersContext,
	TFiltersContextOptions,
	TFiltersSlice,
	TPaginationFilters,
	TParamsCodecs,
} from "@interfaces/TFiltersContext";

import { cleanSlice, genFiltersParams } from "@utils/UFiltersContext";

export const useFiltersContext = <
	T extends Record<PropertyKey, TFiltersSlice<object>>,
	K extends keyof T,
>(
	_context: React.Context<FiltersCtxValue<T> | null>,
	filtersKey: K,
	localOptions: TFiltersContextOptions<T[K]> = {}
): IUseFiltersContext<T, K> => {
	type TSlice = T[K];

	const didInit = useRef(false);

	const context = useContext(_context);

	if (!context)
		throw new Error("useFilters must be used within a FiltersProvider");
	if (!filtersKey) throw new Error("filtersKey must be provided");

	const contextDefaultFilters = context.defaultFilters;
	const sliceDefaultFilters = contextDefaultFilters[filtersKey];
	const urlsParamsAdapter = context.adapter;

	const options = {
		...context.options,
		...localOptions,
		defaultValues: {
			...sliceDefaultFilters,
			...context.options?.defaultValues,
			...localOptions.defaultValues,
		},
	};

	const getFilters = () => {
		const savedFilters = context.filters[filtersKey];

		const sliceFilters = sliceDefaultFilters;

		const ret: TSlice = {
			count: 0,
			...sliceFilters,
			...options?.defaultValues,
			...cleanSlice(sliceFilters, savedFilters),
		};
		return ret;
	};

	const setFilters = (
		next: TSlice | ((prev: TSlice) => TSlice),
		replace = false,
		fromSetPagination = false
	) => {
		context.setFilters((prevAll: T) => {
			const prevFull = {
				...prevAll[filtersKey],
			};
			const updated = typeof next === "function" ? next(prevFull) : next;
			const nextFull = replace
				? { ...updated }
				: { ...prevFull, ...updated };

			if (options?.countCallback) {
				nextFull.count = options.countCallback(nextFull);
			}

			if (options?.resetPageOnChange !== false && !fromSetPagination) {
				nextFull.page = 1;
			}

			return { ...prevAll, [filtersKey]: nextFull };
		});
	};

	const setFilter = <SK extends keyof TSlice>(key: SK, value: TSlice[SK]) =>
		setFilters((prev) => ({ ...prev, [key]: value }));

	const setCount = (newCount: number) =>
		setFilters((prev) => ({ ...prev, count: newCount }));

	const getPagination = () => {
		const { page, limit, total } = getFilters();
		return { page, limit, total } as Partial<TPaginationFilters>;
	};

	const setPagination = (pagination: Partial<TPaginationFilters>) => {
		setFilters((prev) => ({ ...prev, ...pagination }), false, true);
	};

	const getParams = (_filters?: TSlice) => {
		const filters = _filters || getFilters();
		return genFiltersParams(filters, {
			page: true,
			limit: true,
			...((options?.params || {}) as Partial<TParamsCodecs<TSlice>>),
		});
	};

	const getQueryKeys = (filters?: TSlice) => {
		const params = getParams(filters);
		return Object.entries(params).map(([key, value]) => {
			return `${key}=${encodeURIComponent(value)}`;
		});
	};

	// 1) INIT: charge depuis l'URL -> setFilters uniquement si nécessaire
	useEffect(() => {
		if (didInit.current) return;
		if (options?.skipInitFromUrl) {
			didInit.current = true;
			return;
		}

		const slice = getFilters();
		const enabled = (options?.params ?? {}) as Partial<
			TParamsCodecs<TSlice>
		>;
		const fromUrl: Partial<TSlice> = {};
		let hadAnyManaged = false;

		if (options?.updateUrlParams)
			for (const stateKey of Object.keys(slice) as (keyof TSlice)[]) {
				const cfg = enabled[stateKey];
				const urlKey =
					cfg && typeof cfg === "object" && cfg.key
						? cfg.key
						: String(stateKey);

				const raw = urlsParamsAdapter?.getParam(urlKey);
				if (raw == null || String(stateKey) === "count") continue;

				const decoded =
					cfg && typeof cfg === "object" && cfg.set
						? cfg.set(raw)
						: raw;

				if (decoded !== undefined) {
					fromUrl[stateKey] = decoded as TSlice[typeof stateKey];
					if (cfg) hadAnyManaged = true;
				}
			}

		const next = { ...slice };
		const defaults = (options?.defaultValues ?? {}) as Partial<TSlice>;

		for (const k of Object.keys(slice) as (keyof TSlice)[]) {
			const vFromUrl = fromUrl[k];
			const vDefault = defaults[k];
			if (k in fromUrl && vFromUrl !== undefined) {
				next[k] = vFromUrl;
			} else if (k in defaults && vDefault !== undefined) {
				next[k] = vDefault;
			}
		}

		if (options?.countCallback) {
			next.count = options.countCallback(next);
		}

		setFilters(next, true);

		if (!hadAnyManaged && options?.updateUrlParams) {
			const nextParams = genFiltersParams(next, options?.params);
			const managedKeys = new Set(
				(Object.keys(enabled) as (keyof TSlice)[]).map((k) => {
					const cfg = enabled[k];
					return typeof cfg === "object" && cfg.key ? cfg.key : k;
				})
			);

			urlsParamsAdapter?.setParams(
				(prev) => {
					const merged = new URLSearchParams(prev);
					for (const key of Array.from(merged.keys())) {
						if (managedKeys.has(key)) merged.delete(key);
					}
					for (const [k, v] of Object.entries(nextParams)) {
						merged.set(k, String(v));
					}
					return merged;
				},
				{ replace: true }
			);
		}

		setTimeout(() => {
			didInit.current = true;
		}, 500);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// 2) SYNC URL <- filters
	useEffect(() => {
		if (!didInit.current || !options?.updateUrlParams) return;

		const filters = getFilters();
		const nextParams = genFiltersParams(filters, options?.params);

		const enabled = (options?.params ?? {}) as Partial<
			TParamsCodecs<TSlice>
		>;
		const managed = new Set(
			(Object.keys(enabled) as (keyof TSlice)[]).map((k) => {
				const cfg = enabled[k];
				return typeof cfg === "object" && cfg.key ? cfg.key : k;
			})
		);

		urlsParamsAdapter?.setParams(
			(prev) => {
				const merged = new URLSearchParams(prev);
				for (const k of Array.from(merged.keys())) {
					if (managed.has(k)) merged.delete(k);
				}
				for (const [k, v] of Object.entries(nextParams)) {
					merged.set(k, String(v));
				}

				return merged;
			},
			{ replace: true }
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [context.filters[filtersKey]]);

	return {
		filters: getFilters(),
		filtersKey,
		getPagination,
		setPagination,
		getParams,
		setFilters,
		setFilter,
		count: getFilters()?.count ?? 0,
		options: options as TFiltersContextOptions<TSlice>,
		setCount,
		getQueryKeys,
		fieldRenderers: context.fieldRenderers,
	};
};
