declare module "*.svg" {
	import React from "react";
	export const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
	const src: string;
	export default src;
}
