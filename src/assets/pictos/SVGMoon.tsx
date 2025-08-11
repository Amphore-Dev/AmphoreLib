import * as React from "react";
import type { SVGProps } from "react";

const SvgMoon = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={72}
		height={72}
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.5}
		className="moon_svg__feather moon_svg__feather-moon"
		viewBox="0 0 24 24"
		{...props}
	>
		<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79" />
	</svg>
);
export default SvgMoon;
