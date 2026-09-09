import { BooleanPredicate, ItemParams } from "react-contexify";

import { TPictoName } from "@constants/CPictos";

export type TContextMenuItem = {
	id: string;
	label: string | React.ReactNode;
	icon?: TPictoName;
	items?: TContextMenuItem[];
	onClick?: (e: ItemParams) => void;
	disabled?: BooleanPredicate;
	hidden?: BooleanPredicate;
};
