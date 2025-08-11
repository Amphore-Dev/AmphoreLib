import * as React from "react";
import type { SVGProps } from "react";

const SvgActivity = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={72}
		height={72}
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.5}
		className="activity_svg__feather activity_svg__feather-activity"
		viewBox="0 0 24 24"
		{...props}
	>
		<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
	</svg>
);
export default SvgActivity;
