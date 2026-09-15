/**
 * Router-agnostic URL search-params adapter — `createFiltersContext`'s
 * `Provider` reads/writes URL state through this interface, never a
 * specific router. The default implementation
 * (`useStandaloneSearchParams`) works over plain `window.location`/
 * `history`; an app using react-router (or anything else) can supply its
 * own adapter with the same shape via the `adapterHook` prop.
 */
export interface ISearchParamsAdapter {
	getParam: (key: string) => string | undefined;
	setParams: (
		updater: (prev: URLSearchParams) => URLSearchParams,
		options?: { replace?: boolean }
	) => void;
}
