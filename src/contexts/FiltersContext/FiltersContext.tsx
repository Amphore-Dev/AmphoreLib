import * as React from "react";

import { DEFAULT_FILTERS } from "@constants/CFiltersContext";
import {
	IUseFiltersContext,
	TFieldRendererMap,
	TFiltersContextOptions,
	TFiltersSlice,
} from "@interfaces/TFiltersContext";

import { ISearchParamsAdapter } from "@interfaces/TSearchParams";

import { useStandaloneSearchParams } from "@hooks/useStandaloneSearchParams";
import { useFiltersContext } from "@hooks/useFiltersContext";

import { applyDefaults } from "@utils/UFiltersContext";

export type FiltersCtxValue<F extends TFiltersSlice<object>> = {
	filters: F;
	setFilters: React.Dispatch<React.SetStateAction<F>>;
	defaultFilters: F;
	adapter?: ISearchParamsAdapter;
	options?: TFiltersContextOptions<TFiltersSlice<object>>;
	fieldRenderers?: Partial<TFieldRendererMap>;
};

export type TCreatedFiltersContext<
	T extends Record<PropertyKey, TFiltersSlice<object>>,
> = {
	Provider: React.FC<FiltersProviderProps<T>>;
	useFiltersContext: <SK extends keyof T>(
		filtersKey: SK,
		options?: Partial<TFiltersContextOptions<T[SK]>>
	) => IUseFiltersContext<T, SK>;
};

type FiltersProviderProps<T extends TFiltersSlice<object>> =
	React.PropsWithChildren<{
		defaultFilters: T;
		storageKey?: string;
		adapterHook?: ISearchParamsAdapter;
		options?: TFiltersContextOptions<TFiltersSlice<object>>;
		fieldRenderers?: Partial<TFieldRendererMap>;
	}>;

export function createFiltersContext<
	T extends Record<PropertyKey, TFiltersSlice<object>>,
>() {
	const Ctx = React.createContext<FiltersCtxValue<T> | null>(null);

	const Provider: React.FC<FiltersProviderProps<T>> = ({
		defaultFilters,
		storageKey = "FiltersContext",
		adapterHook = useStandaloneSearchParams(),
		options,
		children,
		fieldRenderers,
	}) => {
		const _defaultFilters = applyDefaults(defaultFilters, DEFAULT_FILTERS);

		const [filters, setFilters] = React.useState<T>(() => {
			const raw = sessionStorage.getItem(storageKey);
			const saved = raw ? (JSON.parse(raw) as Partial<T>) : {};
			return { ..._defaultFilters, ...saved } as T;
		});

		React.useEffect(() => {
			sessionStorage.setItem(storageKey, JSON.stringify(filters));
		}, [filters, storageKey]);

		const value = React.useMemo(
			() => ({
				filters,
				setFilters,
				defaultFilters: _defaultFilters,
				adapter: adapterHook,
				options,
				fieldRenderers,
			}),
			[filters, _defaultFilters, adapterHook, options, fieldRenderers]
		);

		return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
	};

	const useFilters = <SK extends keyof T>(
		filtersKey: SK,
		options?: Partial<TFiltersContextOptions<T[SK]>>
	) => useFiltersContext<T, SK>(Ctx, filtersKey, options);

	return {
		Provider,
		useFiltersContext: useFilters,
	} as TCreatedFiltersContext<T>;
}
