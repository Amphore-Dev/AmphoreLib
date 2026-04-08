import React, { useState, useRef, useEffect } from "react";

import { cn } from "@utils/cn";

import "./TimeWheel.scss";

interface ITimeWheelProps {
	items: string[];
	scrollSpeed?: number;
	value?: string;
	onChange?: (time: string) => void;
}

export const TimeWheel: React.FC<ITimeWheelProps> = ({
	items,
	scrollSpeed = 2,
	value,
	onChange,
}) => {
	const [offset, setOffset] = useState(0);
	const [isScrolling, setIsScrolling] = useState(false);

	const scrollTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
	const containerRef = useRef<HTMLDivElement>(null);
	const itemHeight = 40; // Height of each item

	const handleChange = (time: string) => {
		onChange?.(time);
	};

	useEffect(() => {
		if (!value) return;
		const index = items.indexOf(value);
		if (index === -1) return;
		setOffset(index * itemHeight);
	}, [value]);

	useEffect(() => {
		const container = containerRef.current;

		const handleWheelScroll = (e: WheelEvent) => {
			e.preventDefault();
			setIsScrolling(true);
			const direction = e.deltaY > 0 ? 1 : -1;
			clearTimeout(scrollTimeout.current);
			const nbrItems = items.length + 1;

			setOffset((prev) => {
				let newOffset =
					prev +
					direction *
						itemHeight *
						scrollSpeed *
						Math.abs(e.deltaY) *
						0.05;
				if (newOffset > itemHeight * (nbrItems - 1)) newOffset = 0;
				if (newOffset < 0) newOffset = itemHeight * (nbrItems - 1);

				scrollTimeout.current = setTimeout(() => {
					const snappedOffset =
						Math.round(newOffset / itemHeight) * itemHeight;

					let index = Math.abs(snappedOffset / itemHeight);
					if (index >= nbrItems - 1) index = 0;

					handleChange(items[index]);
					setIsScrolling(false);
					setOffset(snappedOffset);
				}, 300);

				return newOffset;
			});
		};

		container?.addEventListener("wheel", handleWheelScroll, {
			passive: false,
		});

		return () => {
			container?.removeEventListener("wheel", handleWheelScroll);
		};
	}, [items.length, scrollSpeed, offset]);

	return (
		<div className="al__time-wheel" ref={containerRef}>
			<div
				className={cn([
					"al__time-wheel__track",
					!isScrolling && "al__time-wheel__track--snapping",
				])}
				style={{ top: -offset }}
			>
				{items.concat(items).map((item, index) => (
					<div key={index} className="al__time-wheel__item">
						{item}
					</div>
				))}
				<div key={"00"} className="al__time-wheel__item">
					{items[0]}
				</div>
			</div>
		</div>
	);
};
