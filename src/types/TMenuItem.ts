import type { IPictoProps } from "@components/atoms";

import type { TPictoName } from "@constants/index";

import type { TColor } from "./TColor";

/** Shared menu item shape — Dropdown, ContextMenu (and their common MenuList). */
export interface TMenuItem {
	label: string;
	/** Receives the item itself — handy for a handler shared across several items, on top of whatever a per-item closure already captures. */
	onClick: (item: TMenuItem) => void;
	disabled?: boolean;
	/** Omits the item entirely (not rendered, not counted for keyboard nav) — distinct from `disabled`, which still shows it, greyed out. */
	hidden?: boolean;
	/** Leading icon (see Picto), same convention as Input/Select — an icon name, or an `IPictoProps` object to pass other Picto props. */
	picto?: TPictoName | IPictoProps;
	/** Tints the item (e.g. "danger" for a destructive action like Delete). */
	color?: TColor;
}
