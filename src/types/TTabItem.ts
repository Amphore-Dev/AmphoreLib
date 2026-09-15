import type { IPictoProps } from "@components/atoms";

import type { TPictoName } from "@constants/index";

/** Shared tab-strip item shape — Tabs, and callers building tab lists elsewhere (e.g. PageHeader's own tabs). */
export interface TTabItem<T = string> {
	value: T;
	label: string;
	disabled?: boolean;
	/** Leading icon (see Picto), same convention as Input/Select — an icon name, or an `IPictoProps` object to pass other Picto props. */
	picto?: TPictoName | IPictoProps;
}
