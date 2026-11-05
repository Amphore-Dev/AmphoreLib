import React from "react";

import {
	Code,
	Page,
	Section,
	tokensStartingWith,
	TokenTable,
	useTokenValues,
} from "./FoundationPage";

import styles from "./FoundationPage.module.scss";

const COLORS = tokensStartingWith("--amp-color-");

const ColorsPage = () => {
	const [values, probe] = useTokenValues(COLORS);

	return (
		<Page title="Colors">
			{probe}
			<Section
				title="Palette"
				intro="Components read these tokens, never a raw color. Flip the theme in the toolbar to see the dark palette."
			>
				<TokenTable
					head={["Token", "Value", "Sample"]}
					rows={COLORS.map((name) => [
						<Code key="name">{name}</Code>,
						<Code key="value">{values[name]}</Code>,
						<span
							key="sample"
							className={styles.swatch}
							style={{ background: `var(${name})` }}
						/>,
					])}
				/>
			</Section>
		</Page>
	);
};

export default {
	title: "Foundations/Colors",
	tags: ["!autodocs"],
	parameters: { controls: { disable: true } },
};

export const Colors = () => <ColorsPage />;
