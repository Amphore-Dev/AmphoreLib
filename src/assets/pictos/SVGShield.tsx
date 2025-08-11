import * as React from "react";
import type { SVGProps } from "react";

const SvgShield = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={72}
		height={72}
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.5}
		className="shield_svg__feather shield_svg__feather-shield"
		viewBox="0 0 24 24"
		{...props}
	>
		<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
	</svg>
);
export default SvgShield;
