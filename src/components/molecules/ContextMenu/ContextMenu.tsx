import React from "react";

import { Item, ItemParams, Menu, MenuProps, Submenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";

import { Picto } from "@components/atoms";
import { TContextMenuItem } from "@interfaces/TContextMenu";

import "./ContextMenu.scss";

export interface IContextMenuProps extends Omit<MenuProps, "children"> {
	id: string;
	items: TContextMenuItem[];
	onItemClick?: (e: ItemParams) => void;
}

export const ContextMenu: React.FC<IContextMenuProps> = ({
	id,
	items,
	onItemClick = () => {},
	...menuProps
}) => {
	const genItem = (item: TContextMenuItem) => {
		const content = (
			<div className="al__context-menu__item">
				{item.icon && (
					<Picto icon={item.icon} className="al__context-menu__icon" />
				)}
				<div className="al__context-menu__label">{item.label}</div>
			</div>
		);

		if (item.items?.length) {
			return (
				<Submenu key={item.id} label={content} hidden={item.hidden}>
					{item.items.map((subItem) => genItem(subItem))}
				</Submenu>
			);
		}

		return (
			<Item
				key={item.id}
				disabled={item.disabled}
				hidden={item.hidden}
				onClick={item.onClick ?? onItemClick}
			>
				{content}
			</Item>
		);
	};

	return (
		<Menu id={id} {...menuProps}>
			{items.map(genItem)}
		</Menu>
	);
};
