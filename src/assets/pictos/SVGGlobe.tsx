import * as React from "react";
import type { SVGProps } from "react";

const SvgGlobe = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={24}
		height={24}
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.5}
		className="globe_svg__feather globe_svg__feather-globe"
		viewBox="0 0 24 24"
		{...props}
	>
		<circle cx={12} cy={12} r={10} />
		<path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10" />
	</svg>
);
export default SvgGlobe;
