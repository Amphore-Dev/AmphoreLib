import { useContext } from "react";

import { AmphoreDefaultsContext } from "./AmphoreDefaultsContext";

/**
 * Reads `config.defaults` from the nearest AmphoreProvider (e.g.
 * `defaults.size`). Returns `{}` outside any provider — components must
 * still apply their own hardcoded fallback (e.g. `?? "md"`) in that case,
 * this hook never invents one itself.
 *
 *   const { size: defaultSize } = useAmphoreDefaults();
 *   const size = sizeProp ?? defaultSize ?? "md";
 */
export function useAmphoreDefaults() {
	return useContext(AmphoreDefaultsContext);
}
