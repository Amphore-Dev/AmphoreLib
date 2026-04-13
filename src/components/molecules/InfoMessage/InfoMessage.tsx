import React, { HTMLAttributes } from "react";

import { TPictoName } from "../../../constants/CPictos";
import { Picto } from "../../atoms/Picto/Picto";

import { cn } from "@utils/cn";

import "./InfoMessage.scss";

export interface IInfoMessageProps extends HTMLAttributes<HTMLDivElement> {
	type?: "info" | "warning" | "error" | "success";
	icon?: TPictoName;
	withIcon?: boolean;
	outlined?: boolean;
}

export const InfoMessage: React.FC<IInfoMessageProps> = ({
	type = "info",
	icon,
	children,
	className = "",
	withIcon = true,
	outlined = false,
}) => {
	const getIcon = () => {
		if (icon) return icon;
		if (type === "success") return "checkCircle";
		if (type === "error") return "alert";
		return "info";
	};

	return (
		<div
			data-info-message
			className={cn([
				`type-${type}`,
				className,
				outlined && `!bg-transparent outline outline-${type}`,
			])}
		>
			{withIcon && (
				<Picto
					icon={getIcon()}
					wrapperClassName="al__info-message__picto"
					data-info-message-picto
				/>
			)}
			<span className="al__info-message__content">{children}</span>
		</div>
	);
};
