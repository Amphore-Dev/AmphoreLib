import type { ISearchParamsAdapter } from "@interfaces/TSearchParams";

type StandaloneSetOptions = {
	replace?: boolean; // default: true
	state?: unknown;
};

export function useStandaloneSearchParams(): ISearchParamsAdapter {
	const getParam = (key: string) =>
		new URLSearchParams(window.location.search).get(key);

	const getAll = () => new URLSearchParams(window.location.search);

	const setParams: ISearchParamsAdapter["setParams"] = (
		updater,
		options: StandaloneSetOptions = { replace: true }
	) => {
		const prev = getAll();
		const next = typeof updater === "function" ? updater(prev) : updater;

		const url = new URL(window.location.href);
		url.search = next.toString();

		const nextState = Object.prototype.hasOwnProperty.call(options, "state")
			? options.state
			: window.history.state;

		if (options.replace ?? true) {
			window.history.replaceState(nextState, "", url.toString());
		} else {
			window.history.pushState(nextState, "", url.toString());
		}
	};

	return { getParam, getAll, setParams };
}
