import React, { forwardRef } from "react";

import { deriveTestId } from "@utils/UTestId";
import { cn } from "@utils/cn";

import { Card, ICardProps } from "../../atoms/Card/Card";
import { Divider } from "../../atoms/Divider/Divider";
import { Title } from "../../atoms/Title/Title";

import styles from "./SectionCard.module.scss";

export interface ISectionCardProps extends Omit<
	ICardProps,
	"children" | "title"
> {
	title: React.ReactNode;
	actions?: React.ReactNode;
	children?: React.ReactNode;
	className?: string;
}

const SectionCardBase: React.ForwardRefRenderFunction<
	HTMLDivElement,
	ISectionCardProps
> = ({ title, actions, children, className = "", ...props }, ref) => (
	<Card {...props} ref={ref} className={cn([styles.card, className])}>
		<div className={styles.header}>
			<div className={styles.top}>
				<Title
					as="h3"
					size="h5"
					className={styles.title}
					data-testid={deriveTestId(props["data-testid"], "title")}
				>
					{title}
				</Title>
				{!!actions && (
					<div
						className={styles.actions}
						data-testid={deriveTestId(
							props["data-testid"],
							"actions"
						)}
					>
						{actions}
					</div>
				)}
			</div>
			<Divider />
		</div>
		{children}
	</Card>
);

/**
 * V2 SectionCard — a Card preset: title + optional trailing actions, a
 * Divider, then content. Native props and `ref` go to the Card. Derived
 * testids: `-title`, `-actions`.
 */
export const SectionCard = forwardRef(SectionCardBase);
SectionCard.displayName = "SectionCard";
