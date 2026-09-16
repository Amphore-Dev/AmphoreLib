import React, { useId, useMemo, type PropsWithChildren } from "react";

import { fr } from "../locales/fr";

import { AmphoreDefaultsContext } from "./AmphoreDefaultsContext";
import { AmphoreScopeContext, type IAmphoreScope } from "./AmphoreScopeContext";
import type { TThemeConfigInput, TThemeMode } from "./TThemeTokens";
import {
	colorsToCssVars,
	configToCssVars,
	cssVarsToDeclarations,
	mergeConfig,
} from "./UThemeConfig";

export type TAmphoreLocale = "en" | "fr";

export interface IAmphoreProviderProps extends PropsWithChildren {
	/** Partial theme config, deep-merged onto the lib defaults. Omit entirely to use defaults. */
	config?: TThemeConfigInput;
	/**
	 * Shorthand for a full-lib translation, same idea as `theme` below.
	 * "en" needs nothing — it's already the built-in default (`en.ts`).
	 * "fr" applies the `fr` bundle before `config.labels`, which still wins
	 * per-key on top of it — same as passing `config={{ labels: fr, ... }}`
	 * yourself, just without importing `fr` at the call site.
	 */
	locale?: TAmphoreLocale;
	/**
	 * "light"/"dark" pin that palette (sets `data-amp-theme`). "system"
	 * (default) follows the OS via `prefers-color-scheme` — resolved in CSS,
	 * not JS, so there's no hydration mismatch and no re-render on OS change.
	 */
	theme?: TThemeMode;
	/** Element type for the wrapping node. Defaults to "div". */
	as?: keyof JSX.IntrinsicElements;
}

/**
 * Wrap your app (or a subtree) to apply an AmphoreLib theme.
 * Nested providers are supported — the innermost one wins for its subtree.
 *
 *   <AmphoreProvider config={{ colors: { primary: '#e2673f' }, style: 'round' }}>
 *     <App />
 *   </AmphoreProvider>
 */
export function AmphoreProvider({
	config,
	locale,
	theme = "system",
	as = "div",
	children,
}: IAmphoreProviderProps) {
	const resolved = useMemo(
		() =>
			mergeConfig({
				...config,
				labels:
					locale === "fr"
						? { ...fr, ...config?.labels }
						: config?.labels,
			}),
		[config, locale]
	);
	const lightStyle = useMemo(() => configToCssVars(resolved), [resolved]);
	const darkColorVars = useMemo(
		() => colorsToCssVars(resolved.darkColors),
		[resolved]
	);

	// Scopes the dark-mode <style> block to this provider instance only —
	// nested providers each get their own id, so an outer dark theme never
	// leaks its override into an inner provider's own subtree.
	const scopeId = useId().replace(/:/g, "");
	const darkDeclarations = cssVarsToDeclarations(darkColorVars);

	// What AmphoreScope needs to rebuild this wrapper inside a portal — see
	// AmphoreScopeContext. Memoized so portaled subtrees don't re-render on
	// every provider render.
	const scope = useMemo<IAmphoreScope>(
		() => ({
			scopeId,
			theme,
			density: resolved.density,
			style: lightStyle,
		}),
		[scopeId, theme, resolved.density, lightStyle]
	);

	const Tag = as as "div";
	return (
		<Tag
			className="amp-root"
			data-amp-scope={scopeId}
			data-amp-theme={theme === "system" ? undefined : theme}
			style={lightStyle}
			data-amp-density={resolved.density}
		>
			{/*
			  Inline `style` can't express a @media query, so the "system"
			  case (follow the OS) has to live in a real <style> tag. Scoped
			  by the unique data-amp-scope attribute rather than an id/class
			  to avoid any collision across nested/sibling providers.
			*/}
			<style>
				{`[data-amp-scope="${scopeId}"][data-amp-theme="dark"] { ${darkDeclarations} }
@media (prefers-color-scheme: dark) {
  [data-amp-scope="${scopeId}"]:not([data-amp-theme="light"]):not([data-amp-theme="dark"]) { ${darkDeclarations} }
}`}
			</style>
			<AmphoreScopeContext.Provider value={scope}>
				<AmphoreDefaultsContext.Provider
					value={{ ...resolved.defaults, labels: resolved.labels }}
				>
					{children}
				</AmphoreDefaultsContext.Provider>
			</AmphoreScopeContext.Provider>
		</Tag>
	);
}
