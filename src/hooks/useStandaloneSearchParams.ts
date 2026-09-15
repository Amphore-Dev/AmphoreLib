import { useCallback, useState } from "react";

import { ISearchParamsAdapter } from "@interfaces/index";

const readParams = () =>
	new URLSearchParams(
		typeof window !== "undefined" ? window.location.search : ""
	);

/**
 * Default `ISearchParamsAdapter` — plain `window.location`/`history`, no
 * router dependency. An app already using react-router (or anything else)
 * can pass its own adapter with the same shape via `createFiltersContext`'s
 * `Provider`'s `adapterHook` prop instead.
 */
export const useStandaloneSearchParams = (): ISearchParamsAdapter => {
	// Only used to force a re-render after a direct history mutation below —
	// `window.location` itself isn't reactive state React can subscribe to.
	const [, forceRender] = useState(0);

	const getParam = useCallback(
		(key: string): string | undefined => readParams().get(key) ?? undefined,
		[]
	);

	const setParams = useCallback(
		(
			updater: (prev: URLSearchParams) => URLSearchParams,
			options?: { replace?: boolean }
		) => {
			if (typeof window === "undefined") return;

			const next = updater(readParams());
			const query = next.toString();
			const url = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;

			if (options?.replace ?? true) {
				window.history.replaceState(null, "", url);
			} else {
				window.history.pushState(null, "", url);
			}
			forceRender((n) => n + 1);
		},
		[]
	);

	return { getParam, setParams };
};
