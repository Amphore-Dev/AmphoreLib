import { useContext } from "react";

import { AmphoreDefaultsContext } from "./AmphoreDefaultsContext";
import type { TThemeLabels } from "./TThemeLabels";

/**
 * Resolves one component's translatable props against the nearest
 * `AmphoreProvider`'s `labels` config. Priority, highest first:
 * 1. the prop itself, passed directly on this instance
 * 2. `labels.<Component>.<key>` — a global override for this component only
 * 3. `labels.common.<commonKey>` — a shared override for a generic action
 *    verb (only passed where the component's own English wording is that
 *    exact bare word — see TThemeLabels.ts's own doc comment)
 * 4. the `en` bundle, always present (context default, or `en` merged as
 *    the config's own base) — the `?? ""` at the very end should never
 *    actually be reached; see `en.test.ts`'s completeness check.
 *
 *   const { resolve } = useAmphoreLabels("Badge");
 *   const removeLabel = resolve("removeLabel", removeLabelProp, "remove");
 */
export function useAmphoreLabels<K extends keyof TThemeLabels>(component: K) {
	const { labels } = useContext(AmphoreDefaultsContext);
	const own = labels?.[component] ?? {};
	const common = labels?.common ?? {};

	function resolve<F extends keyof NonNullable<TThemeLabels[K]>>(
		key: F,
		propValue: string | undefined,
		commonKey?: keyof NonNullable<TThemeLabels["common"]>
	): string {
		const ownValue = (own as Record<string, string | undefined>)[
			key as string
		];
		const commonValue = commonKey
			? (common as Record<string, string | undefined>)[
					commonKey as string
				]
			: undefined;
		return propValue ?? ownValue ?? commonValue ?? "";
	}

	return { resolve };
}
