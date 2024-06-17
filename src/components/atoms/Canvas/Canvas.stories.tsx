import React from "react";
import { StoryFn } from "@storybook/react";
import { Canvas } from "./Canvas";

export default {
	title: "Components/Atoms/Canvas",
	component: Canvas,
	argTypes: {
		onLoad: {
			action: "onLoad",
		},
		onAnimate: {
			action: "onAnimate",
		},
		onTouchMove: {
			action: "onTouchMove",
		},
		onTouch: {
			action: "onTouch",
		},
		onResize: {
			action: "onResize",
		},
		onUnload: {
			action: "onUnload",
		},
		isPlaying: {
			control: "boolean",
		},
		showDebug: {
			control: "boolean",
		},
	},
};

const Template: StoryFn = (props) => {

	const drawCircle = (canvas:HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
		ctx.strokeStyle = "#00FF00";
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.arc(canvas.width/2, canvas.height/2, 40, 0, 2 * Math.PI);
		ctx.stroke();
	
	}

	const drawRect = (canvas:HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
		ctx.strokeStyle = "#0000FF";
		ctx.beginPath();
		ctx.rect(20, 20, 150, 100);
		ctx.stroke();
	}

	const drawTriangle = (canvas:HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
		ctx.fillStyle = "#FF0000";
		ctx.beginPath();
		ctx.moveTo(75, 50);
		ctx.lineTo(100, 75);
		ctx.lineTo(100, 25);
		ctx.fill();
	}

	const initCanvas = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
		drawCircle(canvas, ctx);
		drawRect(canvas, ctx);
		drawTriangle(canvas, ctx);
	}


	return <Canvas {...props} onLoad={initCanvas} className="border-2" />;
};

export const Base: any = Template.bind({});

Base.args = {};
