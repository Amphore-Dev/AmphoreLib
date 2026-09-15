import { createContext } from "react";

import { en } from "../locales/en";

import type { TThemeLabels } from "./TThemeLabels";
import type { TThemeDefaults } from "./TThemeTokens";

export type TAmphoreContextValue = TThemeDefaults & {
	labels: TThemeLabels;
};

/**
 * Carries the `defaults` and `labels` slices of the nearest AmphoreProvider's
 * config. Separate from the CSS-var mechanism (colors/radius/spacing) —
 * `size` decides which discrete `data-size` attribute a component renders,
 * and label text is rendered content, neither of which CSS variables can
 * express, so both are resolved in JS via this context instead.
 *
 * Defaults to the full `en` bundle (not `{}`) — a component rendered with
 * no `<AmphoreProvider>` anywhere above it (a unit test rendering it bare,
 * a consumer not using the provider at all) still resolves real English
 * text through `useAmphoreLabels`, not an empty string.
 */
export const AmphoreDefaultsContext = createContext<TAmphoreContextValue>({
	labels: en,
});
