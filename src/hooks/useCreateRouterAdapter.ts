import type {
	ISearchParamsAdapter,
	TLocation,
} from "@interfaces/TSearchParams";

export function useCreateRouterAdapter(
	tuple: readonly [
		URLSearchParams,
		(next: URLSearchParams, options?: { replace?: boolean }) => void,
	],
	locationHook: () => Partial<TLocation> = () => ({})
): ISearchParamsAdapter {
	const [searchParams, setSearchParams] = tuple;

	const location = locationHook();
	return {
		getParam: (key) => searchParams.get(key),
		getAll: () => new URLSearchParams(searchParams),
		setParams: (updater, { replace = true } = {}) => {
			const prev = new URLSearchParams(searchParams);
			const next =
				typeof updater === "function" ? updater(prev) : updater;

			setSearchParams(next, { ...location, replace });
		},
	};
}
