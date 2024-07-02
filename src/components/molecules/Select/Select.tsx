import React, { useContext } from "react";

import { FormikContext, useField } from "formik";
import ReactSelect, { GroupBase, OnChangeValue, Props } from "react-select";

import { selectComponents } from "./components";

import "./Select.scss";

export interface ISelectProps<
	OptionType,
	IsMulti extends boolean = false,
	GroupType extends GroupBase<OptionType> = GroupBase<OptionType>,
> extends Props<OptionType, IsMulti, GroupType> {
	label: string;
	disabled?: boolean;
	onChange?: (value: OnChangeValue<OptionType, IsMulti>) => void;
}

export const Select = <
	OptionType,
	IsMulti extends boolean = false,
	GroupType extends GroupBase<OptionType> = GroupBase<OptionType>,
>({
	...props
}: ISelectProps<OptionType, IsMulti, GroupType>) => {
	const isInForm = !!useContext(FormikContext);
	const [field, meta, helpers] =
		props.name && isInForm
			? useField(props.name)
			: [undefined, undefined, undefined];

	const handleChange = (value: any) => {
		if (props.onChange) return props.onChange<any>(value);
		isInForm && field && helpers.setValue(value);
	};

	return (
		<ReactSelect
			components={{
				...selectComponents,
			}}
			{...props}
			onChange={handleChange}
			className="al_select"
		/>
	);
};
