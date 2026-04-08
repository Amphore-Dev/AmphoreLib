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

			gap: {
				xs: "1px",
				s: "0.125rem",
				m: "0.25rem",
				l: "0.5rem",
				xl: "1rem",
				"2xl": "1.5rem",
				"3xl": "2rem",
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
				'primary': {
					'50': '#f0f8ff',
					'100': '#e0f1fe',
					'200': '#bae3fd',
					'300': '#7ecdfb',
					'400': '#39b5f7',
					'500': '#0f9be8',
					'600': '#0383d3',
					'700': '#0462a0',
					'800': '#085384',
					'900': '#0c466e',
					'950': '#082c49',
				},
				
				"accent-500": "#fa6400",

				"success-100": "#e2f7e1",
				"success-500": "#41ac3b",
				"success-600": "#2f8e2b",

				"warning-100": "#fcead8",
				"warning-500": "#ec854b",	
				"warning-600": "#e8682b",

				"error-100": "#fad1d3",
				"error-500": "#d4364d",
				"error-600": "#b02038",

				"white": "#fff",
                "black": "#000",

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

			boxShadow: {
				xs: "0 2px 2px #33333333",
			},
		},
	},
	plugins: [],
};
