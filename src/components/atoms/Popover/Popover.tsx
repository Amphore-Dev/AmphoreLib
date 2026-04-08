import React, { forwardRef } from "react";

import { ITooltipProps, Tooltip } from "../Tooltip/Tooltip";

import { cn } from "@utils/cn";

import "./Popover.scss";

export const Popover = forwardRef<HTMLDivElement, ITooltipProps>(
	(
		{
			trigger = "click",
			closeOnLeave = false,
			closeOnClick = false,
			className,
			...props
		},
		ref
	) => {
		return (
			<Tooltip
				trigger={trigger}
				closeOnLeave={
					trigger === "hover" && !closeOnLeave ? false : closeOnLeave
				}
				closeOnClick={closeOnClick}
				className={cn(["amphorelib__popover", className])}
				ref={ref}
				{...props}
			>
				{props.children}
			</Tooltip>
		);
	}
);

Popover.displayName = "Popover";
