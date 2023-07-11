/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			/* Padding */
			padding: {
				xs: "0.25rem",
				s: "0.5rem",
				m: "1rem",
				l: "1.5rem",
				xl: "2rem",
				xxl: "2.5rem",
			},

			/* Margin */
			margin: {
				xs: "0.25rem",
				s: "0.5rem",
				m: "1rem",
				l: "1.5rem",
				xl: "2rem",
				xxl: "2.5rem",
			},

			/* Radiuses */
			borderRadius: {
				2: "0.125rem",
				4: "0.25rem",
				8: "0.5rem",
				16: "1rem",
				32: "2rem",
				40: "2.5rem",
				full: "50%",
			},


			/* Colors */
			colors: {
				"primary-50": "#F0E6F2",
				"primary-100": "#f3dcf9",
				"primary-300": "#c7a4d1",
				"primary-500": "#741b8c",
				"primary-600": "#4A1159",
				"primary-800": "#461054",
				"accent-500": "#fa6400",
				"success-100": "#CCE8E4",
				"success-500": "#6cca67",
				"success-600": "#326961",
				"warning-500": "#d4364d",
				"error-500": "#d4364d",
				"error-600": "#E55151",
				white: "#fff",
				black: "#333333",
				"neutral-50": "#f9f9f9",
				"neutral-100": "#f3f3f4",

				"neutral-150": "#e7e6e6",
				"neutral-200": "#e1e1e3",
				"neutral-300": "#cecfd2",
				"neutral-500": "#85868f",
				"rating-range-1": "#d4364d",
				"rating-range-2": "#e8682b",
				"rating-range-3": "#41793e",
				"rating-range-4": "#6cca67",
				"progress-bar": "#FFF0E5",
			},

			/* Fonts */
			fontFamily: {
				primary: ["DM Sans", "Arial", "sans-serif"],
			},

			fontSize: {
				"paragraph-03": "10px",
				"paragraph-02": "12px",
				"paragraph-01": "16px",
				"heading-03": "20px",
				"heading-02": "25px",
				"heading-01": "30px",
			},

			fontWeight: {
				semibold: "500",
			},

			screens: {
				xs: "420px",
				"2md": "900px",
			},
		},
	},
	plugins: [],
};
