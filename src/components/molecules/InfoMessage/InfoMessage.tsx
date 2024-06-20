import React, { HTMLAttributes, PropsWithChildren } from "react";

import { TPictoName } from "@constants/Pictos";

import { Picto } from "@components/atoms";

import { cn } from "@utils/cn";

import "./InfoMessage.scss";

export interface IInfoMessageProps extends HTMLAttributes<HTMLDivElement> {
	type: "info" | "warning" | "error" | "success";
	icon?: TPictoName;
	withIcon?: boolean;
	outlined?: boolean;
}

export const InfoMessage: React.FC<IInfoMessageProps> = ({
	type,
	icon,
	children,
	className = "",
	withIcon = true,
	outlined = false,
}) => {
	const getIcon = () => {
		if (type === "success" && !icon) {
			return "success";
		}
		if (type === "error" && !icon) {
			return "alert";
		}
		return icon || "info";
	};

	return (
		<div
			data-info-message
			className={cn([
				`flex items-center gap-2 p-2 type-${type} rounded-md text-xs`,
				className,
				outlined && `!bg-transparent outline outline-${type}`,
			])}
		>
			{withIcon && (
				<Picto
					icon={getIcon()}
					className="w-8 h-8"
					data-info-message-picto
				/>
			)}
			<span>{children}</span>
		</div>
	);
};
