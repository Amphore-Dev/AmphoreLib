import React, { useEffect, useRef, useState } from "react";

import { TSelectOption, TSelectOptionGroup } from "@interfaces/index";

import { ISelectProps, Select } from "../Select/Select";

export interface IAsyncSelectProps<T = string> extends Omit<
	ISelectProps<T>,
	"options" | "searchable" | "onSearchChange" | "filterOptions" | "isLoading"
> {
	/** Fetches options for a given search query (`""` on initial load) — flat or grouped. */
	loadOptions: (
		query: string
	) => Promise<TSelectOption<T>[] | TSelectOptionGroup<T>[]>;
	/** Debounce delay (ms) before calling `loadOptions` on each keystroke. Defaults to 300. */
	debounce?: number;
}

/**
 * V2 AsyncSelect — a thin wrapper around Select for remote-loaded options.
 * v1's version was built on a completely different library (react-select's
 * own `Async`) with a Formik `useField` call made *conditionally* — a real
 * Rules-of-Hooks violation flagged in memory/react-library-fields-audit.md.
 * This one is Select all the way down: no ambient form-library awareness,
 * `filterOptions={false}` (loadOptions is trusted to return already-
 * relevant results, not filtered again client-side), and a ref-counted
 * request guard so a slow, stale response can never clobber a newer one.
 */
export function AsyncSelect<T = string>({
	loadOptions,
	debounce = 300,
	...selectProps
}: IAsyncSelectProps<T>) {
	const [options, setOptions] = useState<
		TSelectOption<T>[] | TSelectOptionGroup<T>[]
	>([]);
	const [isLoading, setIsLoading] = useState(false);
	const requestId = useRef(0);
	const debounceTimer = useRef<ReturnType<typeof setTimeout>>();
	const loadOptionsRef = useRef(loadOptions);
	loadOptionsRef.current = loadOptions;

	const runLoad = (query: string) => {
		const id = ++requestId.current;
		setIsLoading(true);
		loadOptionsRef.current(query).then(
			(result) => {
				// A newer request already started — this one's result is stale.
				if (id !== requestId.current) return;
				setOptions(result);
				setIsLoading(false);
			},
			() => {
				if (id !== requestId.current) return;
				setIsLoading(false);
			}
		);
	};

	// Initial load, once.
	useEffect(() => {
		runLoad("");
		// eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally once on mount, not on every loadOptions identity change
	}, []);

	useEffect(() => () => clearTimeout(debounceTimer.current), []);

	const handleSearchChange = (query: string) => {
		clearTimeout(debounceTimer.current);
		debounceTimer.current = setTimeout(() => runLoad(query), debounce);
	};

	return (
		<Select
			{...selectProps}
			options={options}
			searchable
			filterOptions={false}
			isLoading={isLoading}
			onSearchChange={handleSearchChange}
		/>
	);
}
