import React, { useContext } from "react";

import { FormikContext, useField } from "formik";
import { components } from "react-select";

import { InfoMessage } from "@components/molecules/InfoMessage/InfoMessage";

import { cn } from "@utils/cn";

// nsm typing react-select is too hard
// eslint-disable-next-line
export const SelectContainer: React.FC<any> = ({ children, ...props }) => {
	const isInForm = !!useContext(FormikContext);
	const { name } = props.selectProps;

	const [, meta] =
		name && isInForm ? useField(name) : [undefined, undefined, undefined];

	return (
		<components.SelectContainer {...props}>
			{children}
			{meta?.error && (
				<InfoMessage
					type="error"
					className={cn([!props.required ? "mt-2" : "mt-1"])}
				>
					{meta.error}
				</InfoMessage>
			)}
		</components.SelectContainer>
	);
};
