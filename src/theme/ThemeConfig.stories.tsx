import React from "react";

import { useGlobals } from "storybook/preview-api";

import { ThemeConfigControls } from "../../.storybook/ThemeConfigControls";
import { Button } from "../components/atoms/Button/Button";
import { Checkbox } from "../components/atoms/Checkbox/Checkbox";
import { Input } from "../components/atoms/Input/Input";
import { Toggle } from "../components/atoms/Toggle/Toggle";

export default {
	title: "Configuration/Theme Configuration",
	tags: [],
};

/**
 * The interactive preview lives in its own component, separate from
 * `Playground` below (which calls the `useGlobals` preview hook). Typing in
 * Input / toggling Checkbox or Toggle re-renders *this* component via its
 * own local state — if that state lived in the same component as
 * `useGlobals()`, every keystroke would re-invoke that hook outside
 * Storybook's own story-render bookkeeping and crash with "Storybook
 * preview hooks can only be called inside decorators and story functions."
 * Keeping them apart means local state changes never touch the
 * useGlobals-calling component at all.
 */
function LivePreview() {
	const [value, setValue] = React.useState("");
	const [checked, setChecked] = React.useState(true);
	const [toggled, setToggled] = React.useState(true);

	return (
		<div
			style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
		>
			<div style={{ display: "flex", gap: "0.75rem" }}>
				<Button variant="solid">Primary</Button>
				<Button variant="outline">Outline</Button>
				<Button variant="ghost">Ghost</Button>
				<Button color="danger">Danger</Button>
			</div>

			<Input
				label="Customer name"
				value={value}
				onChange={setValue}
				placeholder="Jane Doe"
			/>

			<Checkbox
				label="Invoice sent"
				checked={checked}
				onChange={setChecked}
			/>

			<Toggle
				label="Notifications"
				checked={toggled}
				onChange={setToggled}
			/>
		</div>
	);
}

/**
 * Same controls as the "Amphore Theme" addon panel (bottom of every story),
 * as a dedicated canvas page — no panel to open, plus a live preview of a
 * few real components underneath so you see the effect immediately. Both
 * read/write the exact same Storybook globals, so changing one updates the
 * other instantly.
 *
 * Lives under src/theme/ (not .storybook/) because Storybook never indexes
 * story files placed inside its own config directory — confirmed the hard
 * way, the first attempt at this page silently never appeared anywhere.
 * *.stories.tsx stays excluded from the shipped lib build either way.
 */
export const Playground = () => {
	const [globals, updateGlobals] = useGlobals();

	return (
		<div
			style={{ display: "flex", gap: "2.5rem", alignItems: "flex-start" }}
		>
			<div style={{ minWidth: 260 }}>
				<ThemeConfigControls
					globals={globals}
					updateGlobals={updateGlobals}
				/>
			</div>

			<LivePreview />
		</div>
	);
};
