import React, { PropsWithChildren, ReactElement } from "react";

import { Tooltip as Tippy, TooltipProps } from "react-tippy";
// popper styles
import "react-tippy/dist/tippy.css";

import { cn } from "@utils/cn";

export interface ITooltipProps extends PropsWithChildren, TooltipProps {
	content: ReactElement;
}

export const Tooltip: React.FC<ITooltipProps> = ({
	children,
	content,
	...props
}) => {
	return (
		<Tippy
			html={content}
			arrow
			theme="light"
			animation="fade"
			{...props}
			className={cn(["w-fit !inline-block", props.className])}
		>
			{children}
		</Tippy>
	);
};
