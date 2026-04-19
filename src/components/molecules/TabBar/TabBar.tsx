import React, { useCallback, useEffect, useRef, useState } from "react";

import { Picto } from "../../atoms/Picto/Picto";
import { ITabProps, Tab, TTabSize } from "../../atoms/Tab/Tab";

import { cn } from "@utils/cn";

import "./TabBar.scss";

export interface ITabBarProps {
	tabs: (ITabProps & { id: string })[];
	activeTab?: string;
	onChange?: (id: string) => void;
	stretch?: boolean;
	size?: TTabSize;
	border?: boolean;
	className?: string;
}

export const TabBar: React.FC<ITabBarProps> = ({
	tabs,
	activeTab,
	onChange,
	stretch = false,
	size = "m",
	border = true,
	className,
}) => {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);
	const [hasOverflow, setHasOverflow] = useState(false);

	const updateScrollState = useCallback(() => {
		const el = scrollRef.current;
		if (!el) return;
		setHasOverflow(el.scrollWidth > el.clientWidth);
		setCanScrollLeft(el.scrollLeft > 0);
		setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
	}, []);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		updateScrollState();
		el.addEventListener("scroll", updateScrollState);

		const observer = new ResizeObserver(updateScrollState);
		observer.observe(el);

		return () => {
			el.removeEventListener("scroll", updateScrollState);
			observer.disconnect();
		};
	}, [updateScrollState]);

	useEffect(() => {
		const container = scrollRef.current;
		if (!container) return;

		const activeEl = container.querySelector<HTMLElement>(
			'[aria-selected="true"]'
		);
		if (!activeEl) return;

		const containerCenter = container.clientWidth / 2;
		const tabCenter = activeEl.offsetLeft + activeEl.offsetWidth / 2;
		container.scrollTo({
			left: tabCenter - containerCenter,
			behavior: "smooth",
		});
	}, [activeTab]);

	const scroll = (direction: "left" | "right") => {
		const el = scrollRef.current;
		if (!el) return;
		el.scrollBy({
			left: direction === "left" ? -150 : 150,
			behavior: "smooth",
		});
	};

	return (
		<div
			className={cn([
				"al__tabbar",
				stretch && "al__tabbar--stretch",
				!border && "al__tabbar--no-border",
				className,
			])}
		>
			{hasOverflow && (
				<button
					className={cn([
						"al__tabbar__arrow",
						!canScrollLeft && "al__tabbar__arrow--disabled",
					])}
					onClick={() => scroll("left")}
					disabled={!canScrollLeft}
					type="button"
					aria-label="Scroll left"
				>
					<Picto
						icon="chevron"
						rotation={180}
						className="al__tabbar__arrow-icon"
					/>
				</button>
			)}

			<div className="al__tabbar__scroll" ref={scrollRef}>
				<div className="al__tabbar__tabs" role="tablist">
					{tabs.map((tab) => (
						<Tab
							key={tab.id}
							label={tab.label}
							picto={tab.picto}
							isActive={activeTab === tab.id}
							disabled={tab.disabled}
							size={tab.size ?? size}
							onClick={() => {
								if (!tab.disabled) onChange?.(tab.id);
							}}
						/>
					))}
				</div>
			</div>

			{hasOverflow && (
				<button
					className={cn([
						"al__tabbar__arrow",
						!canScrollRight && "al__tabbar__arrow--disabled",
					])}
					onClick={() => scroll("right")}
					disabled={!canScrollRight}
					type="button"
					aria-label="Scroll right"
				>
					<Picto icon="chevron" className="al__tabbar__arrow-icon" />
				</button>
			)}
		</div>
	);
};
