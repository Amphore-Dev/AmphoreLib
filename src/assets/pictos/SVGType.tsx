import * as React from "react";
import type { SVGProps } from "react";

const SvgType = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={72}
		height={72}
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.5}
		className="type_svg__feather type_svg__feather-type"
		viewBox="0 0 24 24"
		{...props}
	>
		<path d="M4 7V4h16v3M9 20h6M12 4v16" />
	</svg>
);
export default SvgType;
