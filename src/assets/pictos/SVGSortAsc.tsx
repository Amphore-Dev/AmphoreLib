import * as React from "react";
import type { SVGProps } from "react";

const SvgSortAsc = (props: SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		xmlSpace="preserve"
		id="sort-asc_svg__Calque_1"
		x={0}
		y={0}
		viewBox="0 0 72 72"
		stroke="currentColor"
		{...props}
	>
		<style>
			{
				".sort-asc_svg__al_sort_picto{stroke-width:4.5;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:12}"
			}
		</style>
		<path
			d="M44.3 35.4H22.8M44.3 53.4H9.8M44.3 17.4h-8.6M57.8 11.7v48M64 53.5l-6.2 6.2"
			className="sort-asc_svg__al_sort_picto"
		/>
	</svg>
);
export default SvgSortAsc;
