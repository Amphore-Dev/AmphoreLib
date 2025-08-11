import * as React from "react";
import type { SVGProps } from "react";

const SvgNavigation = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={72}
		height={72}
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.5}
		className="navigation_svg__feather navigation_svg__feather-navigation"
		viewBox="0 0 24 24"
		{...props}
	>
		<path d="m3 11 19-9-9 19-2-8z" />
	</svg>
);
export default SvgNavigation;
