import { PredicateParams, useContextMenu } from "react-contexify";

import { TContextMenuItem } from "@interfaces/TContextMenu";
import { TTableItemAction } from "@interfaces/TTable";

/**
 * Wires a set of declarative row actions (label/icon/onClick/disabled/hidden)
 * to a react-contexify menu, so a Table's "contextMenu" column can trigger it
 * both from the row hover button and a native right-click.
 */
export function useRowActionsMenu<T>(
	id: string,
	actions: TTableItemAction<T>[] = []
) {
	const { show } = useContextMenu({ id });

	const items: TContextMenuItem[] = actions.map((action, index) => ({
		id: `${id}-${index}`,
		label: action.label,
		icon: action.icon,
		disabled: ({ props }: PredicateParams) =>
			typeof action.disabled === "function"
				? action.disabled(props as T)
				: !!action.disabled,
		hidden: ({ props }: PredicateParams) =>
			typeof action.hidden === "function"
				? action.hidden(props as T)
				: !!action.hidden,
		onClick: ({ props, event }) =>
			action.onClick(props as T, event as unknown as React.MouseEvent),
	}));

	const showFor = (item: T, event: React.MouseEvent) => {
		show({ event, props: item });
	};

	return { items, showFor };
}
