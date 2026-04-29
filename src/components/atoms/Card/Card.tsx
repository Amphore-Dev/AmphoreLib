import React from "react";

import { TPictoName } from "@constants/CPictos";

import { Picto } from "../Picto/Picto";

import { cn } from "@utils/cn";

import "./Card.scss";

export interface ICardProps {
	children: React.ReactNode;
	className?: string;
	color?: "white" | "grey" | "whiteGreyBorder";
	header?: {
		title: React.ReactNode;
		info?: {
			text: string;
			picto?: TPictoName;
		};
	};
	headerClassName?: string;
	contentClassName?: string;
	hasBorder?: boolean;
}

export const Card: React.FC<ICardProps> = ({
	children,
	color = "white",
	className = "",
	header,
	headerClassName,
	contentClassName,
	hasBorder,
}) => {
	const headerClassNames = cn(["al__card__header", headerClassName]);
	const contentClassNames = cn(["al__card__content", contentClassName]);

	return (
		<div
			className={cn([
				"al__card",
				`al__card--${color}`,
				header && "al__card--has-header",
				hasBorder && "al__card--has-border",
				className,
			])}
		>
			{header ? (
				<>
					<div className={headerClassNames}>
						<p className="al__card__header__title">
							{header.title}
						</p>
						{header.info && (
							<div className="al__card__header__info-wrapper">
								{header.info.picto && (
									<Picto
										icon={header.info.picto}
										className="al__card__header__picto"
									/>
								)}
								<p className="al__card__header__text">
									{header.info.text}
								</p>
							</div>
						)}
					</div>
					<div className={contentClassNames}>{children}</div>
				</>
			) : (
				children
			)}
		</div>
	);
};
