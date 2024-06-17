import React, { FC } from "react";
import { cn } from "../../../utils/cn";

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
		<div className={cn(["px-4 py-2 min-h-[70px] flex w-full justify-between", className])}>
			<div className="flex items-center px-4 py-2 gap-y-2 gap-6 justify-center">
				{onMenuClick && (
					<div
						className={cn([
							"flex flex-col w-[30px] aspect-square gap-2 justify-center cursor-pointer group [&>*]:duration-500",
							classNames.leftContent,
						])}
						onClick={onMenuClick}
					>
						<hr className="border-neutral-300 border-1 group-hover:border-black" />
						<hr className="border-neutral-300 border-1 group-hover:border-black" />
						<hr className="border-neutral-300 border-1 group-hover:border-black" />
					</div>
				)}
				{leftContent}
			</div>
			<div
				className={cn([
					"flex justify-end gap-10 items-center",
					classNames.rightContent,
				])}
			>
				{rightContent}
			</div>
		</div>
	);
};
