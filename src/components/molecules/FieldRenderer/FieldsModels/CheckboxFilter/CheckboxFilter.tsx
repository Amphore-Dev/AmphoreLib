import React from "react";

import { useFormikField } from "@hooks/useFormikField";

import { Checkbox, ICheckboxProps, InputErrorMessage } from "@components/atoms";

export interface ICheckboxesFilterProps extends Omit<
	ICheckboxProps,
	"checked" | "onChange"
> {
	name: string;
	options: { label: string; value: string }[];
	value?: string[];
	onChange?: (name: string, value: string[]) => void;
	error?: string;
}

export const CheckboxFilter: React.FC<ICheckboxesFilterProps> = ({
	name,
	options = [],
	value = [],
	onChange,
	...props
}) => {
	const currentValue = value || [];
	const { meta } = useFormikField(name);

	const handleChange = (optionValue: string) => {
		const newValue = currentValue.includes(optionValue)
			? currentValue.filter((v) => v !== optionValue)
			: [...currentValue, optionValue];

		onChange?.(name, newValue);
	};

	const error = meta?.touched && meta?.error ? meta.error : props.error;

	return (
		<div>
			<div className="flex flex-wrap gap-x-4 gap-y-2">
				{options.map((option) => (
					<Checkbox
						onChange={() => handleChange(option.value)}
						{...props}
						key={option.value}
						label={option.label}
						name={name}
						checked={currentValue.includes(option.value)}
						error={error}
					/>
				))}
			</div>
			<InputErrorMessage>{error}</InputErrorMessage>
		</div>
	);
};
