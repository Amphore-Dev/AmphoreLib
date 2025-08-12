import React, { useEffect, useRef, useState } from "react";

import { Placement } from "@floating-ui/react";

import { Tooltip } from "@components/index";
import { cn } from "@utils/index";

interface TruncatedTooltipTextProps {
	children: React.ReactNode;
	className?: string;
	placement?: Placement;
}

export const TruncatedTooltipText: React.FC<TruncatedTooltipTextProps> = ({
	children,
	className,
	placement = "bottom",
}) => {
	const spanRef = useRef<HTMLSpanElement>(null);
	const [isTruncated, setIsTruncated] = useState(false);

	useEffect(() => {
		const el = spanRef.current;
		if (el) {
			setIsTruncated(el.scrollWidth > el.clientWidth);
		}
	}, [children]);

	const content = (
		<span
			ref={spanRef}
			className={cn([
				"text-ellipsis overflow-hidden whitespace-nowrap block max-w-full",
				className,
			])}
		>
			{children}
		</span>
	);

	if (isTruncated)
		return (
			<Tooltip
				buttonClassName={cn([
					"user-event-none cursor-default text-ellipsis overflow-hidden whitespace-nowrap block max-w-full",
					className,
				])}
				content={content}
				floatingProps={{
					placement,
				}}
				className="whitespace-nowrap"
			>
				{children}
			</Tooltip>
		);

	return content;
};
