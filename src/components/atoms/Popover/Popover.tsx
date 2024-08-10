import React from "react";

import { ITooltipProps, Tooltip } from "../Tooltip/Tooltip";

export const Popover: React.FC<ITooltipProps> = ({
	trigger = "click",
	...props
}) => {
	return (
		<Tooltip trigger={trigger} {...props}>
			{props.children}
		</Tooltip>
	);
};
