import React from "react";

import { DEFAULT_CONFIG } from "@theme/CThemeConfig";

import {
	Code,
	Page,
	Section,
	tokensStartingWith,
	TokenTable,
	useTokenValues,
} from "./FoundationPage";

const STEPS = Object.keys(DEFAULT_CONFIG.text);
const WEIGHTS = tokensStartingWith("--amp-weight-");
const RATIOS = ["none", "tight", "snug", "normal"];

const TypographyPage = () => {
	const [values, probe] = useTokenValues([
		"--amp-font",
		...tokensStartingWith("--amp-text-", "--amp-leading-"),
		...WEIGHTS,
	]);

	return (
		<Page title="Typography">
			{probe}
			<Section
				title="Font"
				intro={
					<>
						Components inherit the app&apos;s font by default. Set{" "}
						<Code>config.typography.fontFamily</Code> to change it.
					</>
				}
			>
				<Code>--amp-font: {values["--amp-font"]}</Code>
			</Section>
			<Section
				title="Scale"
				intro={
					<>
						Sizes are Tailwind&apos;s. Line heights stay on the
						0.25rem grid, and set the height of controls. Use{" "}
						<Code>@include text(sm)</Code> for both, or{" "}
						<Code>var(--amp-text-sm)</Code> for the size alone.
					</>
				}
			>
				<TokenTable
					head={["Step", "Size", "Line height", "Sample"]}
					rows={STEPS.map((step) => [
						<Code key="step">{step}</Code>,
						values[`--amp-text-${step}`],
						values[`--amp-leading-${step}`],
						<span
							key="sample"
							style={{
								fontSize: `var(--amp-text-${step})`,
								lineHeight: `var(--amp-leading-${step})`,
							}}
						>
							The quick brown fox
						</span>,
					])}
				/>
			</Section>
			<Section
				title="Weights"
				intro={
					<>
						Read with <Code>weight(semibold)</Code>.
					</>
				}
			>
				<TokenTable
					head={["Token", "Value", "Sample"]}
					rows={WEIGHTS.map((name) => [
						<Code key="name">{name}</Code>,
						values[name],
						<span
							key="sample"
							style={{ fontWeight: `var(${name})` }}
						>
							The quick brown fox
						</span>,
					])}
				/>
			</Section>
			<Section
				title="Unitless line heights"
				intro="For text that scales with its own font size."
			>
				<TokenTable
					head={["Token", "Value"]}
					rows={RATIOS.map((step) => [
						<Code key="name">{`--amp-leading-${step}`}</Code>,
						values[`--amp-leading-${step}`],
					])}
				/>
			</Section>
		</Page>
	);
};

export default {
	title: "Foundations/Typography",
	tags: ["!autodocs"],
	parameters: { controls: { disable: true } },
};

export const Typography = () => <TypographyPage />;
