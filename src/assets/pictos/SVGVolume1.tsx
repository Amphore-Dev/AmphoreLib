import * as React from "react";
import type { SVGProps } from "react";

const SvgVolume1 = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={72}
		height={72}
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.5}
		className="volume-1_svg__feather volume-1_svg__feather-volume-1"
		viewBox="0 0 24 24"
		{...props}
	>
		<path d="M11 5 6 9H2v6h4l5 4zM15.54 8.46a5 5 0 0 1 0 7.07" />
	</svg>
);
export default SvgVolume1;
