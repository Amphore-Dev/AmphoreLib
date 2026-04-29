import React, { AnchorHTMLAttributes } from "react";

import { TPictoName } from "@constants/CPictos";

import { IPictoProps, Picto } from "../Picto/Picto";

import { cn } from "@utils/cn";

import "./Link.scss";

export interface ILinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
	label: React.ReactNode;
	picto?: TPictoName;
	pictoClassName?: string;
	pictoProps?: IPictoProps;
}

export const Link: React.FC<ILinkProps> = ({
	label,
	picto,
	pictoClassName,
	className,
	href,
	onClick,
	pictoProps,
	...props
}) => {
	return (
		<a
			className={cn(["al__link", className])}
			href={href || "#"}
			onClick={(e) => {
				if (onClick) {
					e.preventDefault();
					onClick(e);
				}
			}}
			{...props}
		>
			{picto && (
				<Picto
					icon={picto}
					className={cn(["al__link--picto", pictoClassName])}
					{...pictoProps}
				/>
			)}
			{label}
		</a>
	);
};
