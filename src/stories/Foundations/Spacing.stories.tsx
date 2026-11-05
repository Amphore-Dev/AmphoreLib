import React from "react";

import {
	Code,
	Page,
	Section,
	TokenTable,
	useTokenValues,
} from "./FoundationPage";

import styles from "./FoundationPage.module.scss";

/** Common steps. `space()` takes any multiple of 0.5. */
const STEPS = [0.5, 1, 1.5, 2, 3, 3.5, 4, 4.5, 5, 6, 8, 10, 12];
const DENSITY = ["--amp-gap", "--amp-card-padding", "--amp-section-padding"];
const FIELDS = [
	["sm", 8.5],
	["md", 10.5],
	["lg", 14.5],
] as const;

const SpacingPage = () => {
	const [values, probe] = useTokenValues(["--amp-spacing", ...DENSITY]);
	const base = values["--amp-spacing"] ?? "";
	const value = (n: number) =>
		base.endsWith("rem") ? `${parseFloat(base) * n}rem` : `${base} × ${n}`;

	return (
		<Page title="Spacing">
			{probe}
			<Section
				title="Scale"
				intro={
					<>
						One unit, <Code>config.spacing.base</Code> (
						<Code>--amp-spacing</Code>), multiplied as in Tailwind:{" "}
						<Code>space(1.5)</Code> is 1.5 units. Changing the base
						moves every gap and padding of the library.
					</>
				}
			>
				<TokenTable
					head={["SCSS", "Value", "Sample"]}
					rows={STEPS.map((n) => [
						<Code key="name">{`space(${n})`}</Code>,
						value(n),
						<span
							key="sample"
							className={styles.bar}
							style={{ width: `calc(var(--amp-spacing) * ${n})` }}
						/>,
					])}
				/>
			</Section>
			<Section
				title="Field heights"
				intro="Every field holds at least this height, whatever it contains."
			>
				<TokenTable
					head={["Size", "SCSS", "Value"]}
					rows={FIELDS.map(([size, n]) => [
						<Code key="size">{size}</Code>,
						<Code key="scss">{`space(${n})`}</Code>,
						value(n),
					])}
				/>
			</Section>
			<Section
				title="Density"
				intro={
					<>
						Set by <Code>config.density</Code>.
					</>
				}
			>
				<TokenTable
					head={["Token", "Value"]}
					rows={DENSITY.map((name) => [
						<Code key="name">{name}</Code>,
						values[name],
					])}
				/>
			</Section>
		</Page>
	);
};

export default {
	title: "Foundations/Spacing",
	tags: ["!autodocs"],
	parameters: { controls: { disable: true } },
};

export const Spacing = () => <SpacingPage />;
