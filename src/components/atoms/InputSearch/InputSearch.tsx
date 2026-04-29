import React, { useCallback, useEffect, useRef, useState } from "react";

import { ITextFieldProps, TextField } from "@components/molecules";

import { cn } from "@utils/cn";

import "./InputSearch.scss";

export interface IInputSearchProps extends Omit<ITextFieldProps, "onChange"> {
	onChange: (
		value: string | null,
		e?: React.ChangeEvent<HTMLInputElement>
	) => void;
	delay?: number;
	debounced?: boolean;
	minLength?: number;
	hasDefaultBorder?: boolean;
}

export const InputSearch: React.FC<IInputSearchProps> = ({
	onChange,
	delay = 500,
	debounced = true,
	minLength,
	hasDefaultBorder = false,
	...props
}) => {
	const [internalValue, setInternalValue] = useState<string | null>(null);
	const debounceTM = useRef<NodeJS.Timeout | null>(null);
	const debouncedSearch = useCallback((searchText: string | null) => {
		if (debounceTM.current) clearTimeout(debounceTM.current);
		debounceTM.current = setTimeout(() => {
			onChange(searchText);
		}, delay);
	}, []);

	const handleSearch = (searchText: string | null) => {
		setInternalValue(searchText);
		if (!!searchText && minLength && searchText.length < minLength) return;

		if (!debounced) {
			if (onChange) onChange(searchText);
			return;
		}
		debouncedSearch(searchText);
	};

	useEffect(() => {
		if (props.value !== internalValue) setInternalValue(props.value);
	}, [props.value]);

	return (
		<TextField
			picto={"search"}
			{...props}
			className={cn([props.className, "al__input-search"])}
			labelClassName="al__input-search__label"
			info={undefined}
			value={internalValue}
			onChange={(value) => handleSearch(value)}
			hasDefaultBorder={hasDefaultBorder}
		/>
	);
};
