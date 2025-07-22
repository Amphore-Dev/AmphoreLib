import React, { useMemo } from "react";

import { IChartProps } from "@interfaces/TCharts";

import { cn } from "@utils/cn";

import "./CircularChart.scss";

export type TCircularChartColor = {
	color?: string;
	backgroundColor?: string;
	progress: number;
};

export interface ICircularChartProps extends IChartProps {
	progress: number;
	title: React.ReactNode;
	value: React.ReactNode;
	color?: string;
	backgroundColor?: string;
	size?: number;
	strokeWidth?: number;
	colors?: TCircularChartColor[];
}

export const CircularChart = ({
	progress,
	title,
	value,
	size = 200,
	color = "#0f9be8",
	backgroundColor = "#e0f1fe",
	strokeWidth = 15,
	animationDuration = 1000,
	animationDelay = 0,
	animate = true,
	animateOnMount = true,
	colors = [],
	className = "",
}: ICircularChartProps) => {
	const isInitialized = React.useRef(false);
	const radius = size / 2 - strokeWidth / 2;
	const circumference = 2 * Math.PI * radius;
	const normalizedProgress = Math.max(0, Math.min(progress, 1));

	const [progressValue, setProgressValue] = React.useState(0);

	const valueFontSize = Math.min(
		size / 4,
		Math.max(size / (typeof value === "string" ? value.length : 1), 12)
	);

	React.useEffect(() => {
		if (!animateOnMount || !animate) isInitialized.current = true;

		setTimeout(
			() => {
				setProgressValue(normalizedProgress);
				isInitialized.current = true;
			},
			animateOnMount ? animationDelay : 0
		);
	}, []);

	React.useEffect(() => {
		if (!isInitialized.current) return;
		setProgressValue(normalizedProgress);
	}, [normalizedProgress]);

	const chartColors = useMemo(() => {
		if (!Array.isArray(colors) || colors.length === 0) {
			return { color, backgroundColor };
		}
		const sortedColors = [...colors].sort(
			(a, b) => a.progress - b.progress
		);
		const matchedColor = sortedColors.find((c) => progress <= c.progress);
		return {
			color: matchedColor?.color || color,
			backgroundColor: matchedColor?.backgroundColor || backgroundColor,
		};
	}, [colors, progress, color, backgroundColor]);

	const offset = circumference * (1 - progressValue);

	return (
		<div
			className={cn(["al_circular-chart", className])}
			style={{ width: size, height: size }}
		>
			<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke={chartColors.backgroundColor}
					strokeWidth={strokeWidth}
					fill="none"
					style={{
						transition: `stroke ${animationDuration}ms ease-in-out`,
					}}
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					stroke={chartColors.color}
					strokeWidth={strokeWidth}
					fill="none"
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap="round"
					transform={`rotate(-90, ${size / 2}, ${size / 2})`}
					style={{
						transition: animate
							? `stroke-dashoffset ${animationDuration}ms ease-in-out, stroke ${animationDuration}ms ease-in-out`
							: "none",
					}}
				/>
			</svg>

			<div
				className="chart-content"
				style={{
					padding: strokeWidth * 2 + "px",
				}}
			>
				<div
					className="chart-value"
					style={{
						fontSize: valueFontSize + "px",
					}}
				>
					{value}
				</div>
				{!!title && <div className="chart-title">{title}</div>}
			</div>
		</div>
	);
};
