import React from "react";
import { ILoremIpsumParams, loremIpsum } from "lorem-ipsum";

export interface ILoremIpsumProps extends ILoremIpsumParams {
	className?: string;
}

export const LoremIpsum: React.FC<ILoremIpsumProps> = (props) => {
	const elemRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (!elemRef.current) return;
		// create node and render it in the ref
		const node = document.createElement("div");
		node.innerHTML = loremIpsum({
			suffix: "<br/>",
			count: 1,
			format: "html",
			paragraphLowerBound: 3,
			sentenceLowerBound: 3,
			units: "sentences",
			...props,
		});

		elemRef.current.innerHTML = node.innerHTML;
	});
	return <p ref={elemRef} className={props.className} />;
};
