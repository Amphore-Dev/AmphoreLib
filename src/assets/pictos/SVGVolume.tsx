import * as React from "react";
import type { SVGProps } from "react";

const SvgVolume = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={72}
		height={72}
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.5}
		className="volume_svg__feather volume_svg__feather-volume"
		viewBox="0 0 24 24"
		{...props}
	>
		<path d="M11 5 6 9H2v6h4l5 4z" />
	</svg>
);
export default SvgVolume;
