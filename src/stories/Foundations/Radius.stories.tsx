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

const RADIUS = tokensStartingWith("--amp-radius-");
const BORDERS = tokensStartingWith("--amp-border-width-");
const SHADOWS = tokensStartingWith("--amp-shadow-").filter(
	(name) => !name.startsWith("--amp-shadow-color")
);
const FOCUS = tokensStartingWith("--amp-focus-");
const LAYERS = tokensStartingWith("--amp-z-");
const MOTION = tokensStartingWith("--amp-duration-", "--amp-ease");

const RadiusPage = () => {
	const [values, probe] = useTokenValues([
		...RADIUS,
		...BORDERS,
		...SHADOWS,
		...FOCUS,
		...LAYERS,
		...MOTION,
	]);
	const plain = (names: string[]) =>
		names.map((name) => [<Code key="name">{name}</Code>, values[name]]);

	return (
		<Page title="Radius">
			{probe}
			<Section
				title="Radius"
				intro={
					<>
						<Code>config.style</Code> picks a preset, and{" "}
						<Code>config.radius</Code> overrides one step.
					</>
				}
			>
				<TokenTable
					head={["Token", "Value", "Sample"]}
					rows={RADIUS.map((name) => [
						<Code key="name">{name}</Code>,
						values[name],
						<span
							key="sample"
							className={styles.box}
							style={{ borderRadius: `var(${name})` }}
						/>,
					])}
				/>
			</Section>
			<Section title="Borders">
				<TokenTable
					head={["Token", "Value", "Sample"]}
					rows={BORDERS.map((name) => [
						<Code key="name">{name}</Code>,
						values[name],
						<span
							key="sample"
							className={styles.box}
							style={{ borderWidth: `var(${name})` }}
						/>,
					])}
				/>
			</Section>
			<Section title="Shadows">
				<TokenTable
					head={["Token", "Value", "Sample"]}
					rows={SHADOWS.map((name) => [
						<Code key="name">{name}</Code>,
						<Code key="value">{values[name]}</Code>,
						<span
							key="sample"
							className={styles.box}
							style={{ boxShadow: `var(${name})` }}
						/>,
					])}
				/>
			</Section>
			<Section
				title="Focus"
				intro={
					<>
						Read with <Code>@include focus-ring</Code>.
					</>
				}
			>
				<TokenTable head={["Token", "Value"]} rows={plain(FOCUS)} />
			</Section>
			<Section title="Layers">
				<TokenTable head={["Token", "Value"]} rows={plain(LAYERS)} />
			</Section>
			<Section title="Motion">
				<TokenTable head={["Token", "Value"]} rows={plain(MOTION)} />
			</Section>
		</Page>
	);
};

export default {
	title: "Foundations/Radius",
	tags: ["!autodocs"],
	parameters: { controls: { disable: true } },
};

export const Radius = () => <RadiusPage />;
