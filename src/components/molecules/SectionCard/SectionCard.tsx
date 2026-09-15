import React from "react";

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

/** V2 SectionCard — a Card preset: title + optional trailing actions, a Divider, then content. */
export const SectionCard: React.FC<ISectionCardProps> = ({
	title,
	actions,
	children,
	className = "",
	...props
}) => (
	<Card {...props} className={cn([styles.card, className])}>
		<div className={styles.header}>
			<div className={styles.top}>
				<Title as="h3" size="h5" className={styles.title}>
					{title}
				</Title>
				{!!actions && <div className={styles.actions}>{actions}</div>}
			</div>
			<Divider />
		</div>
		{children}
	</Card>
);
