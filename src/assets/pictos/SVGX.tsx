import * as React from "react";
import type { SVGProps } from "react";

const SvgX = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={72}
		height={72}
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.5}
		className="x_svg__feather x_svg__feather-x"
		viewBox="0 0 24 24"
		{...props}
	>
		<path d="M18 6 6 18M6 6l12 12" />
	</svg>
);
export default SvgX;
