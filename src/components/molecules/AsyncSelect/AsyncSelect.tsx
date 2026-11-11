import React, { useEffect, useRef, useState } from "react";

import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { genericForwardRef } from "@utils/UForwardRef";

import { TLabel, TSelectOption, TSelectOptionGroup } from "@interfaces/index";

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
	/** Shown in the listbox, in place of `noResultsMessage`, when the last `loadOptions` call failed and there is nothing to list. Defaults to "Could not load the options" (or `AsyncSelect.errorMessage` from the nearest AmphoreProvider). */
	errorMessage?: TLabel;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TAsyncSelectLabels = Pick<IAsyncSelectProps, "errorMessage">;

function AsyncSelectBase<T = string>(
	{
		loadOptions,
		debounce = 300,
		errorMessage: errorMessageProp,
		...selectProps
	}: IAsyncSelectProps<T>,
	ref: React.ForwardedRef<HTMLDivElement>
) {
	const { resolve } = useAmphoreLabels("AsyncSelect");
	const errorMessage = resolve("errorMessage", errorMessageProp);
	const [options, setOptions] = useState<
		TSelectOption<T>[] | TSelectOptionGroup<T>[]
	>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [failed, setFailed] = useState(false);
	const requestId = useRef(0);
	/** The query of the last load started: what the options stand for. */
	const lastQuery = useRef("");
	const failedRef = useRef(false);
	const debounceTimer = useRef<ReturnType<typeof setTimeout>>();
	const loadOptionsRef = useRef(loadOptions);
	loadOptionsRef.current = loadOptions;

	const runLoad = (query: string) => {
		const id = ++requestId.current;
		lastQuery.current = query;
		setIsLoading(true);
		loadOptionsRef.current(query).then(
			(result) => {
				// A newer request already started — this one's result is stale.
				if (id !== requestId.current) return;
				failedRef.current = false;
				setFailed(false);
				setOptions(result);
				setIsLoading(false);
			},
			() => {
				if (id !== requestId.current) return;
				// The options already shown stay (still better than nothing);
				// the failure is said when there are none, and the next
				// opening tries again.
				failedRef.current = true;
				setFailed(true);
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

	const handleOpenChange = (open: boolean) => {
		selectProps.onOpenChange?.(open);
		if (open) {
			// A failed load is not left for good: a request that failed once
			// (a dropped connection, a session being renewed) is tried again
			// the next time someone looks.
			if (failedRef.current) runLoad(lastQuery.current);
			return;
		}
		// Select clears its search on close: the options must follow, or
		// the next opening lists the last search's results under an empty
		// field.
		clearTimeout(debounceTimer.current);
		if (lastQuery.current !== "") runLoad("");
	};

	return (
		<Select
			{...(selectProps as ISelectProps<T>)}
			ref={ref}
			options={options}
			searchable
			filterOptions={false}
			isLoading={isLoading}
			onSearchChange={handleSearchChange}
			onOpenChange={handleOpenChange}
			noResultsMessage={
				failed ? errorMessage : selectProps.noResultsMessage
			}
		/>
	);
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
 *
 * A failed load says so (`errorMessage`) rather than "No results", and is
 * tried again when the listbox next opens. Closing reloads the unfiltered
 * options when a search was typed, since Select clears it.
 *
 * Native props and `ref` go where Select sends them.
 */
export const AsyncSelect = genericForwardRef(AsyncSelectBase, "AsyncSelect");
