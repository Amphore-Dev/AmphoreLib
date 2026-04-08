import React, { memo, useMemo, useRef } from "react";

import { TTableCell } from "@interfaces/TTable";

import { Button } from "../Button/Button";
import { Checkbox } from "../Checkbox/Checkbox";
import { Picto } from "../Picto/Picto";
import { Popover } from "../Popover/Popover";
import { ITagProps, Tag } from "../Tag/Tag";
import { TruncatedTooltipText } from "../TruncatedTooltipText/TruncatedTooltipText";

import { cn } from "@utils/cn";

import "./TableCell.scss";

export interface ITableCellProps<T = unknown> extends TTableCell<T> {
	render?: React.ReactNode | ((props: TTableCell<T>) => React.ReactNode);
	showOnHover?: boolean;
	className?: string;
}

const TableCellInner = <T,>(props: ITableCellProps<T>) => {
	const {
		value,
		description,
		badge,
		render,
		itemActions,
		onClick,
		onSelect,
		selectable,
		button,
		size,
		className,
		item = {} as T,
		checked,
		picto,
		disabled,
		isSelectCell,
		marginRight,
		showOnHover = undefined,
		itemsActionsStrategy,
	} = props;

	const refs = {
		cell: useRef<HTMLTableCellElement>(null),
		itemActions: useRef<HTMLDivElement>(null),
		button: useRef<HTMLButtonElement>(null),
		checkbox: useRef<HTMLInputElement>(null),
	};

	const badgeLabel = useMemo(() => {
		if (typeof badge === "string") {
			return badge;
		}
		if (typeof badge === "function") {
			const ret = badge(item);
			if (!ret) return undefined;
			return typeof ret === "string" ? ret : ret?.label;
		}
		if (typeof badge === "object") {
			return badge.label;
		}
		return undefined;
	}, [badge, item]);

	const badgeColor = useMemo(() => {
		const _badge = typeof badge === "function" ? badge(item) : badge;
		if (typeof _badge === "object") {
			return _badge.color ?? "primary";
		}

		return "primary";
	}, [badge]) as ITagProps["color"];

	const badgeSize = useMemo(() => {
		const _badge = typeof badge === "function" ? badge(item) : badge;
		if (typeof _badge === "object") {
			return _badge.size ?? "s";
		}

		return "s";
	}, [badge]) as ITagProps["size"];

	const filteredItemActions = useMemo(() => {
		if (!itemActions) return [];

		if (typeof itemActions === "function") {
			return itemActions(item) || [];
		}

		return itemActions.filter((action) => {
			const isHidden =
				typeof action.hidden === "function"
					? action.hidden(item)
					: action.hidden;
			return !isHidden;
		});
	}, [itemActions, item]);

	const isActionCell = useMemo(() => {
		if (itemActions?.length) {
			return true;
		}
		if (button) {
			return true;
		}
		if (onClick) {
			return true;
		}
		if (isSelectCell) {
			return true;
		}
		return false;
	}, [itemActions, button, onClick, onSelect]);

	const genCellBody = useMemo(() => {
		if (render) {
			return typeof render === "function" ? render(props) : render;
		}

		const cellValue = typeof value === "function" ? value(item) : value;
		const cellDescription =
			typeof description === "function" ? description(item) : description;

		return !!cellValue || !!cellDescription ? (
			<div className="cell-body">
				{!!cellValue && (
					<p className="cell-value">
						<TruncatedTooltipText>{cellValue}</TruncatedTooltipText>
					</p>
				)}
				{!!cellDescription && (
					<p className="cell-description">{`${cellDescription}`}</p>
				)}
			</div>
		) : isActionCell || !!badgeLabel ? (
			false
		) : (
			"-"
		);
	}, [value, description, render]);

	const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
		if (disabled) {
			return;
		}
		if (button && button.onClick) {
			e.stopPropagation();
			button.onClick(item, e);
			return;
		}
		if (onClick) {
			onClick(item, e);
		}
		if (onSelect) {
			e.stopPropagation();
			refs.checkbox.current?.click();
		}
		if (refs.itemActions.current) {
			e.stopPropagation();
			refs.itemActions.current.click();
		}
	};

	const isSelectable = useMemo(() => {
		if (typeof selectable === "function") {
			return selectable(item);
		}
		return selectable;
	}, [selectable, item]);

	const isClickable = useMemo(() => {
		if (disabled) return false;
		if (typeof props.clickable === "function") {
			return props.clickable(item);
		}
		if (isSelectable || filteredItemActions?.length) {
			return true;
		}
		return props.clickable || !!onClick || !!button;
	}, [props.clickable, item, onClick]);

	return (
		<td
			data-ras-table-cell-wrapper
			style={{
				paddingRight: marginRight,
				...(size
					? {
							width: `${(100 / 12) * size}%`,
							minWidth: `${(100 / 12) * size}%`,
						}
					: {}),
			}}
		>
			<div
				ref={refs.cell}
				className={className}
				data-show-on-hover={showOnHover ? "true" : undefined}
				data-clickable={isClickable ? "true" : undefined}
				data-testid="table-cell"
				data-ras-table-cell
				data-selected={checked ? "true" : undefined}
				onClick={handleClick}
				role={isClickable ? "button" : undefined}
				tabIndex={isClickable ? 0 : undefined}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.stopPropagation();
						e.preventDefault();
						handleClick(e);
					}
				}}
			>
				<div
					className="table-cell"
					onFocus={(e) => {
						if (e.target.className.includes("table-cell")) {
							refs.cell.current?.focus();
						}
					}}
				>
					{onSelect && (
						<Checkbox
							ref={refs.checkbox}
							onClick={(e) => {
								if (isSelectable) {
									e.stopPropagation();
								}
							}}
							onChange={(e) => {
								if (isSelectable) {
									e.stopPropagation();
									onSelect(e.target.checked, item, e);
								}
							}}
							checked={checked}
							onKeyDown={(e) => {
								if (isSelectable) {
									e.stopPropagation();
								}
							}}
							disabled={!isSelectable || disabled}
							tabIndex={-1}
						/>
					)}
					{!!filteredItemActions?.length && (
						<Popover
							content={
								<Picto
									icon="more"
									className="actions_picto"
									wrapperClassName="w-6"
									rotation={90}
								/>
							}
							isOpen={disabled ? false : undefined}
							closeOnLeave={true}
							ref={refs.itemActions}
							floatingProps={{
								strategy: itemsActionsStrategy,
							}}
							tabIndex={-1}
						>
							{filteredItemActions.map((action, index) => {
								const isDisabled =
									typeof action.disabled === "function"
										? action.disabled(item)
										: action.disabled;

								return (
									<div
										key={index}
										className={cn([
											"action-item",
											isDisabled && "disabled",
										])}
										onClick={(e) => {
											if (isDisabled) {
												e.stopPropagation();
												return;
											}
											e.stopPropagation();
											action.onClick(item, e);
										}}
										role="button"
										tabIndex={0}
										onKeyDown={() => {}}
									>
										{action.icon && (
											<Picto
												icon={action.icon}
												className="picto"
											/>
										)}
										<span className="label">
											{action.label}
										</span>
									</div>
								);
							})}
						</Popover>
					)}
					{!!picto && (
						<Picto
							icon={
								typeof picto === "function"
									? picto(item)
									: picto
							}
							className="al__table-cell__picto"
							wrapperClassName="al__table-cell__picto"
						/>
					)}
					{genCellBody}
					{!!badgeLabel && (
						<Tag
							data-testid="badge"
							color={badgeColor}
							size={badgeSize}
						>
							{badgeLabel}
						</Tag>
					)}
					{!!button && (
						<Button
							disabled={disabled || !isClickable}
							{...button}
							tabIndex={-1}
							onClick={(e) => {
								if (onClick) {
									e.stopPropagation();
								}
								button.onClick?.(item, e);
							}}
						>
							{button.children}
						</Button>
					)}
				</div>
			</div>
		</td>
	);
};

export const TableCell = memo(TableCellInner) as typeof TableCellInner;
