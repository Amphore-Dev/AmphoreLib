import React from "react";

import { ITooltipProps, Tooltip } from "../Tooltip/Tooltip";

export const Popover: React.FC<ITooltipProps> = (props) => {
	return (
		<Tooltip trigger="click" interactive {...props}>
			{props.children}
		</Tooltip>
	);
};
