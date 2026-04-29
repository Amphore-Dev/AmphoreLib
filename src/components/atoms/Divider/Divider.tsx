import React from "react";

import { cn } from "@utils/cn";

import "./Divider.scss";

export interface IDivider {
	className?: string;
	orientation?: "horizontal" | "vertical";
}

export const Divider: React.FC<IDivider> = ({
	className,
	orientation = "horizontal",
}) => {
	return (
		<div
			className={cn([
				"al__divider",
				orientation === "vertical" && "al__divider--vertical",
				orientation === "horizontal" && "al__divider--horizontal",
				className,
			])}
			data-testid="divider"
		></div>
	);
};
