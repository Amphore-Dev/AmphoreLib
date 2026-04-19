import React from "react";

import { TPictoName } from "@constants/CPictos";

import { IPictoProps, Picto } from "../Picto/Picto";

import { cn } from "@utils/cn";

import "./Tab.scss";

export const TabSizes = ["s", "m", "l"] as const;
export type TTabSize = (typeof TabSizes)[number];

export interface ITabProps {
	id?: string;
	label: string;
	picto?: TPictoName | Partial<IPictoProps>;
	isActive?: boolean;
	onClick?: () => void;
	disabled?: boolean;
	size?: TTabSize;
	className?: string;
}

export const Tab: React.FC<ITabProps> = ({
	label,
	picto,
	isActive = false,
	onClick,
	disabled = false,
	size = "m",
	className,
}) => {
	const classNames = cn([
		"al__tab",
		`al__tab--${size}`,
		isActive && "al__tab--active",
		disabled && "al__tab--disabled",
		className,
	]);

	return (
		<button
			className={classNames}
			onClick={onClick}
			disabled={disabled}
			type="button"
			role="tab"
			aria-selected={isActive}
		>
			{!!picto && (
				<Picto
					{...(typeof picto === "string" ? { icon: picto } : picto)}
					className={cn([
						"al__tab--picto",
						typeof picto !== "string" && picto.className,
					])}
				/>
			)}
			<span>{label}</span>
		</button>
	);
};
