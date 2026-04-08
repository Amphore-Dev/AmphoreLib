import React, { useEffect, useRef, useState } from "react";

import { Placement } from "@floating-ui/react";

import { Tooltip } from "@components/index";
import { cn } from "@utils/index";

import "./TruncatedTooltipText.scss";

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
		<span ref={spanRef} className={cn(["al__truncated-text", className])}>
			{children}
		</span>
	);

	if (isTruncated)
		return (
			<Tooltip
				buttonClassName={cn([
					"al__truncated-text al__truncated-text--button",
					className,
				])}
				content={content}
				floatingProps={{
					placement,
				}}
				className="al__truncated-tooltip"
			>
				{children}
			</Tooltip>
		);

	return content;
};
