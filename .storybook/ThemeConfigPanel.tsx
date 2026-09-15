import React from "react";

import { useGlobals } from "storybook/manager-api";

import { ThemeConfigControls } from "./ThemeConfigControls";

/**
 * Global AmphoreProvider config, live-editable from Storybook's UI and
 * applied to every story via the decorator in preview.tsx. Lets you preview
 * any component under the same theme a consumer app would configure.
 * Also available as a dedicated canvas page: Concepts/Theme Configuration
 * (ThemeConfig.stories.tsx) — same controls, same globals, kept in sync.
 */
export function ThemeConfigPanel() {
	const [globals, updateGlobals] = useGlobals();

	return (
		<div style={{ padding: "1rem" }}>
			<ThemeConfigControls globals={globals} updateGlobals={updateGlobals} />
			<p style={{ fontSize: 11, opacity: 0.6, marginTop: "1rem" }}>
				Applies AmphoreProvider config globally, to every story. Matches what
				a consumer app configures at their own app root.
			</p>
		</div>
	);
}
