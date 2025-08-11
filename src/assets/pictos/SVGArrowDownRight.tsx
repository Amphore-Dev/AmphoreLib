import * as React from "react";
import type { SVGProps } from "react";

const SvgArrowDownRight = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={24}
		height={24}
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.5}
		className="arrow-down-right_svg__feather arrow-down-right_svg__feather-arrow-down-right"
		viewBox="0 0 24 24"
		{...props}
	>
		<path d="m7 7 10 10M17 7v10H7" />
	</svg>
);
export default SvgArrowDownRight;
