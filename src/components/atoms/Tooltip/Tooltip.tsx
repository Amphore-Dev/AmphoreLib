import React, { PropsWithChildren, ReactElement } from "react";

import { Tooltip as Tippy, TooltipProps } from "react-tippy";
// popper styles
import "react-tippy/dist/tippy.css";

export interface ITooltipProps extends PropsWithChildren, TooltipProps {
	content: ReactElement;
}

export const Tooltip: React.FC<ITooltipProps> = ({
	children,
	content,
	...props
}) => {
	return (
		// @ts-ignore - html prop is not recognized (??)
		<Tippy html={content} arrow theme="light" animation="fade" {...props}>
			{children}
		</Tippy>
	);
};
