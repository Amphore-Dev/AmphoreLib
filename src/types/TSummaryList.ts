import type { IPictoProps } from "@components/atoms";

import type { TPictoName } from "@constants/index";

/** Shared summary-list row shape — SummaryList/SummaryListItem, and callers building rows programmatically (e.g. EditableCard's display mode). */
export interface TSummaryListItem {
	label: string;
	value: React.ReactNode;
	required?: boolean;
	/** Renders `value` as a link. */
	href?: string;
	/** Renders `value` as a clickable control (ignored if `href` is set). */
	onClick?: () => void;
	/** Leading icon (see Picto) — an icon name, or an `IPictoProps` object to pass other Picto props. */
	picto?: TPictoName | IPictoProps;
	/** Truncates `value` past this many lines (single-line string values only), with a Tooltip showing the full text. */
	maxLines?: number;
	action?: TSummaryListAction;
}

export interface TSummaryListAction {
	label: string;
	onClick: () => void;
	picto?: TPictoName | IPictoProps;
}
