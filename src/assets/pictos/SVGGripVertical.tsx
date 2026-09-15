import * as React from "react";
import type { SVGProps } from "react";

const SvgGripVertical = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={24}
		height={24}
		fill="currentColor"
		stroke="none"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.5}
		className="grip-vertical_svg__feather grip-vertical_svg__feather-grip-vertical"
		viewBox="0 0 24 24"
		{...props}
	>
		<circle cx={9} cy={5} r={1.5} fill="currentColor" stroke="none" />
		<circle cx={9} cy={12} r={1.5} fill="currentColor" stroke="none" />
		<circle cx={9} cy={19} r={1.5} fill="currentColor" stroke="none" />
		<circle cx={15} cy={5} r={1.5} fill="currentColor" stroke="none" />
		<circle cx={15} cy={12} r={1.5} fill="currentColor" stroke="none" />
		<circle cx={15} cy={19} r={1.5} fill="currentColor" stroke="none" />
	</svg>
);
export default SvgGripVertical;
