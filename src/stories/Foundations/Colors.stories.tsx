import React, { useLayoutEffect, useRef, useState } from "react";

import { DEFAULT_CONFIG } from "@theme/CThemeConfig";

import { cn } from "@utils/cn";

import { Code, Page, Section, tokensStartingWith } from "./FoundationPage";

import styles from "./FoundationPage.module.scss";

const TOKENS = tokensStartingWith("--amp-color-");

/** A semantic color has a foreground and a tint, read together. */
const SEMANTIC = Object.keys(DEFAULT_CONFIG.colors)
	.filter((key) => key.endsWith("Foreground"))
	.map((key) => key.replace("Foreground", ""));

const SEMANTIC_TOKENS = SEMANTIC.flatMap((name) => [
	`--amp-color-${name}`,
	`--amp-color-${name}-fg`,
	`--amp-color-${name}-tint`,
	`--amp-color-${name}-text`,
]);

const SURFACES = TOKENS.filter((name) => !SEMANTIC_TOKENS.includes(name));

/** Hex for an opaque color, which is what a theme config is written in. */
const toHex = (color: string) => {
	const srgb = color.match(/^color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)\)$/);
	const rgb = color.match(/^rgb\((\d+), (\d+), (\d+)\)$/);
	const channels = srgb
		? srgb.slice(1, 4).map((channel) => Math.round(Number(channel) * 255))
		: rgb?.slice(1, 4).map(Number);
	return channels
		? `#${channels.map((c) => c.toString(16).padStart(2, "0")).join("")}`
		: color;
};

/** Colors resolved by the browser, `color-mix()` tints included. */
const useColorValues = () => {
	const probe = useRef<HTMLSpanElement>(null);
	const [values, setValues] = useState<Record<string, string>>({});

	useLayoutEffect(() => {
		const element = probe.current;
		if (!element) return;
		const next: Record<string, string> = {};
		for (const name of TOKENS) {
			element.style.backgroundColor = `var(${name})`;
			next[name] = toHex(getComputedStyle(element).backgroundColor);
		}
		setValues((current) =>
			JSON.stringify(current) === JSON.stringify(next) ? current : next
		);
	});

	return [values, <span key="probe" ref={probe} hidden />] as const;
};

const Swatch: React.FC<{
	name: string;
	token: string;
	value?: string;
}> = ({ name, token, value }) => (
	<div className={styles.swatch} title={token}>
		<div
			className={styles.swatchColor}
			style={{ background: `var(${token})` }}
		/>
		<span className={styles.mono}>{name}</span>
		<span className={cn([styles.mono, styles.sub])}>{value}</span>
	</div>
);

const SwatchRow: React.FC<{
	title: string;
	subtitle: string;
	items: [name: string, token: string][];
	values: Record<string, string>;
}> = ({ title, subtitle, items, values }) => (
	<div className={styles.swatchRow}>
		<div>
			<p className={styles.swatchTitle}>{title}</p>
			<span className={cn([styles.mono, styles.sub])}>{subtitle}</span>
		</div>
		<div
			className={styles.swatches}
			style={{
				gridTemplateColumns: `repeat(${Math.max(items.length, 3)}, minmax(0, 1fr))`,
			}}
		>
			{items.map(([name, token]) => (
				<Swatch
					key={token}
					name={name}
					token={token}
					value={values[token]}
				/>
			))}
		</div>
	</div>
);

const ColorsPage = () => {
	const [values, probe] = useColorValues();

	return (
		<Page title="Colors">
			{probe}
			<Section
				title="Semantic"
				intro={
					<>
						Read by components:{" "}
						<Code>--amp-color-&lt;name&gt;</Code>, with the color of
						text on top of it (<Code>-fg</Code>), a light tint (
						<Code>-tint</Code>) and the color for text on a light
						ground (<Code>-text</Code>). These are the values of the
						current theme, so the toolbar changes them live.
					</>
				}
			>
				{SEMANTIC.map((name) => (
					<SwatchRow
						key={name}
						title={name}
						subtitle={`--amp-color-${name}`}
						items={[
							[name, `--amp-color-${name}`],
							["fg", `--amp-color-${name}-fg`],
							["tint", `--amp-color-${name}-tint`],
							["text", `--amp-color-${name}-text`],
						]}
						values={values}
					/>
				))}
			</Section>
			<Section title="Surfaces and text">
				<SwatchRow
					title="Surfaces"
					subtitle="--amp-color-*"
					items={SURFACES.map((token) => [
						token.replace("--amp-color-", ""),
						token,
					])}
					values={values}
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
