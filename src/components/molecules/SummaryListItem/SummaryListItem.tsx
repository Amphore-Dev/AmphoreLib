import React from "react";

import { getPicto } from "@utils/UPicto";
import { cn } from "@utils/cn";

import type { TSummaryListItem } from "@interfaces/index";

import { Link } from "../../atoms/Link/Link";
import { Picto } from "../../atoms/Picto/Picto";
import { TruncatedTooltipText } from "../../atoms/TruncatedTooltipText/TruncatedTooltipText";

import styles from "./SummaryListItem.module.scss";

export interface ISummaryListItemProps extends TSummaryListItem {
	/** Label above value, or side by side. Defaults to "vertical". */
	direction?: "vertical" | "horizontal";
	className?: string;
}

/**
 * V2 SummaryListItem — one term/value row, extracted out of
 * SummaryList so `layout="grid"` can lay several of these out as Grid
 * cells instead of `<dl>` rows, reusing the exact same row markup either way.
 * Props flatten `TSummaryListItem` directly (no nested `item` prop) — that
 * type stays the reusable *data* shape for `SummaryList.items`/callers
 * building rows programmatically (e.g. EditableCard), while this component
 * just takes those same fields as its own top-level props, plus
 * `direction`/`className`, which only make sense at render time.
 */
export const SummaryListItem: React.FC<ISummaryListItemProps> = ({
	label,
	value,
	required,
	href,
	onClick,
	picto,
	maxLines,
	action,
	direction = "vertical",
	className = "",
}) => {
	// TruncatedTooltipText already owns its own overflow/ellipsis — the
	// outer text/link/button must not *also* clip+ellipsize, otherwise the
	// two fight (double truncation, and TruncatedTooltipText's own
	// scrollWidth/clientWidth measurement gets skewed by the outer's
	// already-collapsed box).
	const truncated = !!maxLines;
	const displayedValue = truncated ? (
		<TruncatedTooltipText maxLines={maxLines}>{value}</TruncatedTooltipText>
	) : (
		value
	);

	return (
		<div className={cn([styles.row, className])} data-direction={direction}>
			<dt className={styles.term}>
				{label}
				{required && <span className={styles.required}>*</span>}
			</dt>
			<dd className={styles.value}>
				{!!picto && (
					<Picto {...getPicto(picto)} className={styles.picto} />
				)}
				{href ? (
					<Link
						href={href}
						className={cn([
							styles.link,
							!truncated && styles.ellipsis,
						])}
					>
						{displayedValue}
					</Link>
				) : onClick ? (
					<button
						type="button"
						className={cn([
							styles.clickable,
							!truncated && styles.ellipsis,
						])}
						onClick={onClick}
					>
						{displayedValue}
					</button>
				) : (
					<span
						className={cn([
							styles.text,
							!truncated && styles.ellipsis,
						])}
					>
						{displayedValue}
					</span>
				)}
			</dd>
			{action && (
				<button
					type="button"
					className={styles.action}
					onClick={action.onClick}
				>
					{!!action.picto && (
						<Picto
							{...getPicto(action.picto)}
							className={styles.picto}
						/>
					)}
					{action.label}
				</button>
			)}
		</div>
	);
};
