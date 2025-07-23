import React, { forwardRef } from "react";

import { ITooltipProps, Tooltip } from "../Tooltip/Tooltip";

import { cn } from "@utils/cn";

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
				className={cn(["raslib__popover !bg-white", className])}
				ref={ref}
				{...props}
			>
				{props.children}
			</Tooltip>
		);
	}
);

Popover.displayName = "Popover";
