import { createContext, type CSSProperties } from "react";

import type { TThemeMode } from "./TThemeTokens";

/**
 * Everything AmphoreProvider puts on its wrapping `.amp-root` node so the
 * theme resolves for its subtree: the inline CSS-var `style`, plus the
 * `data-amp-*` attributes the scoped dark-mode `<style>` block matches on.
 */
export interface IAmphoreScope {
	scopeId: string;
	theme: TThemeMode;
	density: string;
	style: CSSProperties;
}

/**
 * The theme is applied by *DOM ancestry* — CSS vars inlined on the provider's
 * wrapper node, inherited by descendants. Anything rendered through a portal
 * (React tree child, DOM child of `document.body`) loses that inheritance and
 * renders with every `var(--amp-*)` unresolved. This context carries the
 * wrapper's attributes so `AmphoreScope` can re-apply them inside the portal.
 *
 * `null` (no provider above) — nothing to re-apply, AmphoreScope becomes a
 * passthrough.
 */
export const AmphoreScopeContext = createContext<IAmphoreScope | null>(null);
