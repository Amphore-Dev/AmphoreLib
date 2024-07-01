import React, { HTMLAttributes } from "react";

import "./Title.scss";

export interface ITitleProps extends HTMLAttributes<HTMLHeadingElement> {
	tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const Title: React.FC<ITitleProps> = ({ children, tag, ...props }) => {
	const Tag = tag ?? "h1";

	return (
		<Tag {...props} data-amphore-title>
			{children}
		</Tag>
	);
};
