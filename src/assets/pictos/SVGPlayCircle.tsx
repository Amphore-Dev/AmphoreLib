import * as React from "react";
import type { SVGProps } from "react";

const SvgPlayCircle = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={24}
		height={24}
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.5}
		className="play-circle_svg__feather play-circle_svg__feather-play-circle"
		viewBox="0 0 24 24"
		{...props}
	>
		<circle cx={12} cy={12} r={10} />
		<path d="m10 8 6 4-6 4z" />
	</svg>
);
export default SvgPlayCircle;
