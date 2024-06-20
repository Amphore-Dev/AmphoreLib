import React, { InputHTMLAttributes } from "react";

import { Checkbox } from "@components/atoms";

export interface IRadioProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
}

export const Radio: React.FC<IRadioProps> = ({ label, ...props }) => {
	return <Checkbox {...props} label={label} type="radio" indeterminate />;
};
