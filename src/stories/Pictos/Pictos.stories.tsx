import React, { useMemo, useState } from "react";

import { StoryFn } from "@storybook/react";

import { useAmphoreDefaults } from "@theme/index";

import { InputSearch, Picto } from "@components/atoms";
import { ColorPickerField } from "@components/molecules";

import { Pictos, TPictoName } from "@constants/index";

import styles from "./PictosStory.module.scss";

// Consumer-facing catalog of every icon shipped in `Pictos` (CPictos.ts) —
// a visual reference for the exact string to pass as `<Picto icon="...">`.
// Lives under `Concepts/*` (consumer doc, like Fields/FiltersContext), not
// `Components/Atoms/Picto` — that story documents the `Picto` component's
// own props, this one documents the icon set itself. Plain `.stories.tsx`
// (not `.mdx`) because filtering ~93 icons by name needs real state, not
// just static markup.
export default {
	title: "Concepts/Pictos",
	component: Picto,
	parameters: {
		docs: {
			description: {
				component:
					'All the picto icons available in `Pictos` (`@constants/CPictos`). Click an icon to copy its name — the exact string to pass to `<Picto icon="..." />`.',
			},
		},
	},
};

const ALL_NAMES = Object.keys(Pictos) as TPictoName[];

const PictosCatalog: React.FC = () => {
	const [search, setSearch] = useState("");
	const [copied, setCopied] = useState<TPictoName | null>(null);
	const [color, setColor] = useState<string | null>("#000000");

	const filtered = useMemo(() => {
		const query = search.trim().toLowerCase();
		if (!query) return ALL_NAMES;
		return ALL_NAMES.filter((name) => name.toLowerCase().includes(query));
	}, [search]);

	const copyName = (name: TPictoName) => {
		navigator.clipboard?.writeText(name).catch(() => {
			// Clipboard API can reject (insecure context, permission denied,
			// unsupported browser) — the click itself already worked as a
			// selection aid even if the copy silently fails, so this is not
			// worth surfacing as an error to the consumer browsing the catalog.
		});
		setCopied(name);
		window.setTimeout(
			() => setCopied((current) => (current === name ? null : current)),
			1200
		);
	};

	return (
		<div className={styles.wrapper}>
			<div className={styles.toolbarWrapper}>
				<div className={styles.toolbar}>
					<InputSearch
						className={styles.search}
						value={search}
						onChange={setSearch}
						debounced={false}
						placeholder="Filter by name…"
					/>
					<ColorPickerField
						className={styles.colorPicker}
						value={color}
						onChange={setColor}
					/>
				</div>
				<span className={styles.count}>
					{filtered.length} / {ALL_NAMES.length} pictos
				</span>
			</div>

			{filtered.length === 0 ? (
				<p className={styles.empty}>
					No picto matches &quot;{search}&quot;.
				</p>
			) : (
				<div
					className={styles.grid}
					style={{
						color: color,
					}}
				>
					{filtered.map((name) => (
						<div key={name} className={styles.item}>
							<Picto
								icon={name}
								className={styles.icon}
								wrapperClassName={styles.iconButton}
								onClick={() => copyName(name)}
							/>
							<span
								className={
									copied === name
										? `${styles.name} ${styles.copied}`
										: styles.name
								}
							>
								{copied === name ? "Copied!" : name}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

const Template: StoryFn = () => <PictosCatalog />;

export const AllPictos = Template.bind({});
