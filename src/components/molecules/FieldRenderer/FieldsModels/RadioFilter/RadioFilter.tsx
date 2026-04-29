import React from "react";

import { useFormikField } from "@hooks/useFormikField";

import { Checkbox, ICheckboxProps, InputErrorMessage } from "@components/atoms";

export interface IRadioFilterProps extends Omit<
	ICheckboxProps,
	"checked" | "onChange"
> {
	name: string;
	options: { label: string; value: string }[];
	value?: string;
	onChange?: (name: string, value: string) => void;
	error?: string;
}

export const RadioFilter: React.FC<IRadioFilterProps> = ({
	name,
	options = [],
	value = "",
	onChange,
	...props
}) => {
	const { meta } = useFormikField(name);

	const handleChange = (optionValue: string) => {
		const newValue = optionValue === value ? "" : optionValue;
		onChange?.(name, newValue);
	};

	const error = meta?.touched && meta?.error ? meta.error : props.error;

	return (
		<div>
			<div className="flex flex-wrap gap-4">
				{options.map((option) => (
					<Checkbox
						onChange={() => handleChange(option.value)}
						{...props}
						indeterminate={true}
						type="radio"
						key={option.value}
						name={name}
						label={option.label}
						checked={option.value === value}
						error={error}
					/>
				))}
			</div>
			<InputErrorMessage>{error}</InputErrorMessage>
		</div>
	);
};
