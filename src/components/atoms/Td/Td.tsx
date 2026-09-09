import React from "react";

import { cn } from "@utils/cn";

import "./Td.scss";

export interface ITdProps {
	children?: React.ReactNode;
	className?: string;
	sticky?: "left" | "right";
	onClick?: () => void;
}

export const Td: React.FC<ITdProps> = ({
	children,
	className,
	sticky,
	onClick,
}) => (
	<div
		role="gridcell"
		className={cn([
			"al__td",
			sticky && "al__td--sticky",
			sticky === "left" && "al__td--sticky-left",
			sticky === "right" && "al__td--sticky-right",
			className,
		])}
		onClick={onClick}
	>
		{children}
	</div>
);
