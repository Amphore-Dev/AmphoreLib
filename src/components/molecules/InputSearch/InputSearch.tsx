import React, { useEffect, useRef, useState } from "react";

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
}

/**
 * V2 InputSearch — a debounced `Input` preset (search picto, `isClearable`
 * on by default). Keeps its own `internalValue` so the field responds
 * instantly to typing while `onChange` (the actual search trigger) fires
 * debounced — same split as v1, minus its Formik-era `TextField` plumbing.
 */
export const InputSearch: React.FC<IInputSearchProps> = ({
	value = "",
	onChange,
	delay = 500,
	debounced = true,
	minLength = 0,
	isClearable = true,
	...props
}) => {
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
			{...props}
			isClearable={isClearable}
			value={internalValue}
			onChange={handleChange}
			picto="search"
		/>
	);
};
