import * as React from "react";
import type { SVGProps } from "react";

const SvgInfoCircle = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={72}
		height={72}
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.5}
		className="info-circle_svg__feather info-circle_svg__feather-info"
		viewBox="0 0 24 24"
		{...props}
	>
		<circle cx={12} cy={12} r={10} />
		<path d="M12 16v-4M12 8h.01" />
	</svg>
);
export default SvgInfoCircle;
