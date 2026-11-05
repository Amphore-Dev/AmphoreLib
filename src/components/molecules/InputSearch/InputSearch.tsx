import React, { forwardRef, useEffect, useRef, useState } from "react";

import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import type { TLabel } from "@interfaces/index";

import { IInputProps, Input } from "../../atoms/Input/Input";

export interface IInputSearchProps extends Omit<
	IInputProps,
	"onChange" | "picto"
> {
	onChange: (value: string) => void;
	/** Debounce delay in ms. Defaults to 500. */
	delay?: number;
	/** Debounces `onChange`. Set `false` to fire on every keystroke. Defaults to true. */
	debounced?: boolean;
	/** Below this length, typing updates the field but doesn't call `onChange` yet. */
	minLength?: number;
	/** aria-label when neither `label` nor `placeholder` names the field: a search box often shows only its icon. Defaults to "Search" (or `InputSearch.searchLabel` from the nearest AmphoreProvider — see useAmphoreLabels). */
	searchLabel?: TLabel;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TInputSearchLabels = Pick<IInputSearchProps, "searchLabel">;

const InputSearchBase: React.ForwardRefRenderFunction<
	HTMLInputElement,
	IInputSearchProps
> = (
	{
		value = "",
		onChange,
		delay = 500,
		debounced = true,
		minLength = 0,
		isClearable = true,
		searchLabel: searchLabelProp,
		...props
	},
	ref
) => {
	const { resolve } = useAmphoreLabels("InputSearch");
	const searchLabel = resolve("searchLabel", searchLabelProp);
	const [internalValue, setInternalValue] = useState(value);
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;

	useEffect(() => {
		setInternalValue(value);
	}, [value]);

	useEffect(() => () => clearTimeout(timeoutRef.current), []);

	const handleChange = (next: string) => {
		setInternalValue(next);
		if (next.length > 0 && next.length < minLength) return;

		clearTimeout(timeoutRef.current);
		if (!debounced) {
			onChangeRef.current(next);
			return;
		}
		timeoutRef.current = setTimeout(() => onChangeRef.current(next), delay);
	};

	return (
		<Input
			aria-label={
				props.label || props.placeholder ? undefined : searchLabel
			}
			{...props}
			ref={ref}
			isClearable={isClearable}
			value={internalValue}
			onChange={handleChange}
			picto="search"
		/>
	);
};

/**
 * V2 InputSearch — a debounced `Input` preset (search picto, `isClearable`
 * on by default). Keeps its own `internalValue` so the field responds
 * instantly to typing while `onChange` (the actual search trigger) fires
 * debounced — same split as v1, minus its Formik-era `TextField` plumbing.
 *
 * Native props and `ref` go where Input sends them.
 */
export const InputSearch = forwardRef(InputSearchBase);
InputSearch.displayName = "InputSearch";
