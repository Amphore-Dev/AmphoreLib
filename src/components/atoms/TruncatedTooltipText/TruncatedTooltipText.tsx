import React, { useLayoutEffect, useRef, useState } from "react";

import { type Placement } from "@floating-ui/react";

import { cn } from "@utils/cn";

import { Tooltip } from "../../molecules/Tooltip/Tooltip";

import styles from "./TruncatedTooltipText.module.scss";

export interface ITruncatedTooltipTextProps {
	children: React.ReactNode;
	/** Lines before truncating. 1 = single-line ellipsis, >1 = multi-line clamp. Defaults to 1. */
	maxLines?: number;
	placement?: Placement;
	className?: string;
	tooltipClassName?: string;
}

/**
 * V2 TruncatedTooltipText — truncates text (ellipsis, 1 or more lines) and
 * only enables a Tooltip with the full content once it's actually
 * overflowing (measured via ResizeObserver, re-checked on content/maxLines
 * change). Always renders the same `<Tooltip disabled={!isTruncated}>`
 * tree rather than conditionally mounting it — swapping element types once
 * truncation is detected would remount the trigger into a new DOM node,
 * losing hover state if the user's pointer was already over it (a real
 * timing race, not hypothetical: hovering right as a Storybook story
 * settles hits it easily). `useLayoutEffect` measures before paint too, so
 * there's no frame where the untruncated/disabled version is visible.
 */
export const TruncatedTooltipText: React.FC<ITruncatedTooltipTextProps> = ({
	children,
	maxLines = 1,
	placement = "top",
	className = "",
	tooltipClassName = "",
}) => {
	const ref = useRef<HTMLSpanElement>(null);
	const [isTruncated, setIsTruncated] = useState(false);
	const isMultiLine = maxLines > 1;

	useLayoutEffect(() => {
		const el = ref.current;
		if (!el) return;

		const checkTruncated = () => {
			setIsTruncated(
				isMultiLine
					? el.scrollHeight > el.clientHeight
					: el.scrollWidth > el.clientWidth
			);
		};

		checkTruncated();

		const observer = new ResizeObserver(checkTruncated);
		observer.observe(el);
		return () => observer.disconnect();
	}, [children, isMultiLine]);

	const content = (
		<span
			ref={ref}
			className={cn([
				styles.text,
				isMultiLine ? styles.multiLine : styles.singleLine,
				className,
			])}
			style={isMultiLine ? { WebkitLineClamp: maxLines } : undefined}
		>
			{children}
		</span>
	);

	return (
		<Tooltip
			content={<span className={tooltipClassName}>{children}</span>}
			placement={placement}
			disabled={!isTruncated}
		>
			{content}
		</Tooltip>
	);
};
