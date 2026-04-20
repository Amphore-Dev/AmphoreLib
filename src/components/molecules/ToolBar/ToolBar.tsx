import React, { useMemo, useRef } from "react";

import { TPictoName } from "@constants/CPictos";
import { Middleware, offset } from "@floating-ui/react";

import { Picto } from "../../atoms/Picto/Picto";
import { Popover } from "../../atoms/Popover/Popover";
import { ITooltipProps, Tooltip } from "../../atoms/Tooltip/Tooltip";

import { cn } from "@utils/cn";

import "./ToolBar.scss";

function centerOnAnchor(anchorRef: React.RefObject<HTMLElement>): Middleware {
	return {
		name: "centerOnAnchor",
		fn: ({ rects }) => {
			const anchor = anchorRef.current;
			if (!anchor) return {};
			const { left, width } = anchor.getBoundingClientRect();
			return { x: left + width / 2 - rects.floating.width / 2 };
		},
	};
}

export interface IToolBarItem {
	id: string;
	label: string;
	picto?: TPictoName;
	component?: React.FC<{ isActive?: boolean }>;
	popover?:
		| React.ReactNode
		| ((ref: React.RefObject<HTMLDivElement>) => React.ReactNode);
	tooltipProps?: Partial<Omit<ITooltipProps, "content">>;
	className?: string;
	onClick?: () => void;
	disabled?: boolean;
}

export interface IToolBarProps {
	items: IToolBarItem[];
	activeItem?: string;
	onChange?: (id: string | undefined) => void;
	position?: "top" | "bottom";
	className?: string;
}

const ToolBarItemContent: React.FC<{
	item: IToolBarItem;
	isActive?: boolean;
}> = ({ item, isActive }) => {
	if (item.component) {
		const Comp = item.component;
		return <Comp isActive={isActive} />;
	}
	if (item.picto) {
		return <Picto icon={item.picto} className="al__toolbar__btn-icon" />;
	}
	return <span className="al__toolbar__btn-label">{item.label}</span>;
};

export const ToolBar: React.FC<IToolBarProps> = ({
	items,
	activeItem,
	onChange,
	position = "bottom",
	className,
}) => {
	const toolbarRef = useRef<HTMLDivElement>(null);
	const popOverRef = React.useRef<HTMLDivElement>(null);
	const centerMiddleware = useMemo(() => centerOnAnchor(toolbarRef), []);

	return (
		<div
			ref={toolbarRef}
			className={cn([
				"al__toolbar",
				`al__toolbar--${position}`,
				className,
			])}
		>
			{items.map((item) => {
				const isActive = activeItem === item.id;

				if (item.popover) {
					const {
						floatingProps: tooltipFloatingProps,
						...restTooltipProps
					} = item.tooltipProps ?? {};

					return (
						<Popover
							key={`${item.id}-${isActive ? "active" : "inactive"}`}
							portal
							containerRef={(node) => {
								popOverRef.current = node;
							}}
							content={
								<ToolBarItemContent
									item={item}
									isActive={isActive}
								/>
							}
							isOpen={isActive}
							setIsOpen={(open) =>
								onChange?.(open ? item.id : undefined)
							}
							buttonClassName={cn([
								"al__toolbar__btn",
								isActive && "al__toolbar__btn--active",
								item.disabled && "al__toolbar__btn--disabled",
								item.className,
							])}
							{...restTooltipProps}
							floatingProps={{
								strategy: "fixed",
								placement:
									position === "top" ? "bottom" : "top",
								middleware: [
									offset({
										mainAxis: 8,
										alignmentAxis: 0,
									}),
									centerMiddleware,
									...(tooltipFloatingProps?.middleware ?? []),
								],
								...tooltipFloatingProps,
							}}
						>
							{typeof item.popover === "function"
								? item.popover(popOverRef)
								: item.popover}
						</Popover>
					);
				}

				return (
					<button
						key={item.id}
						type="button"
						className={cn([
							"al__toolbar__btn",
							isActive && "al__toolbar__btn--active",
							item.className,
						])}
						onClick={() => {
							item.onClick?.();
							onChange?.(item.id);
						}}
						disabled={item.disabled}
						aria-label={item.label}
						title={item.label}
					>
						<ToolBarItemContent item={item} isActive={isActive} />
					</button>
				);
			})}
		</div>
	);
};
