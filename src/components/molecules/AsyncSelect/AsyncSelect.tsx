import React, { useContext } from "react";

import { FormikContext, useField } from "formik";
import { GroupBase, OnChangeValue } from "react-select";
import Async, { AsyncProps } from "react-select/async";

import { ISelectProps } from "../Select/Select";
import { selectComponents } from "../Select/components";

import { cn } from "@utils/cn";

import "../Select/Select.scss";

export interface IAsyncSelectProps<
	OptionType,
	IsMulti extends boolean = false,
	GroupType extends GroupBase<OptionType> = GroupBase<OptionType>,
> extends AsyncProps<OptionType, IsMulti, GroupType>,
		ISelectProps<OptionType, IsMulti, GroupType> {
	onChange?: (value: OnChangeValue<OptionType, IsMulti>) => void;
}

export const AsyncSelect = <
	OptionType,
	IsMulti extends boolean = false,
	GroupType extends GroupBase<OptionType> = GroupBase<OptionType>,
>({
	...props
}: IAsyncSelectProps<OptionType, IsMulti, GroupType>) => {
	const isInForm = !!useContext(FormikContext);
	const [field, , helpers] =
		props.name && isInForm
			? useField(props.name)
			: [undefined, undefined, undefined];

	const handleChange = (value: OnChangeValue<OptionType, IsMulti>) => {
		if (props.onChange) return props.onChange(value);
		isInForm && field && helpers.setValue(value);
	};

	return (
		<Async
			{...props}
			components={{
				...selectComponents,
				...props.components,
			}}
			className={cn(["al_select al_async_select", props.className])}
			onChange={handleChange}
		/>
	);
};
