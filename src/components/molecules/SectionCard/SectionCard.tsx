import React, { PropsWithChildren } from "react";

import { Card, Divider } from "@components/atoms";

import { cn } from "@utils/cn";

import "./SectionCard.scss";

export interface ISectionCardProps extends PropsWithChildren {
	title: React.ReactNode;
	actions?: React.ReactNode;
	className?: string;
}

export const SectionCard: React.FC<ISectionCardProps> = ({
	title,
	actions,
	className,
	children,
}) => {
	return (
		<Card className={cn(["al__section-card", className])}>
			<div className="al__section-card__header">
				<div className="al__section-card__top">
					<div className="al__section-card__title">{title}</div>
					{!!actions && (
						<div className="al__section-card__actions">
							{actions}
						</div>
					)}
				</div>
				<Divider />
			</div>
			{children}
		</Card>
	);
};
