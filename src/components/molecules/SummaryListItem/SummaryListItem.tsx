import React, { forwardRef } from "react";

import { getPicto } from "@utils/UPicto";
import { deriveTestId } from "@utils/UTestId";
import { cn } from "@utils/cn";

import type { ITestIdProps, TSummaryListItem } from "@interfaces/index";

import { Link } from "../../atoms/Link/Link";
import { Picto } from "../../atoms/Picto/Picto";
import { TruncatedTooltipText } from "../../atoms/TruncatedTooltipText/TruncatedTooltipText";

import styles from "./SummaryListItem.module.scss";

export interface ISummaryListItemProps
	extends
		TSummaryListItem,
		Omit<
			React.ComponentPropsWithoutRef<"div">,
			keyof TSummaryListItem | "children"
		>,
		ITestIdProps {
	/** Label above value, or side by side. Defaults to "vertical". */
	direction?: "vertical" | "horizontal";
	className?: string;
}

const SummaryListItemBase: React.ForwardRefRenderFunction<
	HTMLDivElement,
	ISummaryListItemProps
> = (
	{
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
		...props
	},
	ref
) => {
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
		<div
			{...props}
			ref={ref}
			className={cn([styles.row, className])}
			data-direction={direction}
		>
			<dt className={styles.term}>
				{label}
				{required && <span className={styles.required}>*</span>}
			</dt>
			<dd
				className={styles.value}
				data-testid={deriveTestId(props["data-testid"], "value")}
			>
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
					data-testid={deriveTestId(props["data-testid"], "action")}
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

/**
 * V2 SummaryListItem — one term/value row, extracted out of
 * SummaryList so `layout="grid"` can lay several of these out as Grid
 * cells instead of `<dl>` rows, reusing the exact same row markup either way.
 * Props flatten `TSummaryListItem` directly (no nested `item` prop) — that
 * type stays the reusable *data* shape for `SummaryList.items`/callers
 * building rows programmatically (e.g. EditableCard), while this component
 * just takes those same fields as its own top-level props, plus
 * `direction`/`className`, which only make sense at render time.
 *
 * Native props and `ref` go to the root `<div>`; `onClick` stays the value's
 * own (see `TSummaryListItem`). Derived testids: `-value`, `-action`.
 */
export const SummaryListItem = forwardRef(SummaryListItemBase);
SummaryListItem.displayName = "SummaryListItem";
