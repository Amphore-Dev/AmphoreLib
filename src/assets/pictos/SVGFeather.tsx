import * as React from "react";
import type { SVGProps } from "react";

const SvgFeather = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={72}
		height={72}
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.5}
		className="feather_svg__feather feather_svg__feather-feather"
		viewBox="0 0 24 24"
		{...props}
	>
		<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5zM16 8 2 22M17.5 15H9" />
	</svg>
);
export default SvgFeather;
