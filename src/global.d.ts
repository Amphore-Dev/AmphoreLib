declare module "*.module.scss" {
	const classes: { readonly [key: string]: string };
	export default classes;
}

declare module "*.scss" {
	const content: string;
	export default content;
}

declare module "*.svg" {
	import type { FC, SVGProps } from "react";
	const ReactComponent: FC<SVGProps<SVGSVGElement>>;
	export default ReactComponent;
}

declare module "*.png" {
	const src: string;
	export default src;
}

declare module "*?url" {
	const src: string;
	export default src;
}
