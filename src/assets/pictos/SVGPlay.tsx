import * as React from "react";
import type { SVGProps } from "react";

const SvgPlay = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={72}
		height={72}
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.5}
		className="play_svg__feather play_svg__feather-play"
		viewBox="0 0 24 24"
		{...props}
	>
		<path d="m5 3 14 9-14 9z" />
	</svg>
);
export default SvgPlay;
