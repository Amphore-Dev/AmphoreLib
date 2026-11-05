import React, { forwardRef } from "react";

import { useAmphoreLabels } from "@theme/useAmphoreLabels";

import { deriveTestId } from "@utils/UTestId";
import { cn } from "@utils/cn";

import type { ITestIdProps, TLabel } from "@interfaces/index";

import { Link } from "../../atoms/Link/Link";

import styles from "./Breadcrumb.module.scss";

export interface IBreadcrumbEntry {
	label: React.ReactNode;
	/** Plain anchor — for SPA routing, this is exactly `Link`'s own rule (see its own doc comment): wrap your router's Link with these props instead. Omit on the last entry — it's the current page, never a link. */
	href?: string;
	/** Drops this entry entirely, without needing to filter `items` yourself before passing them. */
	hidden?: boolean;
}

export interface IBreadcrumbProps
	extends
		Omit<React.ComponentPropsWithoutRef<"nav">, "children">,
		ITestIdProps {
	items: IBreadcrumbEntry[];
	/** Between each entry. Defaults to "/". */
	separator?: React.ReactNode;
	/** aria-label for the `<nav>` landmark. Defaults to "Breadcrumb" (or `Breadcrumb.navigationLabel` from the nearest AmphoreProvider — see useAmphoreLabels). */
	navigationLabel?: TLabel;
	className?: string;
}

/** Picked, not listed by hand elsewhere — see TThemeLabels.ts's own comment on why. */
export type TBreadcrumbLabels = Pick<IBreadcrumbProps, "navigationLabel">;

/**
 * V2 Breadcrumb — a trail of page links, the last one being the current
 * page (rendered as plain text with `aria-current="page"`, never a link,
 * regardless of whether it has an `href`). No separate `BreadcrumbItem`
 * atom, unlike the reference this was ported from: a breadcrumb link is
 * just `Link` (already themed/styled) — the only thing this adds on top is
 * the trail layout, the separator, and the current-page/link split.
 *
 * Native props and `ref` go to the `<nav>`, `aria-label` winning over
 * `navigationLabel`. Derived testids: `-item-<position>`.
 */
const BreadcrumbBase: React.ForwardRefRenderFunction<
	HTMLElement,
	IBreadcrumbProps
> = (
	{
		items,
		separator = "/",
		navigationLabel: navigationLabelProp,
		className = "",
		...props
	},
	ref
) => {
	const visible = items.filter((item) => !item.hidden);
	const { resolve } = useAmphoreLabels("Breadcrumb");
	const navigationLabel = resolve("navigationLabel", navigationLabelProp);

	if (!visible.length) return null;

	return (
		<nav
			aria-label={navigationLabel}
			{...props}
			ref={ref}
			className={cn([styles.breadcrumb, className])}
		>
			{visible.map((item, index) => {
				const isLast = index === visible.length - 1;
				const itemTestId = deriveTestId(
					props["data-testid"],
					"item",
					index
				);

				return (
					<React.Fragment key={index}>
						{item.href && !isLast ? (
							<Link
								href={item.href}
								color="neutral"
								underline="hover"
								className={styles.item}
								data-testid={itemTestId}
							>
								{item.label}
							</Link>
						) : (
							<span
								className={styles.item}
								data-current={isLast || undefined}
								aria-current={isLast ? "page" : undefined}
								data-testid={itemTestId}
							>
								{item.label}
							</span>
						)}
						{!isLast && (
							<span className={styles.separator} aria-hidden>
								{separator}
							</span>
						)}
					</React.Fragment>
				);
			})}
		</nav>
	);
};

export const Breadcrumb = forwardRef(BreadcrumbBase);
Breadcrumb.displayName = "Breadcrumb";
