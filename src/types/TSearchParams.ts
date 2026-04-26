export interface ISearchParamsAdapterOptions {
	replace?: boolean; // true = replaceState (default), false = pushState
}

export interface ISearchParamsAdapter {
	getParam: (key: string) => string | null;
	getAll: () => URLSearchParams;
	setParams: (
		updater: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams),
		options?: ISearchParamsAdapterOptions
	) => void;
}

export interface TLocation<State = unknown> {
	state: State;
	key: string;
	pathname: string;
	search: string;
	hash: string;
}
