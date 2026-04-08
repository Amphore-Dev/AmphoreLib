import React, { FC } from "react";

import { cn } from "@utils/cn";

import "./HeadBar.scss";

export interface IHeadBarClasses {
	leftContent?: string;
	rightContent?: string;
}

export interface IHeadBarProps {
	onMenuClick?: () => void;
	leftContent?: React.ReactNode;
	rightContent?: React.ReactNode;
	className?: string;
	classNames?: IHeadBarClasses;
}

export const HeadBar: FC<IHeadBarProps> = ({
	onMenuClick,
	leftContent = null,
	rightContent = null,
	className = "",
	classNames = { leftContent: "", rightContent: "" },
}) => {
	return (
		<div className={cn(["al__headbar", className])}>
			<div className="al__headbar__left">
				{onMenuClick && (
					<div
						className={cn([
							"group al__headbar__menu",
							classNames.leftContent,
						])}
						onClick={onMenuClick}
					>
						<hr className="al__headbar__menu-line" />
						<hr className="al__headbar__menu-line" />
						<hr className="al__headbar__menu-line" />
					</div>
				)}
				{leftContent}
			</div>
			<div
				className={cn(["al__headbar__right", classNames.rightContent])}
			>
				{rightContent}
			</div>
		</div>
	);
};
