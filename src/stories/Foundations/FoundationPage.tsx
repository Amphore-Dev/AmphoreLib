import React, { ReactNode, useLayoutEffect, useRef, useState } from "react";

import { configToCssVars, mergeConfig } from "@theme/UThemeConfig";

import styles from "./FoundationPage.module.scss";

/** Every token the theme emits, so a page cannot drift from the config. */
const ALL_TOKENS = Object.keys(configToCssVars(mergeConfig()));

export const tokensStartingWith = (...prefixes: string[]) =>
	ALL_TOKENS.filter((name) =>
		prefixes.some((prefix) => name.startsWith(prefix))
	);

/**
 * Current value of each token, read under the nearest provider so a page
 * follows the "Amphore Theme" panel. Render the returned probe in the page.
 */
export const useTokenValues = (names: string[]) => {
	const probe = useRef<HTMLSpanElement>(null);
	const [values, setValues] = useState<Record<string, string>>({});

	useLayoutEffect(() => {
		if (!probe.current) return;
		const style = getComputedStyle(probe.current);
		const next = Object.fromEntries(
			names.map((name) => [name, style.getPropertyValue(name).trim()])
		);
		setValues((current) =>
			JSON.stringify(current) === JSON.stringify(next) ? current : next
		);
	});

	return [values, <span key="probe" ref={probe} hidden />] as const;
};

export const Code: React.FC<{ children: ReactNode }> = ({ children }) => (
	<code className={styles.code}>{children}</code>
);

export const Page: React.FC<{ title: string; children: ReactNode }> = ({
	title,
	children,
}) => (
	<div className={styles.page}>
		<h1 className={styles.title}>{title}</h1>
		{children}
	</div>
);

export const Section: React.FC<{
	title: string;
	intro?: ReactNode;
	children: ReactNode;
}> = ({ title, intro, children }) => (
	<section className={styles.section}>
		<h2 className={styles.sectionTitle}>{title}</h2>
		{intro && <p className={styles.intro}>{intro}</p>}
		{children}
	</section>
);

export const TokenTable: React.FC<{
	head: string[];
	rows: ReactNode[][];
}> = ({ head, rows }) => (
	<table className={styles.table}>
		<thead>
			<tr>
				{head.map((label) => (
					<th key={label}>{label}</th>
				))}
			</tr>
		</thead>
		<tbody>
			{rows.map((cells, row) => (
				<tr key={row}>
					{cells.map((cell, column) => (
						<td key={column}>{cell}</td>
					))}
				</tr>
			))}
		</tbody>
	</table>
);
