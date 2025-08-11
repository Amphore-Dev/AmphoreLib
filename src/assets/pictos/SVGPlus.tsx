import * as React from "react";
import type { SVGProps } from "react";

const SvgPlus = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={72}
		height={72}
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.5}
		className="plus_svg__feather plus_svg__feather-plus"
		viewBox="0 0 24 24"
		{...props}
	>
		<path d="M12 5v14M5 12h14" />
	</svg>
);
export default SvgPlus;
