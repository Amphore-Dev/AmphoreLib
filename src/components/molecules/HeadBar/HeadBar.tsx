import React, { FC } from "react";

import { cn } from "@utils/cn";

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
		<div
			className={cn([
				"flex min-h-[70px] w-full justify-between px-4 py-2",
				className,
			])}
		>
			<div className="flex items-center justify-center gap-6 gap-y-2 px-4 py-2">
				{onMenuClick && (
					<div
						className={cn([
							"group flex aspect-square w-[30px] cursor-pointer flex-col justify-center gap-2 [&>*]:duration-500",
							classNames.leftContent,
						])}
						onClick={onMenuClick}
					>
						<hr className="border-1 border-neutral-300 group-hover:border-black" />
						<hr className="border-1 border-neutral-300 group-hover:border-black" />
						<hr className="border-1 border-neutral-300 group-hover:border-black" />
					</div>
				)}
				{leftContent}
			</div>
			<div
				className={cn([
					"flex items-center justify-end gap-10",
					classNames.rightContent,
				])}
			>
				{rightContent}
			</div>
		</div>
	);
};
