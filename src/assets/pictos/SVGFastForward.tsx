import * as React from "react";
import type { SVGProps } from "react";

const SvgFastForward = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={72}
		height={72}
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.5}
		className="fast-forward_svg__feather fast-forward_svg__feather-fast-forward"
		viewBox="0 0 24 24"
		{...props}
	>
		<path d="m13 19 9-7-9-7zM2 19l9-7-9-7z" />
	</svg>
);
export default SvgFastForward;
