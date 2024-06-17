export interface IActionListItemLinkTo {
	pathname: string;
	state?: any;
}
export interface IActionsListItem {
	key?: string;
	label: string;
	icon?: string;
	linkTo?: string | ((item: any) => string | IActionListItemLinkTo);
	onClick?: (item: any) => void;
	render?: (item: any, defaultRender?: React.ReactNode) => React.ReactNode; // used to render custom action
	disabled?: boolean;
	className?: string;
}
