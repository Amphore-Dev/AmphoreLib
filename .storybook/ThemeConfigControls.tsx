import React from "react";

export const STYLE_OPTIONS = ["default", "sharp", "round"] as const;
export const DENSITY_OPTIONS = ["comfortable", "compact"] as const;
export const DEFAULT_SIZE_OPTIONS = ["default", "sm", "md", "lg"] as const;
export const THEME_OPTIONS = ["system", "light", "dark"] as const;
export const LOCALE_OPTIONS = ["default", "en", "fr"] as const;

const row: React.CSSProperties = {
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: "0.75rem",
	padding: "0.5rem 0",
};

const label: React.CSSProperties = {
	fontSize: 13,
	fontWeight: 600,
};

export type TAmphoreGlobals = {
	ampStyle?: string;
	ampPrimary?: string;
	ampDensity?: string;
	ampDefaultSize?: string;
	ampTheme?: string;
	ampLocale?: string;
};

export interface IThemeConfigControlsProps {
	globals: TAmphoreGlobals;
	updateGlobals: (globals: Partial<TAmphoreGlobals>) => void;
}

/**
 * Pure UI for the live AmphoreProvider config controls — no dependency on
 * where `useGlobals` came from. Used both by the manager-side addon panel
 * (ThemeConfigPanel.tsx, `storybook/manager-api`) and the preview-side
 * dedicated page (ThemeConfig.stories.tsx, `storybook/preview-api`) so the
 * two stay pixel-identical and in sync (same underlying Storybook globals).
 */
export function ThemeConfigControls({
	globals,
	updateGlobals,
}: IThemeConfigControlsProps) {
	const ampStyle = globals.ampStyle ?? "default";
	const ampPrimary = globals.ampPrimary ?? "";
	const ampDensity = globals.ampDensity ?? "comfortable";
	const ampDefaultSize = globals.ampDefaultSize ?? "default";
	const ampTheme = globals.ampTheme ?? "system";
	const ampLocale = globals.ampLocale ?? "default";

	return (
		<div style={{ fontFamily: "sans-serif" }}>
			<div style={row}>
				<span style={label}>Theme</span>
				<select
					value={ampTheme}
					onChange={(e) =>
						updateGlobals({ ampTheme: e.target.value })
					}
				>
					{THEME_OPTIONS.map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</select>
			</div>

			<div style={row}>
				<span style={label}>Locale (AmphoreProvider.locale)</span>
				<select
					value={ampLocale}
					onChange={(e) =>
						updateGlobals({ ampLocale: e.target.value })
					}
				>
					{LOCALE_OPTIONS.map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</select>
			</div>

			<div style={row}>
				<span style={label}>Style (radius preset)</span>
				<select
					value={ampStyle}
					onChange={(e) =>
						updateGlobals({ ampStyle: e.target.value })
					}
				>
					{STYLE_OPTIONS.map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</select>
			</div>

			<div style={row}>
				<span style={label}>Primary color</span>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "0.5rem",
					}}
				>
					<input
						type="color"
						value={ampPrimary || "#0f9be8"}
						onChange={(e) =>
							updateGlobals({ ampPrimary: e.target.value })
						}
					/>
					<button
						type="button"
						onClick={() => updateGlobals({ ampPrimary: undefined })}
						style={{ fontSize: 12 }}
					>
						Reset
					</button>
				</div>
			</div>

			<div style={row}>
				<span style={label}>Density</span>
				<select
					value={ampDensity}
					onChange={(e) =>
						updateGlobals({ ampDensity: e.target.value })
					}
				>
					{DENSITY_OPTIONS.map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</select>
			</div>

			<div style={row}>
				<span style={label}>Default size (config.defaults.size)</span>
				<select
					value={ampDefaultSize}
					onChange={(e) =>
						updateGlobals({ ampDefaultSize: e.target.value })
					}
				>
					{DEFAULT_SIZE_OPTIONS.map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}
