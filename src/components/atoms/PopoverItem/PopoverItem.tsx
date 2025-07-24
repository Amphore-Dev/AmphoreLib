import React, { FC, MouseEventHandler, PropsWithChildren } from "react";

import { TPictoName } from "@constants/CPictos";

import { Picto } from "../Picto/Picto";

import { cn } from "@utils/cn";

import "./PopoverItem.scss";

export interface PopoverItemProps extends PropsWithChildren {
	icon?: TPictoName;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	rtl?: boolean;

	className?: string;
}

export const PopoverItem: FC<PopoverItemProps> = ({
	icon,
	onClick = () => {},
	rtl = false,
	children = false,
	className,
}) => (
	<button
		className={cn([
			"al__popover-item",
			!icon && "al__popover-item--no-icon",
			rtl && "al__popover-item--reverse",
			className,
		])}
		onClick={onClick}
		type="button"
	>
		{!!icon && <Picto className="al__popover-item-icon" icon={icon} />}
		{children || false}
	</button>
);
