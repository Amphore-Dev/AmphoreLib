import * as React from "react";

import { DEFAULT_FILTERS } from "@constants/index";

import { useFiltersContext } from "@hooks/useFiltersContext";
import { useStandaloneSearchParams } from "@hooks/useStandaloneSearchParams";

import { applyDefaults } from "@utils/UFiltersContext";

import {
	IUseFiltersContext,
	ISearchParamsAdapter,
	TFieldRendererMap,
	TFiltersContextOptions,
	TFiltersSlice,
} from "@interfaces/index";

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
		/** Persistence key. Omit to skip persistence entirely. */
		storageKey?: string;
		/** "local" persists across tabs/reloads, "session" only across reloads in the same tab. */
		storage?: "session" | "local";
		adapterHook?: ISearchParamsAdapter;
		options?: TFiltersContextOptions<TFiltersSlice<object>>;
		fieldRenderers?: Partial<TFieldRendererMap>;
	}>;

/** Reads a persisted slice; returns `null` on any failure (SSR, storage blocked/full, corrupt JSON) instead of throwing. */
const readStorage = (
	webStorage: Storage | undefined,
	storageKey: string
): unknown => {
	if (!webStorage) return null;
	try {
		const raw = webStorage.getItem(storageKey);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
};

/** Persists a slice; silently no-ops on failure (SSR, private-browsing quota, storage blocked). */
const writeStorage = (
	webStorage: Storage | undefined,
	storageKey: string,
	value: unknown
): void => {
	if (!webStorage) return;
	try {
		webStorage.setItem(storageKey, JSON.stringify(value));
	} catch {
		// see above — a full/blocked storage shouldn't break filtering itself
	}
};

const getWebStorage = (storage: "session" | "local"): Storage | undefined => {
	if (typeof window === "undefined") return undefined;
	try {
		return storage === "local"
			? window.localStorage
			: window.sessionStorage;
	} catch {
		return undefined;
	}
};

/**
 * Creates one `{Provider, useFiltersContext}` pair per app instead of a
 * single hardcoded global context — several independently-typed filter
 * slices (e.g. `planning`, `orders`) can share one Provider, each reached
 * via its own key.
 */
export function createFiltersContext<
	T extends Record<PropertyKey, TFiltersSlice<object>>,
>() {
	const Ctx = React.createContext<FiltersCtxValue<T> | null>(null);

	const Provider: React.FC<FiltersProviderProps<T>> = ({
		defaultFilters,
		storageKey = "FiltersContext",
		storage = "session",
		adapterHook,
		options,
		children,
		fieldRenderers,
	}) => {
		// `useStandaloneSearchParams()` can't be the prop's own default value
		// (that would call the hook conditionally, breaking rules-of-hooks the
		// moment a consumer ever passes their own `adapterHook`) — called
		// unconditionally here instead, and only used when no override is given.
		const standaloneAdapter = useStandaloneSearchParams();
		const adapter = adapterHook ?? standaloneAdapter;

		const webStorage = React.useMemo(
			() => (storageKey ? getWebStorage(storage) : undefined),
			[storage, storageKey]
		);
		const defaultFiltersMerged = React.useMemo(
			() => applyDefaults(defaultFilters, DEFAULT_FILTERS),
			[defaultFilters]
		);

		const [filters, setFilters] = React.useState<T>(() => {
			const saved = storageKey
				? (readStorage(webStorage, storageKey) as Partial<T> | null)
				: null;
			return { ...defaultFiltersMerged, ...saved } as T;
		});

		React.useEffect(() => {
			if (!storageKey) return;
			writeStorage(webStorage, storageKey, filters);
		}, [filters, storageKey, webStorage]);

		const value = React.useMemo(
			() => ({
				filters,
				setFilters,
				defaultFilters: defaultFiltersMerged,
				adapter,
				options,
				fieldRenderers,
			}),
			[filters, defaultFiltersMerged, adapter, options, fieldRenderers]
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
