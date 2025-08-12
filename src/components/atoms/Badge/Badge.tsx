import React, { useMemo } from "react";

import { ITagProps, Tag } from "../Tag/Tag";

import { cn } from "@utils/cn";

import "./Badge.scss";

export interface IBadgeProps extends ITagProps {
	value: number;
}
export const Badge: React.FC<IBadgeProps> = ({ value, ...props }) => {
	const roundNumber = useMemo(() => {
		if (value > 99) return "99+";
		if (value <= 0) return null;
		return value;
	}, [value]);

	return (
		<Tag {...props} className={cn([`amphorelib__badge`, props.className])}>
			{roundNumber}
		</Tag>
	);
};
