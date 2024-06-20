import React from "react";

import { Meta, ColorPalette, ColorItem } from "@storybook/addon-docs";

export default {
	title: "Style Guide/Colors",
	parameters: {
		docs: {
			page: () => (
				<>
					<Meta title="Style Guide/Colors" />
					<h1>Colors</h1>
					<div className="pt-32">
						<ColorPalette>
							<ColorItem
								title="Primary"
								subtitle="Shades of Purple"
								colors={{
									"primary-50": "#f0f8ff",
									"primary-100": "#e0f1fe",
									"primary-200": "#bae3fd",
									"primary-300": "#7ecdfb",
									"primary-400": "#39b5f7",
									"primary-500": "#0f9be8",
									"primary-600": "#0383d3",
									"primary-700": "#0462a0",
									"primary-800": "#085384",
									"primary-900": "#0c466e",
									"primary-950": "#082c49",
								}}
							/>
							<ColorItem
								title="Accent"
								subtitle="Orange"
								colors={{
									"accent-500": "#fa6400",
								}}
							/>
							<ColorItem
								title="Success"
								subtitle="Shades of Green"
								colors={{
									"success-100": "#CCE8E4",
									"success-500": "#6cca67",
									"success-600": "#326961",
								}}
							/>
							<ColorItem
								title="Warning"
								subtitle="Red"
								colors={{
									"warning-500": "#d4364d",
								}}
							/>
							<ColorItem
								title="Error"
								subtitle="Red"
								colors={{
									"error-500": "#d4364d",
									"error-600": "#E55151",
								}}
							/>
							<ColorItem
								title="Others"
								subtitle="Neutral Colors"
								colors={{
									white: "#fff",
									"neutral-50": "#f9f9f9",
									"neutral-100": "#f3f3f4",
									"neutral-150": "#e7e6e6",
									"neutral-200": "#e1e1e3",
									"neutral-300": "#cecfd2",
									"neutral-500": "#85868f",
									"neutral-600": "#666666",
									"neutral-700": "#4d4d4d",
									"neutral-800": "#333333",
									black: "#000",
								}}
							/>
							<ColorItem
								title="Rating Range"
								subtitle="Shades of Colors"
								colors={{
									"rating-range-1": "#d4364d",
									"rating-range-2": "#e8682b",
									"rating-range-3": "#41793e",
									"rating-range-4": "#6cca67",
								}}
							/>
							<ColorItem
								title="Progress Bar"
								subtitle="Peach"
								colors={{
									"progress-bar": "#FFF0E5",
								}}
							/>
						</ColorPalette>
					</div>
				</>
			),
		},
	},
};

export const All = () => <></>;
