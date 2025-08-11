import * as React from "react";
import type { SVGProps } from "react";

const SvgSkipBack = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={24}
		height={24}
		fill="none"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth={1.5}
		className="skip-back_svg__feather skip-back_svg__feather-skip-back"
		viewBox="0 0 24 24"
		{...props}
	>
		<path d="M19 20 9 12l10-8zM5 19V5" />
	</svg>
);
export default SvgSkipBack;
