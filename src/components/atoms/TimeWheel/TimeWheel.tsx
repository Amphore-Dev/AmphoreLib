import React, { useState, useRef, useEffect } from "react";

import { cn } from "@utils/cn";

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

	const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const itemHeight = 40; // Height of each item

	const handleChange = (time: string) => {
		onChange?.(time);
	};

	useEffect(() => {
		const index = items.indexOf(value);
		if (index === -1) return;
		setOffset(index * itemHeight);
	}, [value]);

	useEffect(() => {
		const container = containerRef.current;

		const handleWheelScroll = (e) => {
			e.preventDefault();
			setIsScrolling(true);
			const direction = e.deltaY > 0 ? 1 : -1;
			window.clearTimeout(scrollTimeout.current);
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
		<div
			className="flex flex-col items-center overflow-hidden h-10 w-20 relative"
			ref={containerRef}
		>
			<div
				className={cn([
					"absolute flex flex-col transition-tradnsform",
					!isScrolling && "duration-300",
				])}
				style={{ top: -offset }}
			>
				{items.concat(items).map((item, index) => (
					<div
						key={index}
						className="h-10 flex justify-center items-center text-lg"
					>
						{item}
					</div>
				))}
				<div
					key={"00"}
					className="h-10 flex justify-center items-center text-lg"
				>
					{items[0]}
				</div>
			</div>
		</div>
	);
};
