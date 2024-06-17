import React, { useRef } from "react";
import { IPoint } from "../../../types";

// extends canvas props without the onLoad and onTouchMove using Omit
export interface ICanvasProps
	extends Omit<
		React.CanvasHTMLAttributes<HTMLCanvasElement>,
		"onLoad" | "onTouchMove" | "onTouch" | "onResize"
	> {
	onLoad?: (
		canvas: HTMLCanvasElement,
		context: CanvasRenderingContext2D
	) => void;
	onAnimate?: (
		context: CanvasRenderingContext2D,
		canvas: HTMLCanvasElement,
		elapsedTime: number
	) => void;
	onTouchMove?: (e: IPoint) => void;
	onTouch?: (e: IPoint) => void;
	onResize?: (can: HTMLCanvasElement, ctx?: CanvasRenderingContext2D) => void;
	isPlaying?: boolean;
	style?: React.CSSProperties;
	onUnload?: (canvas?: HTMLCanvasElement) => void;
	showDebug?: boolean;
}

export interface ICanvasTouch
	extends React.TouchEvent<HTMLCanvasElement>,
		React.MouseEvent<HTMLCanvasElement> {
	nativeEvent: any;
}

export const Canvas: React.FC<ICanvasProps> = ({
	onLoad,
	onAnimate,
	onTouchMove,
	onTouch,
	onResize,
	onUnload,
	isPlaying = false,
	showDebug = false,
	...props
}) => {
	const [IsPlaying, setIsPlaying] = React.useState(isPlaying ?? false);
	const frameRef = React.useRef<number>(0);
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const elapsedTime = useRef(1);
	const framesCount = useRef({
		count: 0,
		fps: 0,
	});

	const debug = () => {
		const cont = document.querySelector(".debug");

		const message = `
	Width: ${canvasRef.current?.width}
	Height: ${canvasRef.current?.height}
	IsPlaying: ${IsPlaying}
	Elapsed Time: ${elapsedTime.current}
	Frames Count: ${framesCount.current.fps}
		`;
		if (cont) {
			cont.innerHTML = message;
		}
	};

	const getContext = () => {
		if (canvasRef?.current) {
			return canvasRef.current.getContext("2d");
		}
		return false;
	};

	const animate = () => {
		let start = performance.now();
		const context = getContext();
		if (!canvasRef.current || !context) return;

		onAnimate?.(context, canvasRef.current, elapsedTime.current || 1);

		let stop = performance.now();
		elapsedTime.current = stop - start;

		if (IsPlaying) frameRef.current = requestAnimationFrame(animate);
		framesCount.current = {
			...framesCount.current,
			count: framesCount.current.count + 1,
		};
		debug();
	};

	const handleTouch = (e: ICanvasTouch, moving?: boolean) => {
		const canvas = e.currentTarget;
		const rect = canvas.getBoundingClientRect();
		const x = e.touches
			? e.touches[0].clientX - rect.left
			: e.clientX - rect.left;
		const y = e.touches
			? e.touches[0].clientY - rect.top
			: e.clientY - rect.top;

		if (moving) return onTouchMove?.({ x, y });
		return onTouch?.({ x, y });
	};

	React.useEffect(() => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		const context = canvas.getContext("2d");

		if (!context) return;
		onLoad?.(canvas, context);
		if (isPlaying) animate();
	}, [canvasRef, props]);

	React.useEffect(() => {
		setIsPlaying(isPlaying);
		if (!isPlaying) cancelAnimationFrame(frameRef.current);

		return () => {
			cancelAnimationFrame(frameRef.current);
		};
	}, [isPlaying, frameRef.current]);

	const handleWindowResize = () => {
		if (!canvasRef.current) return;
		const canvas = canvasRef.current;
		canvas.width = canvas.clientWidth;
		canvas.height = canvas.clientHeight;
		const context = getContext();

		onResize?.(canvas, context || undefined);
	};

	React.useEffect(() => {
		setInterval(() => {
			framesCount.current = {
				count: 0,
				fps: framesCount.current.count,
			};
		}, 1000);

		window.addEventListener("resize", handleWindowResize);
		return () => {
			window.removeEventListener("resize", handleWindowResize);
		};
	});

	React.useEffect(() => {
		return () => {
			onUnload?.(canvasRef.current ?? undefined);
		};
	});

	return (
		<div className="h-full w-full relative">
			{showDebug && (
				<pre className="debug absolute top-0 left-0 z-10  text-white text-left" />
			)}
			<canvas
				ref={canvasRef}
				className="h-full w-full"
				onTouchMoveCapture={(event: ICanvasTouch) =>
					handleTouch(event, true)
				}
				onMouseMoveCapture={(event: ICanvasTouch) =>
					handleTouch(event, true)
				}
				{...props}
			/>
		</div>
	);
};
