import React, { useEffect, useRef, useState } from "react";

import { Placement } from "@floating-ui/react";

import { ITooltipProps, Tooltip } from "../Tooltip/Tooltip";

import { cn } from "@utils/cn";

import "./TruncatedTooltipText.scss";

interface TruncatedTooltipTextProps {
	children: React.ReactNode;
	className?: string;
	placement?: Placement;
	maxLines?: number;
	tooltipProps?: Partial<ITooltipProps>;
}

export const TruncatedTooltipText: React.FC<TruncatedTooltipTextProps> = ({
	children,
	className,
	placement = "bottom",
	maxLines = 1,
	tooltipProps = {},
}) => {
	const spanRef = useRef<HTMLSpanElement>(null);
	const [isTruncated, setIsTruncated] = useState(false);

	const isMultiLine = maxLines && maxLines > 1;

	const checkTruncate = () => {
		const el = spanRef.current;
		if (!el) return;

		const style = window.getComputedStyle(el);
		const lineHeight = parseFloat(style.lineHeight) || 16;

		if (isMultiLine && el.scrollHeight > lineHeight) {
			const maxHeight = lineHeight * (maxLines || 1);
			setIsTruncated(el.scrollHeight > maxHeight);
		} else {
			setIsTruncated(el.scrollWidth > el.clientWidth);
		}
	};

	useEffect(() => {
		checkTruncate();

		const resizeObserver = new ResizeObserver(checkTruncate);
		if (spanRef.current) resizeObserver.observe(spanRef.current);

		return () => resizeObserver.disconnect();
	}, [children, isMultiLine, maxLines]);

	const content = (
		<span
			ref={spanRef}
			className={cn([
				"al__truncated-text",
				!isMultiLine &&
					"text-ellipsis whitespace-nowrap overflow-hidden block max-w-full",
				className,
			])}
			style={
				isMultiLine
					? {
							display: "-webkit-box",
							WebkitBoxOrient: "vertical",
							WebkitLineClamp: maxLines,
							overflow: "hidden",
						}
					: {}
			}
		>
			{children}
		</span>
	);

	if (isTruncated) {
		return (
			<Tooltip
				{...tooltipProps}
				buttonClassName={cn([
					"al__truncated-text al__truncated-text--button",
					className,
					tooltipProps.buttonClassName,
				])}
				content={content}
				floatingProps={{
					placement,
					...tooltipProps.floatingProps,
				}}
				className={cn([
					"al__truncated-tooltip whitespace-pre-wrap max-w-xl break-words",
					tooltipProps.className,
				])}
			>
				{children}
			</Tooltip>
		);
	}

	return content;
};
