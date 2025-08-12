import React, { PropsWithChildren } from "react";

import { cn } from "@utils/cn";

import "./Tag.scss";

export const TagColors = ["primary", "orange", "green", "red"];
export const TagSizes = ["s", "m", "l"];

export interface ITagProps extends PropsWithChildren {
	color?: (typeof TagColors)[number];
	size?: (typeof TagSizes)[number];
	className?: string;
}

export const Tag: React.FC<ITagProps> = ({
	children,
	color = "primary",
	size = "s",
	className,
}) => {
	const classNames = cn([
		`amphorelib__tag amphorelib__tag--${color} amphorelib__tag--${size}`,
		className,
	]);

	return children ? (
		<span className={classNames} data-testid="tag">
			{children}
		</span>
	) : null;
};
